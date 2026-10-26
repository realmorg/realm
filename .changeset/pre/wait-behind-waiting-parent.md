---
"@realmorg/realm": patch
---

A parent component now always sets up before its children. On a slow connection, a child could set up while its parent was still waiting for an ancestor to load, and then miss the parent's state: a `ui-tabs-list` lost its orientation and arrow-key navigation, for example.
