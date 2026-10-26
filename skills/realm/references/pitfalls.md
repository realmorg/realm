# Pitfalls

Common mistakes, what goes wrong, and the fix. Then every console message REALM prints.

## Markup

| Mistake | What happens | Fix |
| --- | --- | --- |
| `<p>Hello {{name}}</p>`, `${name}` or `{name}` in markup | Shown as literal text | `<p>Hello <slot name="#user.name"></slot></p>` |
| `_hidden="#cart.items.length === 0"`, `when="#count > 3"`, `_class="active ? 'on' : ''"` | Warning: must be a reference. The binding is skipped | A getter (`get isEmpty()`) and `_hidden="#cart.isEmpty"`, or `when="#count" gt="3"`, or `_data-active="#tab.active"` |
| `_value="form.email"` (no `#`) | Warning: must be a reference | `_value="#form.email"` |
| `_value="#form.email"` with no handler | The field shows the value, but typing never reaches state | Add `oninput="setEmail(this.value)"`. Bindings are one-way |
| `<repeat-list>` or `<is-visible>` inside `<ul>`, `<table>`, `<tr>`, `<select>` | The parser moves it out. The list renders in the wrong place or not at all | `<li repeat="#todo.items" as="item" key="id">`, `_hidden` on rows |
| A reorderable list without `key` | Rows are matched by position: focus and typed text jump between rows | `key="id"` |
| Hiding a form with `<is-visible>` | Its content is removed and typed values are lost | `_hidden="!#panel.open"` keeps it in the DOM |
| `_invalid="#form.error"` where the error can be `""` | `""` is written as an attribute, so the boolean is `true` | Use `null` or `undefined` for "no value", or bind a boolean getter |
| `_class="#tab.className"` to toggle one class | Replaces the whole class list | `_data-active="#tab.active"` with `[data-active]` in CSS, or a `:state()` |
| `<todo-app />` | Not valid for custom elements: everything after it becomes its child | `<todo-app></todo-app>` |
| A component that renders itself with no condition | It nests until REALM stops it at 1000 levels with a warning | Put the nested copy inside `<is-visible>` with a getter that turns false, such as `hasChildren` |
| `slot="title"` on `<ui-dialog-title>` or other parts | Not needed, can break placement | Write parts without `slot`. They assign themselves |
| `style="…"` on `ui-*` elements | Fights the component's own styles and the theme | Attributes (`variant`, `size`), a class in your component's `<style>`, or `::part()` |
| `document.querySelector("todo-app input")` | Shadow roots hide component internals | `ref="field"` and `refs.field` inside the component, or a method from `defineMethods` |

## Script

| Mistake | What happens | Fix |
| --- | --- | --- |
| `let count = 0; function add() { count++; }` | The page never updates | `const counter = useState({ count: 0 })` and `counter.count++` |
| `const { label } = defineProps(…)` or `const { items } = todo` | Destructuring reads the value once. Later changes are missed | Keep the object: `props.label`, `todo.items` |
| A function defined inside another function, called from markup | Not a top-level name, so the handler cannot find it | Declare it at the top level of the script |
| `refs.input.focus()` at the top level of the script | `refs` is empty before the markup exists | `onConnected(() => refs.input.focus())`, or `await tick()` after a state change |
| `window.addEventListener(…)`, `window.setInterval(…)` | Keeps running after the element is removed | `listen("resize", fn, window)`, the script's own `setInterval`, or `{ signal }` |
| Calling `defineProps` twice | Throws `called defineProps more than once` | One schema with every prop |
| `prop.boolean().default(true)` | A boolean prop is `true` only while the attribute is present. An absent attribute is `false`, whatever the default | Name it for the non-default case: `hide-close`, `no-animate`, `collapsed` |
| `props.value = "3"` on a number prop | Invalid, falls back to the default with a warning | Write the right type: `props.value = 3` |
| Writing an undeclared prop: `props.open = true` | Warning, nothing happens | Declare it, or keep it in `useState` |
| Arrow-function "getters": `total: () => …` in `useState` | A plain function, not a cached reactive value. Markup cannot call it | `get total() { return … }` |
| Storing a `Map`, `Set` or `Date` and mutating it | Not tracked inside | Replace it (`state.tags = new Set([...state.tags, tag])`) or use arrays and objects |
| State names with dashes used in CSS (`#todo.done-count` → `--state-todo-done-count`) | Dashes split the path, so it reads `todo.done.count` | camelCase: `#todo.doneCount`, `var(--state-todo-doneCount)` |
| `dispatch("itemSelected")` or `dispatch("item-selected")` | Handler names read badly, and the page property `onitem-selected` is awkward | Lowercase, no dashes: `dispatch("select", …)`, handled with `onselect` |
| An observer that writes what it reads | `Update loop detected` after 100 rounds | Derive with a getter instead, or read with `untrack` |

## Definitions and files

| Mistake | What happens | Fix |
| --- | --- | --- |
| Inline definition with a plain `<script>` or `<script type="module">` | It already ran as page code. Warning: needs `type="realm"` | `<script type="realm">` and `<style type="realm">` |
| `type="realm"` in a component file | Works, but is not the convention | Plain `<script>` (or `type="module"` with imports) in files |
| `<custom-element name="counter">` | Warning: needs a dash. Nothing is defined | `name="click-counter"` |
| Opening a page that uses `<import-element>` from `file://` | `Could not import …` (fetch is blocked) | Serve over HTTP: `python3 -m http.server` |
| A component uses `ui-button` but its file does not import `button.html` | Works only on pages that happen to import it | Import every dependency at the top of the component file |
| Fetching `@realmorg/realm` in a module from a different version or URL than the page | Two runtimes: stores and definitions are not shared | Import `index.js` from the same URL as the page's `realm.js` |
| Missing `realm.css` | Definitions and undefined elements flash on load | Load it in `<head>` before anything renders |
| Missing `theme.css` | Tokens such as `var(--spacing)` are undefined, layouts collapse | Load `https://realm.js.org/dist/ui/theme.css` |
| `npm install` and a bundler for a REALM page | Not needed, and the runtime must be shared | CDN tags. REALM has no build step |

## Fetching

| Mistake | What happens | Fix |
| --- | --- | --- |
| `into="#items"` | Warning: can't be written | A property path: `into="#list.items"` |
| `into="@items"` | Props are read-only for fetch | State: `into="#list.items"` |
| `onload` on a parent element to catch a child's request | Request events do not bubble | Put `onload`/`onerror` on the fetching element |
| `poll="30s"` alone | Nothing loads for 30 seconds | `trigger="load" poll="30s"` |
| Writing a fetch `<form>` and also calling `fetch()` in `onsubmit` | Two requests | Use one: the attributes, or a script with `event.preventDefault()` |
| Expecting `into` on an error | `into` and `render` are only applied on 2xx | Handle `onerror="failed(event.detail)"` |

## Console messages

REALM writes to the console with the prefix `[realm]`. Warnings use `console.warn` and each distinct message is shown once per page. Errors thrown by your code use `console.error`.

<!-- generated:console -->
### Definitions

| Message | Cause |
| --- | --- |
| `<custom-element name="x"> needs a name that contains a dash, like "todo-app".` | The `name` has no dash. Nothing is defined |
| `<x-a> is defined twice with different sources (a.html and b.html). Keeping the first.` | Two different definitions use the same name. An identical second definition is ignored silently |
| `<x-a> is already defined by another library.` | `customElements` already has that name |
| `<x-a> has more than one <script>. Only the first is used.` | Extra direct `<script>` children |
| `<x-a> is defined in the page, so its <script> needs type="realm". A plain <script> already ran in the page scope.` | An inline definition uses a plain `<script>` |
| `<x-a> has an error in its <script>. The component renders without it.` | The script has a syntax error, or one of its imports failed |
| `<x-a> could not load its script URL: message` | `<script src>` failed to load |
| `Could not load stylesheet URL: message` | A `<link rel="stylesheet">` in a definition failed |
| `<x-a> is nested 1000 deep. Stop its recursion with a condition.` | The component renders itself without a condition that stops it. It is not set up past that depth. See [Recursive components](https://realm.js.org/docs/control-flow/#recursive-components) |

### Imports

| Message | Cause |
| --- | --- |
| `<import-element> needs a from attribute.` | `from` is missing |
| `<import-element from="…" loading="lazy"> needs a for attribute listing the tags it defines.` | Lazy import without `for`. It loads immediately |
| `Could not import URL (HTTP 404)` | The file failed. `(HTTP …)` is left out for network errors |

### Props

| Message | Cause |
| --- | --- |
| `<x-a> prop "amount" must be at least 0. Using the default.` | An attribute or property value failed a [`prop`](https://realm.js.org/reference/script/prop/) rule. The text after the prop name describes the rule |
| `<x-a> "name" is not a declared prop.` | Writing a key that `defineProps` did not declare |
| `<x-a> called defineProps more than once.` | Thrown as an error from the script |

### References and markup

| Message | Cause |
| --- | --- |
| `<x-a> attribute="…" must be a reference like "#state.path" or "@prop".` | A reference attribute holds something else |
| `<x-a> "#todo.itmes" is not defined in this component or its parents.` | The first name of a reference is unknown |
| `<x-a> reads "session" from <app-shell>.` | A reference or handler name was found in a parent component. Pass it as a prop to make the dependency explicit |
| `<x-a> repeat has a duplicate key "3".` | Two items share a `key` value. The duplicate gets its own row |
| `"…" is not a duration. Use values like "300ms", "2s" or "1m".` | A bad `debounce`, `throttle`, `poll` or `timeout` |

### Fetch attributes

| Message | Cause |
| --- | --- |
| `<x-a> render-mode="…" is not supported.` | Unknown `render-mode`. `replace` is used |
| `<x-a> render="…" does not match any ref.` | No element has that `ref` |
| `<x-a> "#todo" can't be written. Use a state property like "#todo.items".` | `into` or `busy` is a prop, a negation, or a bare name |
| `<x-a> "#a.b" can't be written because its parent is not an object.` | `#a` is not an object when the response arrives |

### Stores and reactivity

| Message | Cause |
| --- | --- |
| `Stored value for store "cart" is not valid JSON and was ignored.` | Corrupt persisted data. The initial values are kept |
| `Update loop detected: an observer keeps changing state it depends on.` | An error: observers re-ran 100 times in one flush. The queue is cleared |

Errors thrown inside a component script, an observer or a getter are reported with `console.error` and do not stop other components or observers.
<!-- /generated:console -->
