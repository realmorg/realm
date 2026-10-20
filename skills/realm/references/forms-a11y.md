# Forms and accessibility

## Forms with native fields and REALM UI

Use a real `<form>`. REALM UI inputs (`ui-input`, `ui-textarea`, `ui-select`, `ui-checkbox`, `ui-switch`, `ui-radio-group`, `ui-slider`, `ui-input-otp`, `ui-combobox`, `ui-calendar`, `ui-toggle`, `ui-toggle-group`) are form-associated, so they take part in `FormData`, `reset()`, validation, `<fieldset disabled>` and `<label>` like native inputs. `ui-button type="submit"` and `type="reset"` work as native buttons.

- Read values with `new FormData(form)` in the submit handler, or submit with fetch attributes (`<form action method into>`).
- Validate with native constraints (`required`, `type="email"`, `minlength`, `pattern`, `min`, `max`) and `form.reportValidity()`. Add `novalidate` on the form only when you call `reportValidity()` yourself.
- Show messages with `ui-field` (`error="…"`, `invalid`) and `ui-field-description`.

```js
function submit(event) {
  event.preventDefault();
  if (!event.target.reportValidity()) return;
  const data = Object.fromEntries(new FormData(event.target));
  save(data);
}
```

```html
<form onsubmit="submit(event)">
  <ui-field>
    <ui-label for="email">Email</ui-label>
    <ui-input id="email" name="email" type="email" required></ui-input>
  </ui-field>
  <ui-button type="submit">Save</ui-button>
</form>
```

recipes.md has a complete validated form.

## Form-associated components

`form-associated` on the definition makes your component a form field through `ElementInternals`. The page writes `name` on it like on a native input.

- A `value` prop becomes the submitted value. A `checked` prop makes it submit `value` (or `"on"`) only while checked, like a checkbox.
- On `form.reset()` every prop is parsed again from its attribute. On back/forward restore, `value` or `checked` is restored.
- `props.disabled` reads `true` when the `disabled` attribute is set **or** a surrounding `<fieldset disabled>` disables the field. Bind it to inner controls: `_disabled="@disabled"`.

### Delegating to an inner control: `ref="control"`

Mark the native `<input>`, `<select>` or `<textarea>` inside with `ref="control"` and REALM wires it up:

- typing updates the `value` prop (as a number when the prop holds a number); toggling a checkbox or radio updates `checked`,
- the control's validity (`required`, `pattern`, `min`, `type="email"`, …) becomes the component's validity, so `form.checkValidity()` and `:invalid` work,
- the control's `change` is re-dispatched from the host (bubbling),
- Enter in a text-like control submits the form,
- a `<label>` around the component, or one whose `for` points at it, names the control.

```html runnable
<custom-element name="quantity-input" form-associated delegates-focus>
  <script type="realm">
    const props = defineProps({
      value: prop.number().int().default(1),
      min: prop.number().default(1),
      max: prop.number().default(10),
      disabled: prop.boolean(),
    });

    function step(amount) {
      props.value = Math.min(props.max, Math.max(props.min, props.value + amount));
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--spacing) * 1);
    }
    input {
      width: calc(var(--spacing) * 14);
      height: calc(var(--spacing) * 8);
      border: 1px solid var(--input);
      border-radius: var(--radius-md);
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: center;
    }
    input:invalid {
      border-color: var(--destructive);
    }
  </style>

  <ui-button size="icon-sm" variant="outline" aria-label="Less" _disabled="@disabled" onclick="step(-1)">-</ui-button>
  <input ref="control" type="number" _value="@value" _min="@min" _max="@max" _disabled="@disabled">
  <ui-button size="icon-sm" variant="outline" aria-label="More" _disabled="@disabled" onclick="step(1)">+</ui-button>
</custom-element>

<custom-element name="order-form">
  <script type="realm">
    const result = useState({ text: "Submit to see the form data." });

    function submit(event) {
      event.preventDefault();
      result.text = new URLSearchParams(new FormData(event.target)).toString();
    }
  </script>

  <form onsubmit="submit(event)">
    <label>Coffee <quantity-input name="coffee" value="2"></quantity-input></label>
    <label>Tea <quantity-input name="tea" value="1" max="3"></quantity-input></label>
    <ui-button type="submit">Order</ui-button>
    <ui-button type="reset" variant="outline">Reset</ui-button>
    <output><slot name="#result.text"></slot></output>
  </form>
</custom-element>

<order-form></order-form>
```

### Doing it by hand

Without a `value` or `checked` prop, set the form value and validity yourself:

```js
const props = defineProps({ tags: prop.array(prop.string()).default([]), required: prop.boolean() });

observe(() => {
  internals.setFormValue(props.tags.join(","));
  internals.setValidity(
    props.required && props.tags.length === 0 ? { valueMissing: true } : {},
    "Add at least one tag.",
  );
});
```

Hooks: `onFormReset(fn)`, `onFormDisabled(fn(disabled))`, `onFormStateRestore(fn(state, mode))`. See api.md.

## Accessibility

REALM components are native elements with shadow roots, so the usual rules apply. REALM UI follows the WAI-ARIA patterns for every component.

### Use native elements inside

`<button type="button">` for actions, `<a href>` for navigation, `<input>`, `<select>`, `<dialog>`. Never make a `<div>` clickable. Give icon-only buttons a name: `<ui-button size="icon" aria-label="Close"><u-icon name="x"></u-icon></ui-button>`.

### Default roles

`role` on the definition sets every instance's role through `ElementInternals` (it does not appear as an attribute; the page can still override it):

```html
<custom-element name="status-pill" role="status">
  <slot></slot>
</custom-element>
```

### Focus

`delegates-focus` on the definition moves focus to the first focusable element inside when the host is focused, clicked or targeted by a `<label>`. Every REALM UI control that wraps a native control does this. Style focus with `:focus-visible { box-shadow: var(--focus-ring); }`.

`focusgroup` gives toolbars, menus, tab lists and radio groups arrow-key navigation (see markup.md):

```html
<div role="toolbar" aria-label="Formatting" focusgroup="toolbar inline wrap">…</div>
```

### ARIA from state

Bind ARIA like any attribute. Booleans become `"true"` and `"false"`:

```html
<button _aria-expanded="#menu.open" aria-controls="menu" onclick="toggle()">Menu</button>
<li repeat="#list.items" as="item" key="id" role="option" _aria-selected="#item.selected">…</li>
<section _aria-busy="#feed.loading">…</section>
```

Fetching elements get `aria-busy="true"` automatically while their request runs.

### Labels

A native `<label>` (or `ui-label for="id"`) names form fields, including REALM UI inputs and components with `ref="control"`. Without a visible label, pass `aria-label` through a prop:

```js
defineProps({ label: prop.string().attribute("aria-label") });
```

```html
<input ref="control" _aria-label="@label">
```

### Content that changes

`<is-visible>` and `<is-hidden>` remove content, so assistive technology does not see hidden content. When content changes in place and users should hear it, put it in a live region that stays in the DOM (`role="status"` or `aria-live="polite"`). `ui-toaster` is already a live region.

### Checklist

- Native interactive elements inside, never clickable `<div>`s.
- Every icon-only button and every field has an accessible name.
- Visible focus on everything focusable.
- Respect `prefers-reduced-motion` for animation.
- Try it with the keyboard only: Tab, Shift+Tab, Enter, Space, Escape and the arrow keys.
