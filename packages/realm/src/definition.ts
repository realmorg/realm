import { collectHandlers, setupSource } from "./assemble";
import { type CssBindings, scanCss } from "./css";
import { mountElementClass } from "./element";
import { warn } from "./log";
import { EMPTY_SETUP, nextId, RUNTIME, runSetupScript, settingUp } from "./registry";
import { parseSource } from "./sanitize";
import type { Definition, Setup } from "./types";

const BASE_SHEET = new CSSStyleSheet();
BASE_SHEET.replaceSync(
  "is-visible,is-hidden,repeat-list{display:contents}:host([hidden]),[hidden]:not([hidden=until-found]){display:none!important}:not(:defined,is-visible,is-hidden,repeat-list){visibility:hidden}",
);

const definitions = new Map<string, Definition>();

const EVENT_NAMES = /(?:new\s+(?:Custom)?Event|\bdispatch)\s*\(\s*(["'`])([a-z][\w-]*)\1/g;

const sheetFor = (child: Element, base: string) => {
  const sheet = new CSSStyleSheet();
  if (child.localName === "style") {
    sheet.replaceSync(child.textContent as string);
    return sheet;
  }
  const href = new URL(child.getAttribute("href") ?? "", base).href;
  fetch(href)
    .then((response) =>
      response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)),
    )
    .then((css) => sheet.replace(css))
    .catch((error: Error) => warn(`Could not load stylesheet ${href}: ${error.message}`));
  return sheet;
};

const loadSetup = async (definition: Definition, url: string) => {
  try {
    const module = (await import(/* @vite-ignore */ url)) as { names: string[]; default: Setup };
    definition.names = new Set(module.names);
    definition.setup = module.default;
  } catch (error) {
    warn(`<${definition.name}> could not load its script ${url}: ${(error as Error).message}`);
    definition.setup = EMPTY_SETUP;
  }
};

export const defineComponent = async (
  element: Element,
  base: string,
  inline: boolean,
): Promise<void> => {
  const source = element.outerHTML;
  const el = parseSource(source).querySelector("custom-element") as Element;
  const name = el.getAttribute("name") ?? "";
  if (!name.includes("-")) {
    warn(`<custom-element name="${name}"> needs a name that contains a dash, like "todo-app".`);
    return;
  }
  const existing = definitions.get(name);
  if (existing) {
    if (existing.source !== source)
      warn(
        `<${name}> is defined twice with different sources (${existing.base} and ${base}). Keeping the first.`,
      );
    return;
  }
  if (customElements.get(name)) {
    warn(`<${name}> is already defined by another library.`);
    return;
  }

  const scripts: HTMLScriptElement[] = [];
  const sheets = [BASE_SHEET];
  const css: CssBindings = { variables: new Set(), states: new Set() };
  const markup = el.ownerDocument.createDocumentFragment();
  for (const child of [...el.childNodes]) {
    const element = child as Element;
    if (element.matches?.("script")) scripts.push(element as HTMLScriptElement);
    else if (element.matches?.("style, link[rel=stylesheet]")) {
      sheets.push(sheetFor(element, base));
      scanCss(child.textContent as string, css);
    } else markup.append(child);
  }
  if (scripts.length > 1) warn(`<${name}> has more than one <script>. Only the first is used.`);
  const script = scripts[0];
  if (inline && script && script.type !== "realm") {
    warn(
      `<${name}> is defined in the page, so its <script> needs type="realm". A plain <script> already ran in the page scope.`,
    );
  }

  const found = collectHandlers(markup.children);
  const text = script?.textContent ?? "";
  const src = script?.getAttribute("src");
  const definition: Definition = {
    name,
    source,
    base,
    markup,
    sheets,
    names: new Set(),
    handlers: new Map([...found.keys()].map((key, index) => [key, index])),
    events: [...new Set([...text.matchAll(EVENT_NAMES)].map((match) => match[2] as string))],
    formAssociated: el.hasAttribute("form-associated"),
    role: el.getAttribute("role"),
    slot: el.getAttribute("slot"),
    delegatesFocus: el.hasAttribute("delegates-focus"),
    css,
    setup: undefined as unknown as Setup,
  };
  definitions.set(name, definition);
  settingUp.add(name);
  if (src) await loadSetup(definition, new URL(src, base).href);
  else if (!text.trim() && !found.size) definition.setup = EMPTY_SETUP;
  else {
    const id = nextId(name);
    const { imports, setup, names } = setupSource(text, base, found);
    definition.names = names;
    definition.setup = await runSetupScript(
      id,
      `${imports}\n${RUNTIME}.register(${JSON.stringify(id)}, ${setup});\n//# sourceURL=${base.split("#")[0]}#${name}`,
      imports !== "",
      name,
    );
  }
  settingUp.delete(name);
  mountElementClass(definition);
};

export const getDefinition = (name: string) => definitions.get(name);
