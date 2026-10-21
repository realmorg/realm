---
"@realmorg/realm": patch
---

Parent lookups follow the flat tree. Slotted content now reads from components that wrap its slot inside the host's shadow markup, before the host itself. Before, it skipped them and reached the host's parents instead.
