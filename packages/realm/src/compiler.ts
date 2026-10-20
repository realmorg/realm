import { collectHandlers, setupSource } from "./assemble";

const STYLES = "style, link[rel=stylesheet]";

export interface CompiledDefinition {
  name: string;
  script: Element | undefined;
  module: string;
}

export const compileDefinition = (definition: Element): CompiledDefinition | undefined => {
  const children = [...definition.children];
  const script = children.find((child) => child.localName === "script");
  if (script?.hasAttribute("src")) return undefined;
  const markup = children.filter((child) => child.localName !== "script" && !child.matches(STYLES));
  const text = script?.textContent ?? "";
  const handlers = collectHandlers(markup);
  if (!text.trim() && !handlers.size) return undefined;
  const { imports, setup, names } = setupSource(text, null, handlers);
  return {
    name: definition.getAttribute("name") ?? "",
    script,
    module: `${imports}\nexport const names = ${JSON.stringify([...names])};\nexport default ${setup};\n`,
  };
};

export { tokenize } from "./scan";
