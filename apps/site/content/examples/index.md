---
title: Examples
description: Complete apps and page blocks built with REALM and REALM UI, running on this site, from a todo list and kanban board to chess, a dashboard, a weather app, a contacts manager and sign-in blocks.
order: 1
nav: All examples
---

# Examples

Each example is a complete page that runs on this site. Open one, then use your browser's View Source: every example is plain HTML files and a few small JavaScript modules, loaded with `<import-element>`. The source is in [apps/examples](https://github.com/realmui/realm/tree/main/apps/examples) on GitHub.


## Apps

<div class="example-grid">
<a href="{{root}}examples/todo/"><ui-card><ui-card-header><ui-card-title>Todo</ui-card-title><ui-card-description>A store persisted to localStorage, getters for filters and counts, keyed list rows, inline editing with tick() and focus.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/kanban/"><ui-card><ui-card-header><ui-card-title>Kanban board</ui-card-title><ui-card-description>Columns and cards in a persisted store, native drag and drop, keyboard moves with custom events, a card editor in a dialog.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/chess/"><ui-card><ui-card-header><ui-card-title>Chess</ui-card-title><ui-card-description>A full game with legal moves, check, mate and draws, a computer opponent, board flipping and a promotion dialog. Logic lives in an imported module.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/dashboard/"><ui-card><ui-card-header><ui-card-title>Dashboard</ui-card-title><ui-card-description>A sidebar layout, breadcrumb, tabs, charts, a data table with pagination, a command palette and a dropdown menu, all from REALM UI.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/weather/"><ui-card><ui-card-header><ui-card-title>Weather</ui-card-title><ui-card-description>City search and a forecast from the Open-Meteo API through fetch attributes, with loading and error states, a chart and a unit switch.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/contacts/"><ui-card><ui-card-header><ui-card-title>Contacts</ui-card-title><ui-card-description>Create, read, update and delete over a JSON API (served by a service worker) with forms, fetch attributes, validation, dialogs and confirmations.</ui-card-description></ui-card-header></ui-card></a>
</div>

## Blocks

Ready-made page sections composed from REALM UI components. All of them are defined in one file, `blocks.html`.

<div class="example-grid">
<a href="{{root}}examples/login/"><ui-card><ui-card-header><ui-card-title>Login</ui-card-title><ui-card-description>A centred sign-in card with email and password fields, validation and a toast on submit.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/login-split/"><ui-card><ui-card-header><ui-card-title>Login, split</ui-card-title><ui-card-description>The same sign-in form beside a full-height panel, for wider screens.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/signup/"><ui-card><ui-card-header><ui-card-title>Sign up</ui-card-title><ui-card-description>A registration form with fields, a terms checkbox and native form validation.</ui-card-description></ui-card-header></ui-card></a>
<a href="{{root}}examples/otp/"><ui-card><ui-card-header><ui-card-title>One-time password</ui-card-title><ui-card-description>A six-digit code with Input OTP, paste support and a handler for the complete event.</ui-card-description></ui-card-header></ui-card></a>
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
