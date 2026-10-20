import { expect, test } from "vitest";
import { start } from "../src/start";

test("start keeps an import-element that is already defined", () => {
  class Existing extends HTMLElement {}
  customElements.define("import-element", Existing);
  start();
  expect(customElements.get("import-element")).toBe(Existing);
});
