## ADDED Requirements

### Requirement: Initial disabled state
A form-associated component SHALL read whether it is disabled (including by a disabled fieldset) when it connects.

#### Scenario: form-associated components created inside a disabled fieldset start disabled
- **WHEN** a component is created inside a disabled fieldset
- **THEN** `@disabled` is true from the first render

### Requirement: focusgroup in the flat tree
focusgroup SHALL find focusable items inside shadow roots that do not delegate focus, and SHALL skip items that are not rendered.

#### Scenario: focusgroup reaches into shadow roots and skips items that are not rendered
- **WHEN** a menubar holds links inside shadow roots and a closed menu
- **THEN** arrow keys move between the links and the menu trigger, skipping hidden items
