# Markup

Everything in a `<custom-element>` that is not the script or a stylesheet is markup. It is cloned into each element's shadow root. Markup holds **references** to values, never expressions.

## Elements

| Element | Purpose |
| --- | --- |
| `<custom-element name="tag-name">` | Defines a component. Hidden by `realm.css` and removed from the page once read |
| `<import-element from="file.html">` | Loads a file of definitions. See imports.md |
| `<is-visible when="#ref">` | Mounts its content while the value is truthy (or the comparison is true) |
| `<is-hidden when="#ref">` | Mounts its content while the value is falsy (or the comparison is false) |
| `<repeat-list of="#ref">` | Repeats its content once per array item |
| `<slot name="#ref">`, `<slot name="@prop">` | Shows a value (a value slot) |

`<is-visible>`, `<is-hidden>` and `<repeat-list>` lay out with `display: contents`, so they add no box.

## The definition

```html
<custom-element name="tag-name" form-associated role="group" delegates-focus slot="title">
  <script>…</script>
  <style>…</style>
  <link rel="stylesheet" href="./tag-name.css">
  …markup…
</custom-element>
```

| Attribute | Meaning |
| --- | --- |
| `name` | Required. Must contain a dash. Without one REALM warns and defines nothing |
| `form-associated` | The element becomes a form field through `ElementInternals`. See forms-a11y.md |
| `role` | Default ARIA role of every instance (`internals.role`). The page can still set `role` on an element |
| `delegates-focus` | The shadow root delegates focus: focusing or clicking the host focuses the first focusable element inside |
| `slot` | Makes the component a compound part (see below) |

| Child | Meaning |
| --- | --- |
| First `<script>` | The component script. See api.md |
| `<style>` | Adopted into every instance's shadow root. Scoped to the component |
| `<link rel="stylesheet" href>` | Fetched once, relative to the file that holds the definition, adopted like `<style>` |
| Anything else | Markup |

| Where the definition is | Script | Style |
| --- | --- | --- |
| Inline in a page | `<script type="realm">` (also when it has `import` lines) | `<style type="realm">` |
| A file loaded with `<import-element>` | `<script>`, or `<script type="module">` when it uses `import` | `<style>` |

A plain `<script>` inline in a page has already run as page code by the time REALM reads it, so REALM warns. `<script src="…">` is only for setup modules produced by the Vite plugin or `compileDefinition`, not for plain script files.

The `hidden` attribute always hides a component, whatever `display` its styles set.

### Compound parts

A definition with `slot="name"` gives every instance that slot unless the instance sets its own, so the part lands in its parent's `name` slot by itself. A part can call its parent's functions and show its parent's state without a script, and those lookups are not reported. REALM UI is built this way (`ui-card-header`, `ui-dialog-trigger`).

```html runnable
<custom-element name="profile-card">
  <script type="realm">
    const profile = useState({ follows: 0 });

    function follow() {
      profile.follows++;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
    }
  </style>
  <slot name="title"></slot>
  <slot></slot>
</custom-element>

<custom-element name="profile-card-title" slot="title">
  <h3><slot></slot> (<slot name="#profile.follows"></slot> followers)</h3>
</custom-element>

<custom-element name="profile-card-follow">
  <button type="button" onclick="follow()">Follow</button>
</custom-element>

<profile-card>
  <profile-card-title>Ada Lovelace</profile-card-title>
  <profile-card-follow></profile-card-follow>
</profile-card>
```

`profile-card-title` and `profile-card-follow` have no script: `#profile.follows` and `follow()` resolve to the `profile-card` they are placed in.

## References

| Reference | Reads |
| --- | --- |
| `#todo` | A top-level name of the script (`const`, `let`, `var`, `function`, `class`, import), or a loop variable |
| `#todo.items.length` | A property path. Missing steps give `undefined` instead of throwing |
| `#list.0.title` | Path segments may be digits and may contain `-` |
| `@heading` | A prop from `defineProps`. A path may follow: `@user.name` |
| `!#panel.open`, `!@disabled` | The negation. `!` is the only operator |

Resolution order for `#name`:

1. loop variables of the enclosing `repeat` / `<repeat-list>`, innermost first,
2. the component whose markup contains the reference (its owner),
3. parent components, nearest first, through shadow roots (each one logs `<child> reads "name" from <parent>.` once, except for compound parts),
4. for handler code only: `globalThis`.

An unknown name logs `"#name" is not defined in this component or its parents.` and shows the fallback. Content you place inside another component (slotted content) still belongs to you: `#todo.remaining` inside `<ui-card-content>` reads your state.

Only reactive values update: `useState`, stores, props, loop variables and getters on them. A top-level `const filters = [...]` can be read, but changes to it are not seen.

Where references are used:

| Attribute | Accepts |
| --- | --- |
| `<slot name>` | `#…`, `@…`, `!…` |
| `_attr` | `#…`, `@…`, `!…` |
| `<is-visible when>`, `<is-hidden when>` | `#…`, `@…`, `!…` |
| `<repeat-list of>`, `repeat` | `#…`, `@…` |
| `trigger` | `#…`, `@…` among event names |
| `params` | `name:#…, name:@…` pairs |
| `headers` | `#…`, `@…` |
| `into`, `busy` | A writable `#name.path` with at least one property (`#todo.items`, not `#todo`, not `@prop`, not negated) |

`ref="name"` is not a reference: it names the element for `refs`.

## Value slots

A native `<slot>` whose name starts with `#`, `@` or `!` shows that value. Other slots (`<slot>`, `<slot name="footer">`) are ordinary slots for light DOM content.

```html
<p>Hello, <slot name="@name">stranger</slot>.</p>
<p><slot name="#todo.remaining"></slot> left</p>
<div><slot name="#post.body" html></slot></div>
```

| Mode | Shows |
| --- | --- |
| (default) text | `String(value)` as text. `0`, `false` and numbers show as they are |
| `html` | The value parsed as HTML and sanitised: `script`, `style`, `iframe`, `frame`, `frameset`, `object`, `embed`, `link`, `meta`, `base`, `template` and `noscript` removed, every `on*` attribute and `srcdoc` removed, and `javascript:`, `vbscript:` and `data:text/html` URLs removed |
| `html-unsafe` | The value assigned to `innerHTML` as is. Only for HTML you produced yourself |

- While the value is `""`, `null` or `undefined`, the slot shows its own children (the fallback).
- Inserted HTML is never scanned for references, bindings or handlers.
- Inside `<svg>`, a text slot becomes a text node (`<text><slot name="#chart.label"></slot></text>` works). With `html` it becomes a `<g>` of parsed SVG.

## Bindings: `_attr`

`_` plus an attribute name binds it to a reference. The `_attr` attribute is removed from the rendered element.

```html
<a _href="#link.url">Open</a>
<section _hidden="!#panel.open">…</section>
<button _disabled="@disabled">Save</button>
<li _data-done="#item.done" _aria-selected="#item.selected">…</li>
<input _value="#form.email" oninput="setEmail(this.value)">
<user-card _user="#session.user"></user-card>
<div _--progress="#upload.percent"></div>
```

How a value is applied (first match wins):

| Target | Value | Result |
| --- | --- | --- |
| `_--name` | `null`, `undefined`, `false` | `style.removeProperty("--name")` |
| `_--name` | anything else | `style.setProperty("--name", String(value))` |
| `value` on `<progress>` / `<meter>` | `null`, `undefined` | Attribute removed (indeterminate) |
| `value`, `checked`, `selected`, `indeterminate` on an element with that property | any | Sets the **property** (`value ?? ""`, `Boolean(…)` for the others) |
| Any attribute of a custom element (tag with a dash) | object or array | Sets the camelCase **property** (`_user-data` → `userData`) |
| `aria-*`, `draggable`, `spellcheck`, `contenteditable` | `true` / `false` | `"true"` / `"false"` |
| Any attribute | `true` | Present, empty |
| Any attribute | `false`, `null`, `undefined` | Removed |
| Any attribute | anything else | `String(value)` |

SVG attribute case is restored (`_viewbox` sets `viewBox`). `_class` replaces the whole class: to toggle one style, bind a data attribute (`_data-active="#tab.active"`) or use a reactive `:state()`.

Bindings are one-way. They never write back to state.

## Event handlers: `on…`

Native handler attributes. In component markup they work for every event name, native or custom.

```html
<button onclick="save()">Save</button>
<input oninput="search(this.value)" debounce="300ms">
<form onsubmit="add(event)">…</form>
<li repeat="#todo.items" as="item" key="id" onclick="toggle(item)">…</li>
<rating-stars onrate="saveRating(event.detail.value)"></rating-stars>
```

| Name in handler code | Is |
| --- | --- |
| `event` | The event |
| `this` | The element the attribute is on |
| Loop variables | The `as` and `index` names of every enclosing loop |
| Script names | Every top-level name of the component script |
| Helpers | `host`, `refs`, `dispatch`, `attrs`, timers, … |
| Anything else | Looked up when the handler runs: parent components, then `globalThis` (`console`, `history`) |

- `return false` calls `event.preventDefault()`.
- Handlers are compiled with the script, not evaluated at event time, and the attribute is removed from the rendered element. A Content Security Policy that blocks inline handlers does not block them.
- Listeners stop when the element is removed.
- Keep each handler to one function call.

### `debounce` and `throttle`

On an element, they time every `on…` handler on it. On an element with fetch attributes, they time its requests instead.

```html
<input oninput="search(this.value)" debounce="300ms">
<div onpointermove="track(event)" throttle="100ms"></div>
```

Durations: `300`, `300ms`, `1.5s`, `2m`. `debounce` runs once events stop for that long, with the last event. `throttle` runs at most once per period, on the leading edge. If both are present, `debounce` wins. Pending calls are cancelled on removal.

### Handlers on a plain page

Outside component markup, browsers only support handler attributes for native events. REALM adds an `on<name>` attribute and property for each custom event a component sends (found as `dispatch("name"`, `new CustomEvent("name"` or `new Event("name"` in its script). There the attribute value is ordinary page JavaScript, so a strict CSP blocks it like any inline handler.

```html runnable
<custom-element name="like-button">
  <script type="realm">
    const likes = useState({ count: 0 });

    function like() {
      likes.count++;
      dispatch("like", { count: likes.count });
    }
  </script>

  <button type="button" onclick="like()">Like (<slot name="#likes.count"></slot>)</button>
</custom-element>

<like-button onlike="document.getElementById('like-log').value = 'Liked ' + event.detail.count + ' times'"></like-button>
<output id="like-log">No likes yet.</output>
```

```js
document.querySelector("like-button").onlike = (event) => {
  if (event.detail.count > 10) return false;
};
```

## Conditions: `<is-visible>` and `<is-hidden>`

```html
<is-visible when="#cart.isEmpty"><p>Your cart is empty.</p></is-visible>
<is-hidden when="#cart.isEmpty"><cart-list></cart-list></is-hidden>
<is-visible when="#order.status" eq="shipped"><p>On its way.</p></is-visible>
<is-visible when="#stock.count" lte="2"><p>Only a few left.</p></is-visible>
<is-visible when="#order.tags" contains="gift"><p>Gift wrapped.</p></is-visible>
<is-visible when="!#user.signedIn"><a href="/login">Sign in</a></is-visible>
```

| Attribute | `<is-visible>` mounts while |
| --- | --- |
| `when` alone | the value is truthy |
| `eq="text"` | `String(value) === "text"` |
| `neq="text"` | `String(value) !== "text"` |
| `gt="n"`, `gte="n"` | `Number(value) > n`, `>= n` |
| `lt="n"`, `lte="n"` | `Number(value) < n`, `<= n` |
| `contains="text"` | an array has an item equal to `text`, or a string includes it |

`<is-hidden>` inverts the result. Use one comparison per element. Content that is not shown is **removed**, with its bindings, listeners, requests and nested components, and created fresh when it comes back. To keep content in the DOM (typed values, a playing video), bind `hidden` instead: `<section _hidden="!#panel.open">`.

There is no `else if`. Compare one value several times with `eq`, or map cases to data in a getter:

```js
const VIEWS = {
  loading: { title: "Loading…", tone: "muted" },
  error: { title: "Something went wrong", tone: "destructive" },
  ready: { title: "Up to date", tone: "default" },
};

const status = useState({
  state: "loading",
  get view() {
    return VIEWS[this.state];
  },
});
```

```html
<p _data-tone="#status.view.tone"><slot name="#status.view.title"></slot></p>
<is-visible when="#status.state" eq="error"><button onclick="retry()">Retry</button></is-visible>
```

Never put `<is-visible>` inside `<table>`, `<tr>`, `<ul>` or `<select>`. Bind `_hidden` on the row, or filter the list in a getter.

## Lists: `<repeat-list>` and `repeat`

```html
<repeat-list of="#board.columns" as="column" index="i" key="id">
  <section>
    <h3><slot name="#i"></slot>. <slot name="#column.title"></slot></h3>
  </section>
</repeat-list>

<ul>
  <li repeat="#todo.visible" as="item" key="id" onclick="toggle(item)"><slot name="#item.title"></slot></li>
</ul>

<select onchange="choose(this.value)">
  <option repeat="#form.countries" as="country" key="code" _value="#country.code"><slot name="#country.name"></slot></option>
</select>
```

| Attribute | Meaning | Default |
| --- | --- | --- |
| `of` (on `<repeat-list>`) or `repeat` (on the item) | A reference to an array. Anything else renders nothing | |
| `as` | Item variable name | `item` |
| `index` | Index variable name (0-based) | none |
| `key` | Item property that identifies it between updates | the position |

- Use the `repeat` attribute inside `<ul>`, `<ol>`, `<table>`, `<tbody>`, `<tr>`, `<select>` and `<datalist>`. Use `<repeat-list>` elsewhere, or to repeat several elements per item.
- Inside each copy, `#item.title` and `#i` work in slots, bindings and conditions, and `item`, `i` are variables in handlers. Other names still resolve to the script, so `#todo.filter` works inside the loop. Loops nest.
- With `key`, kept items keep their DOM (focus, typed text, transitions), moved items move, removed items are torn down, new items are created. Without `key`, items are matched by position. Duplicate keys warn.
- Change the array in the script: `push`, `splice`, `sort`, index writes or a new array are all tracked. Show filtered or sorted views through a getter and keep the source array as it is.

```html runnable
<custom-element name="fruit-list">
  <script type="realm">
    const basket = useState({
      next: 4,
      items: [
        { id: 1, name: "Apple" },
        { id: 2, name: "Banana" },
        { id: 3, name: "Cherry" },
      ],
    });

    function add() {
      basket.items.unshift({ id: basket.next, name: `Fruit ${basket.next}` });
      basket.next++;
    }

    function remove(fruit) {
      basket.items = basket.items.filter((item) => item.id !== fruit.id);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
  </style>

  <ui-button onclick="add()">Add to top</ui-button>
  <ol>
    <li repeat="#basket.items" as="fruit" key="id">
      <slot name="#fruit.name"></slot>
      <ui-button variant="ghost" size="sm" onclick="remove(fruit)">Remove</ui-button>
    </li>
  </ol>
  <is-hidden when="#basket.items.length"><p>The basket is empty.</p></is-hidden>
</custom-element>

<fruit-list></fruit-list>
```

## `ref`

`ref="name"` puts the element in the script's `refs`. Uses: `refs.name` in the script, `render="name"` as a fetch target, and `ref="control"` as the delegated control of a `form-associated` component. The attribute stays on the element.

## `focusgroup`

Arrow-key focus movement for toolbars, menus, tab lists and radio groups, in every browser:

```html
<div role="toolbar" aria-label="Formatting" focusgroup="toolbar inline wrap">
  <button>Bold</button>
  <button>Italic</button>
  <button>Underline</button>
</div>
```

| Token | Effect |
| --- | --- |
| `inline` | Only Left and Right (mirrored in right-to-left text) |
| `block` | Only Up and Down |
| neither | All four arrows |
| `wrap` | Past the last item goes to the first, and back |

Home and End go to the first and last item. Items are focusable descendants (buttons, `a[href]`, form controls, `[tabindex]`, custom elements that delegate focus), including slotted content. Disabled, `hidden`, `inert`, `aria-disabled="true"` and `tabindex="-2"` items are skipped. Other tokens (`toolbar`, `menu`, `tablist`) are only for readability. It moves focus but does not manage `tabindex`: for one Tab stop, set `tabindex="-1"` on items that are not current.
