import { warn } from "./log";
import { effect, flush, untrack } from "./reactivity";
import { clean, parseHTML, toFragment } from "./sanitize";
import {
  parseReference,
  readReference,
  requireReference,
  type Scope,
  writeReference,
} from "./scope";
import { childController } from "./signal";
import { parseDuration, withTiming } from "./time";

interface Snapshot {
  ok: boolean;
  status: number;
  headers: Headers;
  text: string;
  url: string;
}

const RENDER_MODES = new Set(
  "replace outer append prepend before after remove text merge".split(" "),
);
const NATIVE_ACTION: Record<string, string> = { form: "submit", a: "click" };
const shared = new Map<string, Promise<Snapshot>>();

const snapshot = async (response: Response): Promise<Snapshot> => ({
  ok: response.ok,
  status: response.status,
  headers: response.headers,
  text: await response.text(),
  url: response.url,
});

const sharedGet = (url: string, headers: Headers) => {
  const key = `${url}\u0000${[...headers].join("\u0000")}`;
  let request = shared.get(key);
  if (!request) {
    request = fetch(url, { headers }).then(snapshot);
    shared.set(key, request);
    request.finally(() => shared.delete(key)).catch(() => {});
  }
  return request;
};

const abortable = <T>(promise: Promise<T>, signal: AbortSignal) =>
  new Promise<T>((resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    promise.then(resolve, reject);
  });

const parseBody = (snap: Snapshot): unknown => {
  if (!snap.headers.get("content-type")?.includes("json")) return snap.text;
  try {
    return JSON.parse(snap.text);
  } catch {
    return snap.text;
  }
};

export const wantsFetch = (el: Element) =>
  el.hasAttribute("fetch") ||
  ((el.localName === "form" || el.localName === "a") &&
    (el.hasAttribute("into") || el.hasAttribute("render") || el.hasAttribute("busy")));

const defaultTrigger = (el: Element) => {
  if (el.localName === "form") return "submit";
  if (el.localName === "input" || el.localName === "select" || el.localName === "textarea")
    return "change";
  return "click";
};

const morph = (from: Node, to: Node) => {
  if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) {
    (from as ChildNode).replaceWith(to);
    return;
  }
  if (!(from instanceof Element)) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
    return;
  }
  const target = to as Element;
  for (const { name } of [...from.attributes])
    if (!target.hasAttribute(name)) from.removeAttribute(name);
  for (const { name, value } of [...target.attributes])
    if (from.getAttribute(name) !== value) from.setAttribute(name, value);
  if (from.matches(":focus")) return;
  morphChildren(from, target);
};

const morphChildren = (from: ParentNode, to: ParentNode) => {
  const incoming = [...to.childNodes];
  const current = [...from.childNodes];
  incoming.forEach((node, index) => {
    const existing = current[index];
    if (existing) morph(existing, node);
    else from.append(node);
  });
  for (const extra of current.slice(incoming.length)) extra.remove();
};

type Into = (
  list: Record<string, unknown>[],
  added: Record<string, unknown>[],
  key: string,
) => unknown[];

const INTO: Record<string, Into> = {
  append: (list, added) => [...list, ...added],
  prepend: (list, added) => [...added, ...list],
  update: (list, added, key) => {
    const incoming = new Map(added.map((item) => [item[key], item]));
    const kept = list.map((item) => {
      const fresh = incoming.get(item[key]);
      incoming.delete(item[key]);
      return fresh ?? item;
    });
    return [...kept, ...incoming.values()];
  },
  remove: (list, added, key) => {
    const gone = new Set(added.map((item) => item[key]));
    return list.filter((item) => !gone.has(item[key]));
  },
};

const watchTrigger = (text: string, run: (event: Event) => void, scope: Scope) => {
  const reference = requireReference(text, "trigger", scope);
  if (!reference) return;
  let previous: string | undefined;
  const stop = effect(() => {
    const current = JSON.stringify(readReference(reference, scope)) ?? "";
    if (previous !== undefined && current !== previous)
      untrack(() => run(new CustomEvent("change")));
    previous = current;
  });
  scope.signal.addEventListener("abort", stop);
};

type Insert = (target: Element, fragment: DocumentFragment) => void;

const replace: Insert = (target, fragment) => target.replaceChildren(fragment);

const INSERT: Record<string, Insert> = {
  replace,
  outer: (target, fragment) => target.replaceWith(fragment),
  append: (target, fragment) => target.append(fragment),
  prepend: (target, fragment) => target.prepend(fragment),
  before: (target, fragment) => target.before(fragment),
  after: (target, fragment) => target.after(fragment),
  merge: (target, fragment) => morphChildren(target, fragment),
};

const render = (target: Element, text: string, mode: string, select: string | null) => {
  if (mode === "text") target.textContent = text;
  if (mode === "remove") target.remove();
  if (mode === "text" || mode === "remove") return;
  const body = clean(parseHTML(text));
  if (select) body.replaceChildren(...body.querySelectorAll(select));
  (INSERT[mode] ?? replace)(target, toFragment(body));
};

const collectParams = (el: Element, scope: Scope, data: FormData) => {
  const text = el.getAttribute("params");
  if (!text) return;
  for (const pair of text.split(",")) {
    const [rawName = "", rawRef = ""] = pair.split(":");
    const name = rawName.trim();
    const reference = requireReference(rawRef.trim(), `params ${name}`, scope);
    if (!reference) continue;
    const value = readReference(reference, scope);
    data.append(
      name,
      typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? ""),
    );
  }
};

const formData = (el: Element, submitter: HTMLElement | null) => {
  if (el instanceof HTMLFormElement) return new FormData(el, submitter);
  const data = new FormData();
  const field = el as HTMLInputElement;
  if (field.name && "value" in field) data.append(field.name, field.value);
  return data;
};

export const setupFetch = (el: Element, scope: Scope) => {
  const { instance } = scope;
  const tag = instance.host.localName;
  const into = el.hasAttribute("into")
    ? requireReference(el.getAttribute("into"), "into", scope)
    : undefined;
  const busy = el.hasAttribute("busy")
    ? requireReference(el.getAttribute("busy"), "busy", scope)
    : undefined;
  const headersRef = el.hasAttribute("headers")
    ? parseReference(el.getAttribute("headers") as string)
    : undefined;
  const renderRef = el.getAttribute("render");
  const renderMode = el.getAttribute("render-mode") ?? "replace";
  if (!RENDER_MODES.has(renderMode)) warn(`<${tag}> render-mode="${renderMode}" is not supported.`);
  let current: AbortController | undefined;

  const dispatch = (type: string, detail: unknown, cancelable = false) =>
    el.dispatchEvent(new CustomEvent(type, { detail, cancelable }));

  const setBusy = (value: boolean) => {
    if (busy) writeReference(busy, scope, () => value);
    if (value) el.setAttribute("aria-busy", "true");
    else el.removeAttribute("aria-busy");
  };

  const send = async (submitter: HTMLElement | null) => {
    flush();
    const form = el instanceof HTMLFormElement ? el : null;
    const anchor = el instanceof HTMLAnchorElement ? el : null;
    const base =
      submitter?.getAttribute("formaction") ??
      el.getAttribute("fetch") ??
      (form ? form.action : (anchor as HTMLAnchorElement).href);
    const url = new URL(base, el.baseURI);
    const method = (
      submitter?.getAttribute("formmethod") ??
      el.getAttribute("method") ??
      "get"
    ).toUpperCase();
    if (!dispatch("loadstart", { url: url.href, method }, true)) return;

    current?.abort();
    const controller = childController(scope.signal);
    const { signal } = controller;
    current = controller;
    const timeout = el.getAttribute("timeout");
    const timer = timeout
      ? setTimeout(
          () => controller.abort(new DOMException("Timed out", "TimeoutError")),
          parseDuration(timeout),
        )
      : undefined;

    const data = formData(el, submitter);
    collectParams(el, scope, data);
    const headers = new Headers(
      (headersRef && (readReference(headersRef, scope) as HeadersInit)) || undefined,
    );
    instance.setLoading(1);
    setBusy(true);
    try {
      let request: Promise<Snapshot>;
      if (method === "GET") {
        for (const [name, value] of data) url.searchParams.append(name, value as string);
        request = sharedGet(url.href, headers);
      } else {
        const multipart = form?.enctype === "multipart/form-data";
        const body = multipart
          ? data
          : new URLSearchParams(data as unknown as Record<string, string>);
        request = fetch(url, { method, body, headers }).then(snapshot);
      }
      const snap = await abortable(request, signal);
      const detail = {
        status: snap.status,
        data: parseBody(snap),
        headers: snap.headers,
        url: snap.url,
      };
      if (!snap.ok) {
        dispatch("error", detail);
        return;
      }
      if (into) {
        const mode = el.getAttribute("into-mode") ?? "replace";
        writeReference(into, scope, (existing) => {
          if (mode === "replace") return detail.data;
          const list = Array.isArray(existing) ? existing : [];
          const added = Array.isArray(detail.data) ? detail.data : [detail.data];
          return (INTO[mode] ?? (INTO.append as Into))(
            list,
            added,
            el.getAttribute("into-key") ?? "id",
          );
        });
      }
      if (renderRef !== null) {
        const target = instance.refs[renderRef];
        if (target) render(target, snap.text, renderMode, el.getAttribute("render-select"));
        else warn(`<${tag}> render="${renderRef}" does not match any ref.`);
      }
      if (anchor && renderRef !== null) history.pushState({}, "", url);
      dispatch("load", detail);
    } catch (error) {
      if (signal.aborted) {
        const reason = signal.reason as DOMException;
        dispatch(reason.name === "TimeoutError" ? "timeout" : "abort", { url: url.href });
      } else
        dispatch("error", {
          status: 0,
          data: undefined,
          message: (error as Error).message,
          url: url.href,
        });
    } finally {
      clearTimeout(timer);
      controller.abort();
      instance.setLoading(-1);
      if (current === controller) {
        current = undefined;
        setBusy(false);
      }
      dispatch("loadend", { url: url.href });
    }
  };

  const run = (event?: Event) => void send(event instanceof SubmitEvent ? event.submitter : null);
  const timed = withTiming(el, run, scope.signal);
  const owned = NATIVE_ACTION[el.localName];
  if (owned)
    el.addEventListener(owned, (event) => event.preventDefault(), { signal: scope.signal });

  const triggers = (el.getAttribute("trigger") ?? defaultTrigger(el))
    .split(/[\s,]+/)
    .filter(Boolean);
  for (const trigger of triggers) {
    if (trigger === "load") queueMicrotask(() => run());
    else if (trigger === "visible") {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) run();
      });
      observer.observe(el);
      scope.signal.addEventListener("abort", () => observer.disconnect());
    } else if (/^[#@]/.test(trigger)) watchTrigger(trigger, timed, scope);
    else el.addEventListener(trigger, timed, { signal: scope.signal });
  }
  const poll = el.getAttribute("poll");
  if (poll) {
    const timer = setInterval(run, parseDuration(poll));
    scope.signal.addEventListener("abort", () => clearInterval(timer));
  }
};
