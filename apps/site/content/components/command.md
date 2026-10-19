---
title: Command
description: A searchable list of commands with groups, shortcuts, an empty state and keyboard navigation, used inline or as a command palette inside a dialog.
group: Overlays
order: 302
nav: Command
---

# Command

`ui-command` is a search box above a filtered list of options. The options come from plain `<option>` children, and
native `<optgroup label="…">` elements group them under a heading. Type to filter by label or value, use the arrow
keys to move the highlight and press Enter, or click an option, to fire a `select` event. `data-shortcut` on an
option shows a shortcut hint, and `ui-command-empty` sets what shows when nothing matches.

`ui-command` fills the width of its container. On its own it renders inline. Put it in a [Dialog](/components/dialog/)
to make a command palette; the search on this site works that way.

```html live
<div class="demo-narrow">
  <ui-command onselect="document.dispatchEvent(new CustomEvent('toast', { detail: { title: event.detail.label } }))">
    <optgroup label="Suggestions">
      <option value="calendar">Calendar</option>
      <option value="emoji">Search emoji</option>
      <option value="calculator">Calculator</option>
    </optgroup>
    <optgroup label="Settings">
      <option value="profile" data-shortcut="⌘P">Profile</option>
      <option value="billing" data-shortcut="⌘B">Billing</option>
      <option value="settings" data-shortcut="⌘S">Settings</option>
    </optgroup>
  </ui-command>
</div>
```

## Examples

### Command palette in a dialog

Put `ui-command` in a `ui-dialog` with `hide-close`, open the dialog with `showModal()` and close it from the `select`
handler. Focus the search input after opening so the user can type straight away.

```html live
<custom-element name="command-palette-demo">
  <script type="realm">
    function open() {
      refs.palette.showModal();
      refs.command.shadowRoot.querySelector("input").focus();
    }

    function run(event) {
      refs.palette.close();
      document.dispatchEvent(new CustomEvent("toast", { detail: { title: `Running "${event.detail.label}"` } }));
    }
  </script>

  <style type="realm">
    ui-command {
      margin: calc(var(--spacing) * -6);
      border: 0;
    }
  </style>

  <ui-button variant="outline" onclick="open()">Open command palette</ui-button>
  <ui-dialog ref="palette" label="Command palette" hide-close>
    <ui-command ref="command" placeholder="Type a command..." onselect="run(event)">
      <optgroup label="File">
        <option value="new-file" data-shortcut="⌘N">New file</option>
        <option value="open-file" data-shortcut="⌘O">Open file</option>
      </optgroup>
      <optgroup label="View">
        <option value="toggle-theme">Toggle theme</option>
        <option value="zoom-in" data-shortcut="⌘+">Zoom in</option>
      </optgroup>
    </ui-command>
  </ui-dialog>
</custom-element>
<command-palette-demo></command-palette-demo>
```

### Options from state

Generate the groups and options with `repeat`. `ui-command` watches its children, so the list updates when the state
changes. `value` falls back to the option text, and the `label` attribute overrides the text.

```html live
<custom-element name="command-state-demo">
  <script type="realm">
    const people = useState({
      teams: [
        {
          name: "Engineering",
          members: [
            { id: "ada", name: "Ada Lovelace" },
            { id: "grace", name: "Grace Hopper" },
          ],
        },
        { name: "Research", members: [{ id: "katherine", name: "Katherine Johnson" }] },
      ],
      picked: "nobody",
    });

    function pick(event) {
      people.picked = event.detail.label;
    }

    function add() {
      people.teams[1].members.push({ id: "margaret", name: "Margaret Hamilton" });
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(100%, calc(var(--spacing) * 112));
      font-size: var(--text-sm);
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  </style>

  <ui-command placeholder="Find a person..." onselect="pick(event)">
    <optgroup repeat="#people.teams" as="team" key="name" _label="#team.name">
      <option repeat="#team.members" as="person" key="id" _value="#person.id" _label="#person.name"></option>
    </optgroup>
    <ui-command-empty>Nobody matches.</ui-command-empty>
  </ui-command>
  <div class="row">
    <span>Picked: <slot name="#people.picked"></slot></span>
    <ui-button size="sm" variant="secondary" onclick="add()">Add Margaret</ui-button>
  </div>
</custom-element>
<command-state-demo></command-state-demo>
```

### Empty state

`ui-command-empty` replaces the default "No results found." text, and can hold markup. Type something that is not in
the list to see it.

```html live
<div class="demo-narrow">
  <ui-command placeholder="Search frameworks...">
    <option value="realm">REALM</option>
    <option value="lit">Lit</option>
    <option value="stencil">Stencil</option>
    <ui-command-empty>No framework found. <a href="#command">Suggest one</a></ui-command-empty>
  </ui-command>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-command` | | A bordered column: the search input, then the filtered list. Fills its container's width. |
| `<optgroup label="…">` | (data) | A group with the label as its heading. Groups after the first are separated by a line. |
| `<option>` | (data) | One row in the list, with the `data-shortcut` hint at the end. |
| `ui-command-empty` | `empty` | The text shown when nothing matches, in place of "No results found.". |

`<option>` and `<optgroup>` are hidden and only used as data; changes to them are picked up automatically. Options
outside a group are listed without a heading.

### ui-command attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | string | `"Type a command or search..."` | Placeholder of the search input. |

### Option attributes

| Attribute | Description |
| --- | --- |
| `value` | Sent in `event.detail.value`. Also matched by the search. Defaults to the option text. |
| `label` | Text shown in the list and matched by the search. Defaults to the option text. |
| `data-shortcut` | Shortcut hint shown at the end of the row. Display only; it does not bind a key. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `select` | `{ value, label }` | Fired when an option is clicked or Enter is pressed on the highlighted option. Bubbles and is composed. |

### CSS parts

| Part | Description |
| --- | --- |
| `search` | The row with the search icon and input. |
| `input` | The search `<input>`. |
| `list` | The scrolling list (`role="listbox"`). |
| `item` | Each option row (`role="option"`). |
| `shortcut` | The shortcut hint in a row. |
| `empty` | The paragraph shown when nothing matches. |

### Accessibility

- The search input has `role="combobox"`, `aria-expanded="true"` and `aria-autocomplete="list"`. The list has
  `role="listbox"`, groups have `role="group"`, and each row has `role="option"` with `aria-selected` on the
  highlighted one.
- Arrow Down and Arrow Up move the highlight and wrap around. Enter selects the highlighted option. Typing resets the
  highlight to the first match.
- Focus stays in the input while navigating. The input's `aria-activedescendant` points at the highlighted option
  and `aria-controls` at the listbox. The rows are rendered in the same shadow root as the input so these references
  work; that is why options are data rather than separate item elements.
