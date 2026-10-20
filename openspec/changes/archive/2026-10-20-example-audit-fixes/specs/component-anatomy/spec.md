## ADDED Requirements

### Requirement: Hidden elements in components
Inside a component's shadow root, an element with the `hidden` attribute SHALL not be displayed, whatever `display` the component's styles give it (except `hidden="until-found"`).

#### Scenario: hidden elements inside a component stay hidden whatever their display
- **WHEN** a component styles a button with `display: grid` and the button is hidden
- **THEN** it is not displayed
