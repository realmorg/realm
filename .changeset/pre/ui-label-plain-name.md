---
"@realmorg/ui": patch
---

`ui-label for` also gives a control inside a component an `aria-label` with its text, so tools that do not follow `ariaLabelledByElements` (such as Playwright's `getByRole`) find the field by its label. Browsers that support element references still use the label element itself.
