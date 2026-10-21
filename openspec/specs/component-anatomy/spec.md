# component-anatomy Specification

## Purpose
How a component is defined with a single <custom-element> tag holding a script, styles and markup.

## Requirements

### Requirement: Definition by tag only
A component SHALL be defined only by a <custom-element> element whose name attribute contains a dash. REALM SHALL NOT offer a JavaScript definition API.

#### Scenario: rejects names without a dash
- **WHEN** a <custom-element> has a name without a dash
- **THEN** REALM warns and defines nothing

#### Scenario: counter renders state through a value slot and updates on click
- **WHEN** a component with a script, a style and markup is used in the page
- **THEN** it renders, and state changes from a click are shown

### Requirement: Script, style and markup parts
A definition SHALL treat its first direct <script> child as the component script, direct <style> and <link rel=stylesheet> children as its styles, and every other child as markup. No <template> wrapper SHALL be required.

#### Scenario: uses the first script and warns about extras
- **WHEN** a definition has two scripts
- **THEN** only the first runs and REALM warns

#### Scenario: components without a script render their markup
- **WHEN** a definition has no script
- **THEN** its markup still renders

#### Scenario: styles and linked stylesheets are adopted
- **WHEN** a definition has a <style> and a <link rel=stylesheet>
- **THEN** both apply inside the component only

### Requirement: Idempotent definitions
Defining the same source twice SHALL do nothing. A different source for an existing name SHALL keep the first definition and warn. A name owned by another library SHALL warn.

#### Scenario: defining the same source twice is harmless, a different source warns
- **WHEN** the same component is defined twice
- **THEN** the second identical definition is ignored and a different one warns

#### Scenario: warns when another library owns the name
- **WHEN** the name is already a non-REALM custom element
- **THEN** REALM warns and leaves it alone

### Requirement: Inline definitions
A definition written in the page SHALL use script and style elements with type="realm", which the browser treats as inert. REALM SHALL warn when an inline definition uses a plain script, because it already ran in the page scope.

#### Scenario: inline definitions warn about a plain script and accept type=realm
- **WHEN** inline definitions use a plain script and a typed script
- **THEN** the plain one warns and the typed one works

#### Scenario: a script or style with a non-standard type is inert
- **WHEN** a page has script and style elements with type=realm
- **THEN** neither runs nor applies

#### Scenario: defines inline definitions already in the page and ones added later
- **WHEN** definitions exist at start-up or are added later
- **THEN** all of them are defined and removed from the page

#### Scenario: elements inside a page definition are not mounted
- **WHEN** a REALM element sits inside an inline definition
- **THEN** it is not mounted while it is part of the definition

### Requirement: Hidden components
The `hidden` attribute SHALL hide any component, whatever display its styles give the host.

#### Scenario: the hidden attribute hides a component whatever its display
- **WHEN** a component with `:host { display: flex }` gets `hidden`
- **THEN** it is not displayed

### Requirement: Compound parts
A definition with a `slot` attribute SHALL give each of its elements that slot unless the element sets its own. A part's handlers and values SHALL resolve from the parent component it is placed in when the part does not define them. Parent lookups SHALL be reported during development only when the reader is not inside the owner's light DOM (that is, when it is nested through the owner's shadow markup).

#### Scenario: a definition's slot attribute places its elements in that slot of their parent
- **WHEN** a part declared with `slot="title"` is placed in a parent with a title slot
- **THEN** it is assigned to that slot, unless it sets its own

#### Scenario: compound parts call their parent's functions and show its state without a script
- **WHEN** a part without a script calls a parent function and shows parent state
- **THEN** the call reaches the parent, the value updates, and no lookup is reported

### Requirement: Explicit parent lookups
A `lookup()` call in a component script SHALL read the nearest parent that defines the name without being reported, because the author asked for it. Names a handler uses without the script defining them SHALL still be reported when read from a parent through its shadow markup.

#### Scenario: an explicit lookup through a shadow root reads the parent without a warning
- **WHEN** a component nested through another component's shadow markup calls `lookup("world")` and a parent defines `world`
- **THEN** it gets the parent's value and nothing is reported

#### Scenario: a handler that reads an undeclared name from a parent still warns
- **WHEN** a component's handler calls `save()`, which only its parent defines, across a shadow root
- **THEN** the call works and REALM reports that the component reads `save` from the parent

### Requirement: Hidden elements in components
Inside a component's shadow root, an element with the `hidden` attribute SHALL not be displayed, whatever `display` the component's styles give it (except `hidden="until-found"`).

#### Scenario: hidden elements inside a component stay hidden whatever their display
- **WHEN** a component styles a button with `display: grid` and the button is hidden
- **THEN** it is not displayed
