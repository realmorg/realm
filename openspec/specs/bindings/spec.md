# bindings Specification

## Purpose
Showing values with native slots and binding attributes with the _ prefix.

## Requirements

### Requirement: Value slots
A <slot> whose name starts with # or @ SHALL show that value as text. The html attribute SHALL sanitise HTML and html-unsafe SHALL insert it raw. Empty, null or undefined values SHALL show the slot's fallback content.

#### Scenario: text, html, unsafe html and fallback
- **WHEN** value slots use every mode
- **THEN** text, sanitised HTML, raw HTML and fallback content appear

#### Scenario: slot fallback content renders through nested slot projection
- **WHEN** a value slot is projected through another component
- **THEN** its content renders

#### Scenario: invalid references warn
- **WHEN** a slot or binding uses an invalid reference
- **THEN** REALM warns

### Requirement: Attribute bindings
_name="#ref" SHALL bind an attribute to a reference, with an optional leading !. true SHALL add, and false or null SHALL remove, the attribute. aria-* SHALL receive "true"/"false". value/checked/selected/indeterminate SHALL set properties, and SHALL NOT write (or track) a property that already has the value, so typed values keep `tooShort`/`tooLong` and are not overwritten. Objects on custom elements SHALL be passed as properties. --name SHALL set a CSS custom property.

#### Scenario: covers every value rule
- **WHEN** values of every kind are applied
- **THEN** each follows its rule

#### Scenario: bindings follow state, including css variables
- **WHEN** state changes
- **THEN** bound attributes and CSS variables update

#### Scenario: parse and write rules
- **WHEN** references are parsed or written
- **THEN** valid paths work and invalid writes warn

#### Scenario: a typed value is not written back, so length limits still apply
- **WHEN** a typed value flows into state and back into the bound input
- **THEN** the input is not rewritten and reports tooShort

#### Scenario: a bound value on a component keeps what the user types until state changes
- **WHEN** the user types into a component whose value is bound to state that updates after a debounce
- **THEN** the typed value is kept and reaches the handler

### Requirement: Event handlers in markup
Native on<event> attributes in component markup SHALL run in the component's script scope with event and this. return false SHALL cancel. debounce and throttle attributes SHALL time handlers, and timers SHALL be cleared on removal. A repeat loop variable named event SHALL be the item inside the handlers of its loop.

#### Scenario: debounce and throttle on handlers
- **WHEN** events fire rapidly
- **THEN** handlers run once per window

#### Scenario: debounced handlers are cancelled when the element is removed
- **WHEN** an element is removed mid-debounce
- **THEN** the handler never runs

#### Scenario: invalid durations warn and fire immediately
- **WHEN** a duration is invalid
- **THEN** REALM warns and runs without delay

#### Scenario: a loop variable named event is the item in its handlers
- **WHEN** a repeat uses as="event" and an item's handler passes event to a function
- **THEN** the function receives the item

### Requirement: SVG bindings
Bindings on SVG elements SHALL keep the SVG attribute case (`_viewBox` sets `viewBox`) and value slots inside SVG SHALL render as text nodes.

#### Scenario: bindings keep SVG attribute case and value slots render as text
- **WHEN** a component binds SVG attributes and shows values inside `<text>`
- **THEN** the SVG renders correctly

### Requirement: HTML value slots in SVG
A value slot with `html` or `html-unsafe` inside SVG SHALL render the value as SVG elements, sanitised in `html` mode.

#### Scenario: html value slots inside SVG render sanitised SVG elements
- **WHEN** an SVG value slot in html mode receives markup
- **THEN** SVG elements render and unsafe parts are removed

### Requirement: Indeterminate progress
Binding `value` on `<progress>` or `<meter>` to an absent value SHALL remove the attribute.

#### Scenario: an absent value leaves progress and meter indeterminate
- **WHEN** the bound value is null
- **THEN** the element has no value attribute until a value arrives
