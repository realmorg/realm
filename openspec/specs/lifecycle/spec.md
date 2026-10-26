# lifecycle Specification

## Purpose
Mounting, moving and tearing down components, and the cleanup guarantees that prevent memory leaks.

## Requirements

### Requirement: Native lifecycle
Setup SHALL run when the element is connected. Moving an element SHALL keep its state. Removal SHALL tear it down after a microtask: run onDisconnected hooks, abort its signal, stop observers and clear its shadow root. Reconnecting later SHALL mount it fresh.

#### Scenario: onConnected, onDisconnected, host, refs, signal and internals
- **WHEN** a component uses lifecycle helpers
- **THEN** they run in order and cleanups run on removal

#### Scenario: moving an element keeps its state, removing it tears it down
- **WHEN** an element is moved, then removed, then re-added
- **THEN** state survives the move and resets after teardown

#### Scenario: loading state is exposed as :state(loading)
- **WHEN** requests run
- **THEN** the host matches :state(loading)

### Requirement: Waiting for ancestors
A component inside an ancestor REALM component that is still being set up SHALL wait until that ancestor is defined before running its own setup, and SHALL NOT set up if it is removed while waiting. A component SHALL also wait for an ancestor component that is itself waiting, so a parent always sets up before its children.

#### Scenario: a part whose parent finishes setting up later waits for it and reads its state
- **WHEN** a part is defined before its parent finishes setting up
- **THEN** it renders the parent's state once the parent is ready, without warnings

#### Scenario: a child added while its parent waits for an ancestor sets up after the parent
- **WHEN** a parent waits for an ancestor that is still loading, the ancestor finishes, and a child is added to the parent before the parent sets up
- **THEN** the child sets up after the parent and renders the parent's state, without warnings

### Requirement: Recursive components
A component MAY render itself, directly or through other components. Nesting depth SHALL NOT be limited by the browser's call stack. A component nested more than 1000 components deep through shadow roots SHALL NOT be set up, and REALM SHALL warn that a component which renders itself needs a condition that stops it.

#### Scenario: a recursive component renders a tree deeper than the call stack allows
- **WHEN** a component renders itself inside `<is-visible>` until a prop reaches zero, starting from 300
- **THEN** all 301 levels are set up and rendered

#### Scenario: a component that renders itself without a stop warns and stops
- **WHEN** a component always renders itself
- **THEN** nesting stops after 1000 levels and REALM warns once that the component needs a condition that stops it
