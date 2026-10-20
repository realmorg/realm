# Script API

Everything a component `<script>` can use without importing, then the module exports.

## How the script runs

- The first `<script>` in a `<custom-element>` is the component script. Extra scripts are ignored with a warning.
- It is plain JavaScript in strict mode and runs **once per element**, when the element is first connected, before its markup exists.
- Top-level `const`, `let`, `var`, `function` and `class` names (destructured names too) and imported names are exposed: markup reads them with `#name.path` and handlers call them by name. Names declared inside functions or blocks are not visible to markup.
- Leading `import` statements are hoisted and the script runs as a module. Relative specifiers resolve against the file that holds the definition.
- An error at the top level is logged with `console.error` and the markup still renders. A syntax error (or a failed import) logs `<tag> has an error in its <script>` and the component renders without its script.
- The helpers below are not exposed to markup by themselves. Assign one to a top-level name if the markup needs it.

Order inside a script:

1. `defineProps`
2. `useState` and `defineStore`
3. functions
4. `defineMethods`, `listen`, lifecycle hooks
5. `observe`

```ts
defineProps<T extends Record<string, PropType>>(schema: T): Record<keyof T, unknown>
prop: { string, number, boolean, enum, date, array, object }
useState<T extends object>(initial: T): T
observe(fn: () => unknown): () => void
tick(): Promise<void>
defineStore<T extends object>(name: string, initial: T, options?: StoreOptions): T
attrs: Record<string, string | null>
dispatch(type: string, detail?: unknown, options?: CustomEventInit): boolean
listen(type: string, handler: (event: Event) => unknown, target?: EventTarget): void
defineMethods(methods: object): void
useChildren(selector: string, attributes?: string[]): Element[]
onConnected(fn: () => unknown): void
onDisconnected(fn: () => void): void
onFormReset(fn: () => void): void
onFormDisabled(fn: (disabled: boolean) => void): void
onFormStateRestore(fn: (state: unknown, mode: string) => void): void
lookup(name: string): unknown
host: HTMLElement
refs: Record<string, Element>
signal: AbortSignal
internals: ElementInternals
setTimeout(callback, delay?, ...args): number
setInterval(callback, delay?, ...args): number
clearTimeout(id?: number): void
clearInterval(id?: number): void
```

## Props and state

### `defineProps`

Declares the component's public attributes and returns a reactive object of their current values.

```js
const props = defineProps({
  label: prop.string().required(),
  size: prop.enum(["sm", "md", "lg"]).default("md"),
  count: prop.number().int().min(0).default(0).reflect(),
  disabled: prop.boolean(),
  maxItems: prop.number().default(10), // attribute max-items
  user: prop.object({ name: prop.string(), email: prop.string().email() }),
});
```

- Read in the script as `props.count`, in markup as `@count` (`<slot name="@label">`, `_disabled="@disabled"`).
- Each key is both an attribute and a property on the element. camelCase keys map to kebab-case attributes (`maxItems` → `max-items`) unless `.attribute("name")` says otherwise.
- Attribute changes are parsed and validated (through a `MutationObserver`, so they apply a microtask later). Property writes are validated without text conversion, so `el.count = "3"` is invalid for a number prop.
- A property set before the element was defined is kept and applied on upgrade.
- An invalid value logs `<tag> prop "count" must be at least 0. Using the default.` and uses the default. Invalid values never throw.
- Writing a declared prop from the script (`props.open = true`) goes through validation and reflects when the type has `.reflect()`. Writing an undeclared key logs `"name" is not a declared prop.` and does nothing. Keep internal values in `useState`.
- Call it once. A second call throws `<tag> called defineProps more than once.`
- Every prop is also available in CSS as `var(--attr-name)` and `:state(attr-name…)`. See styling.md.
- In a `form-associated` component, a `value` prop becomes the form value, a `checked` prop makes it submit only while checked, and `disabled` reads `true` inside a disabled `<fieldset>`. See forms-a11y.md.

### `prop`

The type builder for `defineProps`. Every method returns a new type, so types can be stored and reused.

| Builder | Value | Attribute text becomes |
| --- | --- | --- |
| `prop.string()` | `string` | the text as is |
| `prop.number()` | `number` | `Number(text)`. Empty text and `NaN` are invalid |
| `prop.boolean()` | `boolean` | present (any text, even `"false"`) is `true`, absent is `false` |
| `prop.enum(values)` | one of `values` | the text, checked against the list |
| `prop.date()` | `Date` | `new Date(text)`. Invalid dates are invalid |
| `prop.array(item?)` | array | `JSON.parse(text)`, each item checked with `item` |
| `prop.object(shape?)` | plain object | `JSON.parse(text)`, each key in `shape` checked |

| Modifier | Applies to | Meaning |
| --- | --- | --- |
| `.default(value)` | all | Used when the value is missing or invalid. Object and array defaults are cloned per element |
| `.required()` | all | A missing value is invalid (unless there is a default) |
| `.optional()` | all | Undoes `.required()` |
| `.reflect()` | all | Property writes also write the attribute (`true` → empty attribute, `false`/`null`/`undefined` → removed, objects → JSON, dates → ISO text) |
| `.attribute(name)` | all | Use this attribute name instead of the kebab-case key |
| `.min(n)`, `.max(n)` | string, number | Length for strings, value for numbers |
| `.int()` | number | Must be an integer |
| `.pattern(regex)` | string | Must match |
| `.email()` | string | Must look like `name@host.tld` |
| `.url()` | string | Must pass `URL.canParse` |

Without a default, a missing prop is `undefined`, except booleans, which are `false`. Pass arrays and objects from a parent with a binding (`<user-card _user="#session.user">`) instead of writing JSON by hand.

### `useState`

Returns a deep reactive proxy of a plain object or array.

```js
const todo = useState({
  items: [],
  filter: "all",
  get remaining() {
    return this.items.filter((item) => !item.done).length;
  },
});

todo.filter = "done";
todo.items.push({ id: 1, title: "Read the docs", done: false });
todo.items[0].done = true;
```

- Reads in slots, bindings, getters and observers subscribe. Writes notify only what read that property.
- Nested plain objects and arrays are reactive. Adding and deleting keys, `in`, `Object.keys` and `for…in` are tracked.
- Array index writes, `length`, `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill` and `copyWithin` notify. `includes`, `indexOf` and `lastIndexOf` find raw and proxied items.
- `Map`, `Set`, `Date` and class instances are stored as they are and are not tracked inside. Replace them to update.
- Writing the same value (`Object.is`) notifies nobody.
- A **getter** is a cached derived value. It recomputes only after something it read changed. Put formatting, filtering and comparisons in getters, because markup has no expressions.
- A setter runs with the proxy as `this`, so its writes are tracked.
- The object is not copied. `useState(sameObject)` returns the same proxy.
- Updates are batched and applied once per microtask.

Plain variables are not reactive. `let count = 0; count++` changes nothing on the page.

### `observe`

Runs a function now, and again whenever a reactive value it read changes. Returns `stop()`.

```js
observe(() => {
  document.title = `${todo.remaining} left`;
});

observe(() => {
  if (!clock.running) return;
  const id = setInterval(() => clock.ticks++, props.interval);
  return () => clearInterval(id);
});
```

- Dependencies are collected on every run. Only what the last run read is watched. There is no dependency list.
- A returned function runs before the next run and when the observer stops.
- In a component, observers stop when the element is removed.
- Re-runs are batched per microtask. An observer that keeps changing what it reads is stopped after 100 rounds with `Update loop detected`.
- Errors are reported with `console.error` and do not stop other observers.
- `refs` is reactive, so an observer that reads `refs.canvas` runs again once the markup exists.
- Prefer getters for derived values. Use `observe` for side effects (the DOM outside the component, storage, timers, third-party widgets).

### `tick`

Waits until pending updates are applied to the DOM.

```js
async function edit(item) {
  item.editing = true;
  await tick();
  refs.editor.focus();
}
```

### `defineStore`

Returns the app-wide reactive store called `name`, creating it on the first call. Available in scripts and exported from the package.

```js
const cart = defineStore(
  "cart",
  {
    items: [],
    get count() {
      return this.items.length;
    },
  },
  { persist: "local" },
);
```

| `persist` | Saved to |
| --- | --- |
| `"local"` | `localStorage` |
| `"session"` | `sessionStorage` |
| `{ get(key), set(key, value) }` | Your adapter (synchronous) |

- The same name always returns the same store, wherever it is called. Later calls ignore `initial` and `options`, so define it in one place (a shared module, see imports.md).
- Persisted under the key `realm:<name>` as JSON after every change (batched). Types survive a reload. Getters are never saved.
- Corrupt stored data logs a warning and the initial values are used.
- Stores are never torn down. Nothing is attached to `window`.

## The element

### `host`

The element itself. `host.shadowRoot` holds the markup (empty while the top level of the script runs). `host` is in scope inside handlers too.

```js
host.toggleAttribute("open", true);
const form = host.closest("form");
```

### `refs`

Elements marked with `ref="name"` in the markup.

```html
<canvas ref="chart"></canvas>
```

```js
onConnected(() => {
  const context = refs.chart.getContext("2d");
});
```

Empty while the script's top level runs, filled before `onConnected` hooks. Reactive. Inside loops the last mounted element with a name wins. `ref="control"` also marks the delegated control of a `form-associated` component, and `render="name"` targets a ref.

### `attrs`

Reactive read and write access to any host attribute, declared as a prop or not.

```js
const view = useState({
  get compact() {
    return attrs.density === "compact";
  },
});

attrs["data-state"] = "open"; // setAttribute("data-state", "open")
attrs.tabindex ??= 0; // sets tabindex="0" unless the page set one
attrs.density = null; // removeAttribute("density")
```

Reading gives the text or `null`. Writing `null`, `undefined` or `false` removes the attribute, `true` writes an empty one, anything else is written as text. For typed values use `defineProps`.

### `dispatch`

Sends a `CustomEvent` from the host. Defaults: `bubbles: true`, `composed: true`, `cancelable: true`. Returns `false` when a listener called `preventDefault()` (or a handler returned `false`).

```js
function choose(option) {
  if (!dispatch("pick", { value: option.value })) return;
  props.value = option.value;
}

dispatch("close", undefined, { bubbles: false, composed: false });
```

Name events like native ones: lowercase, no dashes. A parent handles them with `onpick="…"` in its markup. On a plain page, `onpick` works as an attribute and a property because REALM finds `dispatch("pick"`, `new CustomEvent("pick"` and `new Event("pick"` in the script.

### `listen`

`target.addEventListener(type, handler, { signal })` with the element's signal, so the listener is removed with the element. The target defaults to the host.

```js
listen("keydown", (event) => {
  if (event.key === "Escape") close();
});
listen("resize", measure, window);
listen("toast", (event) => show(event.detail), document);
```

The handler's return value is ignored. Call `event.preventDefault()` to cancel.

### `defineMethods`

Copies methods, getters and setters onto the element so page code and parents can call them. Removed when the element is removed.

```js
defineMethods({
  open() {
    panel.open = true;
  },
  close() {
    panel.open = false;
  },
  get isOpen() {
    return panel.open;
  },
});
```

```js
document.querySelector("side-panel").open();
```

### `useChildren`

A reactive array of the host's direct light DOM children that match a selector. For components that take `<option>`-like children.

```js
const options = useChildren("option", ["value", "label", "disabled"]);
const menu = useState({
  get items() {
    return options.map((option) => ({ value: option.value, label: option.label }));
  },
});
```

The array refreshes when children are added, removed or reordered, text inside them changes, one of the listed attributes changes, or a child REALM component finishes mounting.

### `lookup`

Returns a name from the nearest parent component that defines it as a top-level name, or from `globalThis`.

```js
const theme = lookup("theme");
```

Logs `<child> reads "theme" from <parent>.` once (not for compound parts). Prefer props for reusable components.

### `signal`

An `AbortSignal` that aborts when the element is removed (not when it is moved).

```js
const response = await fetch(`/api/users/${props.id}`, { signal });
window.addEventListener("resize", layout, { signal });
```

### `internals`

The element's `ElementInternals`.

```js
internals.states.add("expanded"); // matches :host(:state(expanded))
internals.setFormValue(props.tags.join(","));
internals.setValidity({ valueMissing: true }, "Pick at least one tag.");
```

REALM uses it for reactive `:state()` CSS, `:state(loading)`, the definition's `role`, and form association.

### `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`

Inside a component script and its handlers these are bound to the element: anything still pending when the element is removed is cleared. Same signatures and ids as the window versions. `window.setTimeout` is still available and is not cleared.

```js
const clock = useState({ time: new Date().toLocaleTimeString() });
setInterval(() => {
  clock.time = new Date().toLocaleTimeString();
}, 1000);
```

## Lifecycle

Connecting runs, in order: the script, reactive CSS, the markup (bindings, handlers, conditions, lists, fetch attributes, `refs`), the `ref="control"` wiring, the parent's `useChildren` refresh, then `onConnected` hooks. Removal waits one microtask, so moving an element keeps its state. On removal: `onDisconnected` hooks run, `signal` aborts (listeners, requests, timers, debounced calls), observers stop, cleanups run, props and methods are removed from the element, and the shadow root is emptied. Adding it again later starts fresh.

### `onConnected`

Runs once, after the markup is in the shadow root and `refs` is filled. A returned function runs on removal.

```js
onConnected(() => {
  const observer = new ResizeObserver(() => measure());
  observer.observe(host);
  return () => observer.disconnect();
});
```

### `onDisconnected`

Runs once when the element is removed, before the signal aborts.

```js
onDisconnected(() => {
  socket.close();
});
```

### `onFormReset`

For `form-associated` components. Runs when the owning form resets, after REALM re-reads every prop from its attribute. Use it for state that is not a prop.

```js
onFormReset(() => {
  editor.text = "";
});
```

### `onFormDisabled`

For `form-associated` components. Runs with the new state when the element is disabled or enabled by its own attribute or a `<fieldset disabled>`. Often unnecessary: `props.disabled` already reads `true` inside a disabled fieldset.

```js
onFormDisabled((disabled) => {
  status.text = disabled ? "disabled" : "enabled";
});
```

### `onFormStateRestore`

For `form-associated` components. Runs when the browser restores the field (back/forward or autofill). `mode` is `"restore"` or `"autocomplete"`. A `value` or `checked` prop is restored for you first.

```js
onFormStateRestore((state, mode) => {
  editor.text = String(state ?? "");
});
```

## Module exports

`realm.js` (starts REALM when it loads) and `index.js` (no side effects) export the same names and share one runtime, so a page that loads `realm.js` and a module that imports from `index.js` of the same version share stores and definitions.

```js
import { defineStore, toRaw, untrack } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";
```

A component script that writes `import … from "@realmorg/realm"` needs an import map that points at the file the page loads:

```html
<script type="importmap">
  { "imports": { "@realmorg/realm": "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js" } }
</script>
```

### `start`

`start(): void`. Starts REALM in the document: hides definitions, registers `<import-element>`, defines every `<custom-element>` (and ones added later). `realm.js` calls it. Safe to call twice.

### `importDefinitions`

`importDefinitions(url: string): Promise<void>`. The script form of `<import-element>`. Pass an absolute URL. Rejects with `Could not import URL (HTTP status)` and does not log a warning, so handle the rejection.

```js
await importDefinitions(new URL("components/chart.html", document.baseURI).href);
document.body.append(document.createElement("sales-chart"));
```

### `defineComponent`

`defineComponent(element: Element, base: string, inline: boolean): Promise<void>`. Defines a component from a `<custom-element>` element you already have. `start()` and `<import-element>` use it. Rarely needed.

### `flush`

`flush(): void`. Applies queued updates synchronously. In a component prefer `await tick()`. Fetch attributes call it before sending, so a request sees state changed in the same event.

### `toRaw`

`toRaw<T>(value: T): T`. The original object behind a proxy, for `structuredClone`, `postMessage` and IndexedDB. Writes to it do not notify.

### `untrack`

`untrack<T>(fn: () => T): T`. Runs `fn` without subscribing the current observer to what it reads. It is also a script helper, so component scripts can call `untrack` without importing it.

```js
observe(() => {
  const query = search.query;
  const limit = untrack(() => settings.limit);
  run(query, limit);
});
```

`useState`, `observe`, `defineStore` and `prop` are exported too. An `observe` created in a plain module is not tied to any element, so stop it yourself. TypeScript types: `Context` (the script helpers), `StoreOptions`, `StorageAdapter`.

The compiler (`compiler.js`: `compileDefinition`, `tokenize`) and the optional Vite plugin (`@realmorg/vite-plugin`) pre-assemble components for a strict Content Security Policy. REALM never needs them to run.
