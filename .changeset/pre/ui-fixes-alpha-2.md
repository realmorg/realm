---
"@realmorg/ui": patch
---

- Theme colours meet WCAG AA in light and dark mode, with a new `--destructive-foreground` token and a solid focus ring.
- Filled buttons keep 4.5:1 text contrast on hover.
- Each component file imports the files it depends on, so a single file works on its own.
- The carousel tracks the current slide correctly.
