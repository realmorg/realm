import { defineComponent } from "./definition";
import { warn } from "./log";
import { parseSource } from "./sanitize";

const MAX_PER_ORIGIN = 6;
const documents = new Map<string, Promise<Document>>();
const active = new Map<string, number>();
const waiting = new Map<string, (() => void)[]>();
const seen = new Set<string>();
const lazy = new Map<string, (() => void)[]>();

class ImportError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
  ) {
    super(`Could not import ${url}${status ? ` (HTTP ${status})` : ""}`);
  }
}

const acquire = (origin: string) =>
  new Promise<void>((resolve) => {
    const count = active.get(origin) ?? 0;
    if (count < MAX_PER_ORIGIN) {
      active.set(origin, count + 1);
      resolve();
    } else {
      const queue = waiting.get(origin) ?? [];
      queue.push(() => resolve());
      waiting.set(origin, queue);
    }
  });

const release = (origin: string) => {
  const next = waiting.get(origin)?.shift();
  if (next) next();
  else active.set(origin, (active.get(origin) as number) - 1);
};

const load = (url: string) => {
  let request = documents.get(url);
  if (request) return request;
  const { origin } = new URL(url);
  request = acquire(origin)
    .then(() => fetch(url))
    .then(async (response) => {
      if (!response.ok) throw new ImportError(url, response.status);
      return parseSource(await response.text());
    })
    .catch((error: unknown) => {
      throw error instanceof ImportError ? error : new ImportError(url, 0);
    })
    .finally(() => release(origin));
  documents.set(url, request);
  return request;
};

export const importDefinitions = async (url: string, chain: ReadonlySet<string> = new Set()) => {
  const doc = await load(url);
  const path = new Set([...chain, url]);
  const dependencies = [...doc.querySelectorAll("import-element[from]")]
    .filter((el) => !el.closest("custom-element"))
    .map((el) => new URL(el.getAttribute("from") as string, url).href)
    .filter((dependency) => !path.has(dependency));
  await Promise.all(dependencies.map((dependency) => importDefinitions(dependency, path)));
  await Promise.all(
    [...doc.querySelectorAll("custom-element")].map((el) => defineComponent(el, url, false)),
  );
};

export const noticeTag = (name: string) => {
  if (seen.has(name)) return;
  seen.add(name);
  for (const resume of lazy.get(name) ?? []) resume();
  lazy.delete(name);
};

const whenUsed = (names: string[]) =>
  new Promise<void>((resolve) => {
    if (names.some((name) => seen.has(name) || document.querySelector(name))) return resolve();
    for (const name of names) lazy.set(name, [...(lazy.get(name) ?? []), resolve]);
  });

export const watchDocumentTags = (root: Document) => {
  const scan = (node: Element) => {
    if (node.localName.includes("-")) noticeTag(node.localName);
    for (const child of node.querySelectorAll("*"))
      if (child.localName.includes("-")) noticeTag(child.localName);
  };
  new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes) if (node instanceof Element) scan(node);
  }).observe(root, { childList: true, subtree: true });
};

export class ImportElement extends HTMLElement {
  #started = false;
  readonly #states = this.attachInternals().states;

  async connectedCallback() {
    if (this.#started || this.closest("custom-element")) return;
    this.#started = true;
    const from = this.getAttribute("from");
    if (!from) {
      warn("<import-element> needs a from attribute.");
      return;
    }
    const url = new URL(from, this.baseURI).href;
    const names = (this.getAttribute("for") ?? "").split(/\s+/).filter(Boolean);
    if (this.getAttribute("loading") === "lazy") {
      if (names.length) await whenUsed(names);
      else
        warn(
          `<import-element from="${from}" loading="lazy"> needs a for attribute listing the tags it defines.`,
        );
    }
    this.#states.add("loading");
    try {
      await importDefinitions(url);
      if (this.isConnected) this.dispatchEvent(new CustomEvent("load", { detail: { url } }));
    } catch (error) {
      const { status } = error as ImportError;
      warn((error as Error).message);
      if (this.isConnected)
        this.dispatchEvent(new CustomEvent("error", { detail: { url, status } }));
    }
    this.#states.delete("loading");
  }
}
