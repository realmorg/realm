---
title: Nested components and scope
description: How references and handler names resolve across nested components, owner first and then parents, and when to pass data explicitly with props.
group: Core concepts
order: 18
nav: Nested components
---

# Nested components and scope

Components can nest. A reference such as `#session.user` or a handler name such as `logout` resolves in this order:

1. loop variables of the surrounding `repeat` or `<repeat-list>`,
2. the component whose markup contains the reference (its owner),
3. each parent component, from the nearest outwards,
4. for handler names only: globals, such as `console` or `history`.

## Content belongs to its owner

Content you place inside a child component is still yours. Here `#todo.remaining` is written in `todo-app`'s markup, so it reads `todo-app`'s state, even though it is displayed inside `ui-card`:

```html
<custom-element name="todo-app">
  <script>
    const todo = useState({
      items: [],
      get remaining() {
        return this.items.filter((item) => !item.done).length;
      },
    });
  </script>

  <ui-card>
    <ui-card-header>
      <ui-card-title>Today</ui-card-title>
    </ui-card-header>
    <ui-card-content><slot name="#todo.remaining"></slot> left</ui-card-content>
  </ui-card>
</custom-element>
```

This is standard shadow DOM. The value slot lives in `todo-app`'s shadow root and is projected into `ui-card` through `ui-card`'s own `<slot>`.

## Parents fill in missing names

When the owner does not define a name, REALM looks in the component that contains it, then that component's parent, and so on. A deeply nested component can read shared values without passing them through every level:

```html live
<custom-element name="app-shell">
  <script type="realm">
    const session = useState({ user: "Ana" });

    function signOut() {
      session.user = "";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <nav-bar></nav-bar>
</custom-element>

<custom-element name="nav-bar">
  <style type="realm">
    :host {
      display: flex;
      gap: calc(var(--spacing) * 3);
      align-items: center;
    }
  </style>

  <span>Signed in as <slot name="#session.user">nobody</slot></span>
  <ui-button size="sm" variant="outline" onclick="signOut()">Sign out</ui-button>
</custom-element>

<app-shell></app-shell>
```

`nav-bar` has no `session` and no `signOut`, so both resolve to `app-shell`. REALM logs a one-time console warning for each name read from a parent (`<nav-bar> reads "session" from <app-shell>.`), so you can see where implicit sharing happens. An explicit `lookup("session")` in the script logs nothing, because you asked for it.

Rules:

- A component's own names always win over a parent's.
- A name that no component defines logs a warning and shows the slot's fallback content.
- The lookup follows the flat tree, so it works through shadow roots and slots. Slotted content looks up from its slot first, so a component that wraps the slot in the host's markup is a parent of that content, before the host.

## Pass data explicitly for reusable components

Parent lookup is convenient inside one app. For components you reuse elsewhere, make the contract explicit with props and events:

```html
<user-menu _user="#session.user" onsignout="signOut()"></user-menu>
```

Objects and arrays passed with `_` bindings arrive as properties, intact. The child declares them with `defineProps` and emits events with `dispatch` or `dispatchEvent`.

## App-wide state

State that several unrelated components need, or that should outlive a component, belongs in a [store](/docs/stores/).
