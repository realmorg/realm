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
