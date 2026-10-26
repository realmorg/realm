## ADDED Requirements

### Requirement: Accordion items animate their height
An open or closing `ui-accordion-item` SHALL animate the height of its content between collapsed and its natural height with the theme's default transition duration and timing function, keeping the content visible until it has collapsed where the engine transitions `content-visibility` on `::details-content`. When the user prefers reduced motion, the item SHALL open and close without animation.

#### Scenario: accordion items animate their height when they open and close
- **WHEN** the user opens a closed accordion item and then closes it
- **THEN** the content starts collapsed and grows to its natural height, and on closing it shrinks back before it is hidden

#### Scenario: accordion items open and close instantly when the user prefers reduced motion
- **WHEN** the user prefers reduced motion and opens and then closes an accordion item
- **THEN** the content reaches its natural height at once and is hidden at once
