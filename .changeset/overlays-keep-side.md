---
"@realmorg/ui": patch
---

Dropdown menus, menubar menus, popovers, hover cards, tooltips and the combobox list keep the side they opened on. Before, scrolling on a phone could flip them above and below their trigger, because iOS Safari's toolbar changes the viewport height mid-scroll. They still flip sideways when needed. Opening a menu no longer scrolls the page to its first item.
