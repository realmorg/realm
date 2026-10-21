---
"@realmorg/realm": patch
---

An explicit `lookup()` call in a component script no longer logs `<child> reads "name" from <parent>.`. Handler names and `#` references that a component reads from a parent without declaring them still log it.
