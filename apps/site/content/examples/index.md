---
title: Examples
description: Apps and page blocks built with REALM and REALM UI, including a todo list, kanban board, chess, a dashboard, a weather app, a contacts manager, a chat, a shop, notes, an expense tracker, a GitHub explorer, Minesweeper and sign-in forms.
order: 1
nav: All examples
---

# Examples

Each example is a complete page that runs on this site. Open one and use your browser's View Source to read it. Every example is plain HTML files plus a few small JavaScript modules, loaded with `<import-element>`. The source is in [apps/examples](https://github.com/realmorg/realm/tree/main/apps/examples) on GitHub.


## Apps

<div class="card-grid">
<a class="link-card" href="{{root}}examples/todo/"><u-icon name="list-todo"></u-icon><strong>Todo</strong><span>A store persisted to localStorage, getters for filters and counts, keyed list rows, inline editing with tick() and focus.</span></a>
<a class="link-card" href="{{root}}examples/kanban/"><u-icon name="square-kanban"></u-icon><strong>Kanban board</strong><span>Columns and cards in a persisted store, native drag and drop, keyboard moves with custom events, a card editor in a dialog.</span></a>
<a class="link-card" href="{{root}}examples/chess/"><u-icon name="crown"></u-icon><strong>Chess</strong><span>A full game with legal moves, check, mate and draws, a computer opponent, board flipping and a promotion dialog. Logic lives in an imported module.</span></a>
<a class="link-card" href="{{root}}examples/dashboard/"><u-icon name="layout-dashboard"></u-icon><strong>Dashboard</strong><span>A sidebar layout, breadcrumb, tabs, charts, a data table with pagination, a command palette and a dropdown menu, all from REALM UI.</span></a>
<a class="link-card" href="{{root}}examples/weather/"><u-icon name="cloud-sun"></u-icon><strong>Weather</strong><span>City search and a forecast from the Open-Meteo API through fetch attributes, with loading and error states, a chart and a unit switch.</span></a>
<a class="link-card" href="{{root}}examples/contacts/"><u-icon name="contact"></u-icon><strong>Contacts</strong><span>Create, read, update and delete over a JSON API (served by a service worker) with forms, fetch attributes, validation, dialogs and confirmations.</span></a>
<a class="link-card" href="{{root}}examples/chat/"><u-icon name="message-circle"></u-icon><strong>Chat</strong><span>Conversations with message bubbles, attachments and a scroller that sticks to the newest message. Replies arrive through element-bound timers, with a typing indicator and unread badges.</span></a>
<a class="link-card" href="{{root}}examples/shop/"><u-icon name="shopping-bag"></u-icon><strong>Shop</strong><span>A product list, product pages and a cart as plain HTML pages without a router, sharing one persisted store. Checkout validates its form and confirms with a dialog.</span></a>
<a class="link-card" href="{{root}}examples/notes/"><u-icon name="notebook-pen"></u-icon><strong>Notes</strong><span>Markdown notes with a live preview rendered through a sanitised html slot, search, pinning, keyboard shortcuts and a persisted store.</span></a>
<a class="link-card" href="{{root}}examples/expenses/"><u-icon name="wallet"></u-icon><strong>Expenses</strong><span>An expense form, a sortable and filterable table, monthly totals, a chart by category and a CSV export, all derived from one persisted store.</span></a>
<a class="link-card" href="{{root}}examples/github/"><u-icon name="github"></u-icon><strong>GitHub explorer</strong><span>The public GitHub API through fetch attributes only: debounced search, profiles, sorted and paginated repositories, loading skeletons and rate-limit errors.</span></a>
<a class="link-card" href="{{root}}examples/game/"><u-icon name="bomb"></u-icon><strong>Minesweeper</strong><span>Three difficulty levels, replayable seeded boards, a timer bound to the element, keyboard play, best times saved in the browser and win or lose dialogs.</span></a>
</div>

## Blocks

Page sections built from REALM UI components. All of them are defined in one file, `blocks.html`.

<div class="card-grid">
<a class="link-card" href="{{root}}examples/login/"><u-icon name="log-in"></u-icon><strong>Login</strong><span>A centred sign-in card with email and password fields, validation and a toast on submit.</span></a>
<a class="link-card" href="{{root}}examples/login-split/"><u-icon name="panels-top-left"></u-icon><strong>Login, split</strong><span>The same sign-in form beside a full-height panel, for wider screens.</span></a>
<a class="link-card" href="{{root}}examples/signup/"><u-icon name="user-plus"></u-icon><strong>Sign up</strong><span>A registration form with fields, a terms checkbox and native form validation.</span></a>
<a class="link-card" href="{{root}}examples/otp/"><u-icon name="key-round"></u-icon><strong>One-time password</strong><span>A six-digit code with Input OTP, paste support and a handler for the complete event.</span></a>
</div>

## Smaller examples in the docs

Many docs pages include live demos you can read and change:

- a counter with props and getters on the [home page](/),
- a reading list built step by step in the [Tutorial](/docs/tutorial/),
- a stopwatch with `observe` in [State and reactivity](/docs/state/),
- a keyed, shuffled list in [Lists and keys](/docs/lists/),
- a filtered page index loaded with fetch attributes in [Fetching data](/docs/fetching/),
- a form-associated quantity input in [Forms](/docs/forms/),
- reactive CSS variables and states in [Styling](/docs/styling/).
