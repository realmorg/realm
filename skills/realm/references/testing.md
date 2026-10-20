# Checking a REALM page in a browser

REALM runs only in a browser, so check the result in one. A page "works" when every custom element is defined, nothing in the console starts with `[realm]`, and the interactions do what they should.

## 1. Serve the page

`<import-element>` loads files with `fetch`, so open pages over HTTP, not `file://`:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

Any static server works (`npx serve`, an editor's live preview). Use `localhost` or HTTPS: REALM uses `crypto.randomUUID`, which browsers only provide in secure contexts.

## 2. Read the console

- `[realm]` warnings name the component and the problem. Each is printed once. pitfalls.md lists every message and its fix.
- `console.error` entries from REALM are errors thrown by your script, an observer or a getter. The component still renders.
- `Could not import … (HTTP 404)` means an `<import-element from>` path is wrong. Paths in component files resolve against the file.

## 3. Check that everything is defined

Undefined elements stay invisible (`realm.css` hides them), so a missing import looks like an empty space. Paste this into the browser console. It walks into shadow roots and lists custom tags that never got a definition:

```js
(() => {
  const SKIP = new Set(["is-visible", "is-hidden", "repeat-list"]);
  const missing = new Set();
  const visit = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.localName.includes("-") && !SKIP.has(el.localName) && !customElements.get(el.localName))
        missing.add(el.localName);
      if (el.shadowRoot) visit(el.shadowRoot);
    }
  };
  visit(document);
  return [...missing];
})();
```

An empty array is what you want. For a missing `ui-*` tag, import its file (ui-components.md lists which file defines each tag).

## 4. Inspect a component

- Select the element in the Elements panel and use `$0.shadowRoot` to see its rendered markup.
- Props are properties: `$0.value`, `$0.open = true`.
- Methods from `defineMethods` are callable: `document.querySelector("ui-dialog").showModal()`.
- Custom states: `$0.matches(":state(loading)")`.
- Wait for a definition: `await customElements.whenDefined("todo-app")`.

## 5. Automate it with Playwright

Playwright's CSS and role locators pierce open shadow roots, so REALM components can be tested like plain HTML. A minimal check (`npm i -D playwright` in a test folder, then `npx playwright install chromium`):

```js
// check-page.mjs: node check-page.mjs http://localhost:8000/
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:8000/";
const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.text().startsWith("[realm]")) problems.push(message.text());
});
page.on("pageerror", (error) => problems.push(error.message));

await page.goto(url, { waitUntil: "networkidle" });
const undefinedTags = await page.evaluate(() => {
  const SKIP = new Set(["is-visible", "is-hidden", "repeat-list"]);
  const missing = new Set();
  const visit = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.localName.includes("-") && !SKIP.has(el.localName) && !customElements.get(el.localName))
        missing.add(el.localName);
      if (el.shadowRoot) visit(el.shadowRoot);
    }
  };
  visit(document);
  return [...missing];
});
if (undefinedTags.length) problems.push(`Undefined elements: ${undefinedTags.join(", ")}`);

// Interactions: locators reach inside components.
// await page.getByRole("textbox", { name: "New todo" }).fill("Buy milk");
// await page.getByRole("button", { name: "Add" }).click();
// await expect(page.getByText("1 item left")).toBeVisible();

await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("No problems found.");
```

If your environment has a browser tool (a Playwright or Chrome integration), use it the same way: open the served page, read the console, run the snippet from step 3, then click through the feature.

## 6. Things worth trying by hand

- The keyboard only: Tab, Shift+Tab, Enter, Space, Escape, and the arrow keys in menus, tabs and toolbars.
- Dark mode: `document.documentElement.dataset.theme = "dark"`.
- A narrow window (about 375px wide). `ui-sidebar-layout` switches to an off-canvas sidebar.
- Removing and re-adding a component, for anything with timers, listeners or polling: it should stop cleanly, with no errors.
- Slow or failing requests (the Network panel's throttling and request blocking) for anything with fetch attributes: loading and error states should show.
