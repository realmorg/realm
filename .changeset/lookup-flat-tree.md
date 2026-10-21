---
"@realmorg/realm": patch
---

`lookup()` follows the flat tree. Slotted content now reads from components that wrap its slot inside the host's shadow markup, before the host itself. Handler names and `#` references still resolve from the component the content is placed in, so a component's shadow markup never captures them.
