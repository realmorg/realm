---
"@realmorg/realm": patch
---

Recursive components (issue #57): a component can render itself as deep as its data goes. Nesting past 32 levels in one pass finishes in a microtask instead of overflowing the call stack, which used to stop trees at about 45 levels. A component nested more than 1000 deep is not set up, and REALM warns that its recursion needs a condition that stops it.
