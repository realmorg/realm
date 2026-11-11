---
title: SurveyJS Creator alternatives
description: Looking for a SurveyJS Creator alternative? Per-developer licences compared with REALM Pro's form builder, Form.io, formBuilder and JSON Forms.
seoTitle: SurveyJS Creator alternative: drag-and-drop form builder
---

# SurveyJS Creator alternatives

If you run surveys with scoring, calculated values, dozens of question types, 50-plus languages, dashboards of results or PDF output, [SurveyJS](https://surveyjs.io/) is the more complete product and its free Form Library is a strong renderer. If you need people in your app to build ordinary forms (registrations, intake questionnaires, job applications) with validation, show-if rules and pages, saved as plain JSON through a normal form, `ui-kit-form-builder` from [REALM Pro](/pro/) does that for one payment covering a team of ten. For open source, **Form.io's formio.js** has an MIT builder and renderer, and **formBuilder** is an MIT jQuery plugin.

Facts about SurveyJS were checked in October 2026 against [surveyjs.io/licensing](https://surveyjs.io/licensing), the [pricing page](https://surveyjs.io/pricing), the [Survey Creator overview](https://surveyjs.io/survey-creator/documentation/overview), the [Form Library overview](https://surveyjs.io/form-library/documentation/overview) and the npm registry. The current release of all packages is 3.2.3, published 27 October 2026.

## Why people look for an alternative

- **The builder is the paid part.** The SurveyJS Form Library, which renders forms, is MIT and free. Survey Creator, the drag-and-drop builder your users would see, is proprietary. You need a developer licence for each member of your team who works with it.
- **Licences are per developer.** The Basic plan, which adds Survey Creator, costs $589 per developer once, with a renewal of $239 a year for continued updates and support. PRO, which adds Dashboard and PDF Generator, is $1,059 per developer. Enterprise starts at $2,359. For five developers on Basic, that is $2,945 up front.
- **It is a survey platform.** SurveyJS is built around surveys and quizzes, with its own JSON model, question types and theme system. If you want a builder for straightforward forms in an existing app, that model can be more than you need.
- **Framework packages.** The UI ships as separate packages for React, Angular, Vue 3 and plain JavaScript, which you keep in step on upgrades.

## What ui-kit-form-builder does instead

`ui-kit-form-builder` is the form builder in REALM Pro. A palette lists twelve kinds of field: short text, long text, email, number, dropdown, single choice, checkboxes, date, file upload, rating, a section heading and a page break. People drag fields onto a canvas, or add them with a click or Enter, and edit the selected one in a settings panel.

```html
<form method="post" action="/forms">
  <ui-kit-form-builder name="schema" types='["text","email","select","checkbox","page"]'></ui-kit-form-builder>
  <button>Save form</button>
</form>
```

What it covers:

- **Field settings.** Label, the key the answer is submitted under, help text, placeholder, required, and a default answer. Choice fields get a list of choices with labels and stored values that can be added, removed and reordered.
- **Validation by type.** Shortest and longest length or a pattern for text, lowest and highest for numbers, first and last date, how many boxes may be ticked, and a custom error message.
- **Show-if rules.** A field can depend on earlier answers with "is", "is not", "contains", "is more than" or "is answered", with all or any of several conditions matching. Renaming a question's key updates the rules that use it.
- **Pages.** A page break splits the form, and its title heads the next page.
- **A preview that works.** The Preview tab builds the form from REALM UI fields, with live conditions, Back and Next buttons, a progress bar and per-page validation that moves focus to the first problem. Submitting fires a `formsubmit` event with the answers.
- **JSON in and out.** The JSON tab shows the whole form as a plain schema to copy, download, edit and apply, and reports mistakes instead of breaking. The schema is the `schema` property, and with a `name` it is the field's value in the surrounding form, so saving a form design is an ordinary form submission. Changes fire `schemachange`.
- **Undo, keyboard and screen readers.** Undo and redo cover all edits, with typing in one box grouped into one step. The canvas is a listbox: arrows move between fields, Alt with an arrow moves a field, Delete removes it, Ctrl+D duplicates it, and moves are announced.
- **Layout and theme.** Three columns on a wide screen, stacked on a phone. Colours and spacing come from the REALM UI theme, light and dark.

One difference to plan for: REALM Pro has no separate stand-alone form runner like the SurveyJS Form Library. To show finished forms to respondents, render the schema with your own templates or REALM UI fields, or use the builder's preview mode.

## SurveyJS and ui-kit-form-builder side by side

| | SurveyJS (Form Library and Survey Creator 3.2) | ui-kit-form-builder (REALM Pro) |
| --- | --- | --- |
| Licence | Form Library MIT. Survey Creator, Dashboard and PDF Generator commercial | Commercial, part of REALM Pro |
| Price model | Per developer, paid once with 12 months of updates: Basic $589, PRO $1,059, Enterprise from $2,359. Renewals from $239 | $149 once for one developer, $499 once for up to 10 developers, for the whole kit |
| Refund | 90 days | 14 days |
| Frameworks | React, Angular, Vue 3, plain JavaScript | A custom element, in plain HTML or any framework that supports custom elements |
| Field types | 20 or more accessible input types, panels, quizzes and scored surveys | Twelve: text, long text, email, number, dropdown, single choice, checkboxes, date, file, rating, section, page break |
| Conditional logic | Visibility, branching, calculated values, Logic tab | Show-if rules with all or any conditions |
| Validation | Yes | Per type, with custom messages |
| Multi-page | Yes | Yes, with progress and per-page checks |
| Output | SurveyJS JSON | Plain JSON schema, also submitted as the field value |
| Stand-alone renderer | Form Library, MIT | Not included; preview mode inside the builder |
| Translations | 50 or more languages, RTL, Translations tab | Not included |
| Themes | Theme Editor, plus Bootstrap, MUI and shadcn/ui adapters | REALM UI theme tokens |
| Results dashboard and PDF | Dashboard and PDF Generator in PRO | Not included |
| Backend | None required; you store data yourself | None; you store data yourself |
| Accessibility | Accessible input controls and keyboard navigation stated | Keyboard listbox canvas, announced moves, focus to first error in preview |
| Size | Not stated | About 19 KB gzipped component file as shipped, plus the REALM runtime (about 16 KB gzipped) and the REALM UI fields it uses |

## Where SurveyJS is the better choice

- **Surveys, quizzes and scoring.** Calculated values, branching and the wider set of question types are what SurveyJS is built for.
- **A free renderer.** If you only need to show forms you design yourself, the MIT Form Library costs nothing, and you may not need a builder at all.
- **Many languages.** Built-in translations for more than 50 languages and a Translations tab. `ui-kit-form-builder` is in English.
- **Results and PDF.** Dashboard and PDF Generator turn answers into charts and documents.
- **Design system adapters.** Bootstrap, MUI and shadcn/ui theme adapters if your app already uses one.
- **Older browsers and maturity.** REALM needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer (see [Browser support](/docs/browser-support/)), and REALM Pro is in early access.

## Other SurveyJS Creator alternatives

| Option | Licence and price | Best for |
| --- | --- | --- |
| [Form.io](https://form.io/open-source/) | formio.js builder and renderer MIT. Hosted platform from $300 a month; self-hosted servers priced per environment ([pricing](https://form.io/pricing)) | A builder plus an API server and PDF tools, if you will pay for the platform |
| [formBuilder](https://formbuilder.online/) | MIT | Simple drag-and-drop forms in jQuery apps, with formRender to display them and 35 languages |
| [JSON Forms](https://jsonforms.io/) | MIT | Rendering forms from JSON Schema in React, Angular or Vue. No visual builder |
| [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/) | Apache 2.0 | Rendering JSON Schema forms in React, with pluggable validation. No visual builder |
| [Tripetto SDK](https://tripetto.com/sdk/pricing/) | Builder licence from €325 a month; runner from €75 a month or free with branding | Conversational forms, though its npm packages have not had a release since 2024 |

## Moving from SurveyJS Creator

| SurveyJS | ui-kit-form-builder |
| --- | --- |
| `new SurveyCreator.SurveyCreator(options)` and a render call per framework | `<ui-kit-form-builder>` in the page |
| `creator.JSON` | The `schema` property |
| `creator.saveSurveyFunc` | The form's own submit, or the `schemachange` event |
| `text`, `comment` questions | `text`, `textarea` fields |
| `dropdown`, `radiogroup`, `checkbox` | `select`, `radio`, `checkbox` |
| `rating` | `rating` |
| `file` | `file` |
| Pages | `page` field |
| `visibleIf` expressions | Show-if rules on the field |
| Logic tab, JSON Editor tab | Settings panel, JSON tab |

The schema formats differ, so existing SurveyJS JSON needs a one-time conversion. Simple forms map field by field as above.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is SurveyJS free?</ui-accordion-trigger>
    <ui-accordion-content>The SurveyJS Form Library is MIT and free, including commercial use. Survey Creator, Dashboard and PDF Generator need a paid developer licence per team member.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is the SurveyJS licence a subscription?</ui-accordion-trigger>
    <ui-accordion-content>No. SurveyJS developer licences are perpetual and include 12 months of updates and support. A yearly renewal keeps updates coming.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which free form builder has drag and drop?</ui-accordion-trigger>
    <ui-accordion-content>Form.io's formio.js and formBuilder are both MIT and include a drag-and-drop builder. JSON Forms and react-jsonschema-form render forms but have no visual builder.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Where are the forms and answers stored?</ui-accordion-trigger>
    <ui-accordion-content>With <code>ui-kit-form-builder</code>, in your own backend. The schema is submitted like any form field, and the preview's <code>formsubmit</code> event gives you the answers. Nothing is sent to a third party.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I limit which field types people can add?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Pass a list to the <code>types</code> attribute, for example <code>types='["text","email","select"]'</code>, and only those appear in the palette.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Form builder](/pro/components/ui-kit-form-builder/): screenshots and the full feature list for `ui-kit-form-builder`.
- [REALM Pro](/pro/): the form builder plus the data grid, scheduler, charts and more, paid once.
- [Forms](/docs/forms/): how REALM components submit with a form.
