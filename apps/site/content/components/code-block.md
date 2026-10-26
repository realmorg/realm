---
title: Code Block
description: A monospaced block for code with a language label and a copy-to-clipboard button.
group: Chat and content
order: 603
nav: Code Block
---

# Code Block

`ui-code-block` shows code in a bordered, horizontally scrolling block with the language name and a copy button in
the top corner. The copy button writes the block's text content to the clipboard with
`navigator.clipboard.writeText()` and shows a check mark for 1.5 seconds. It does not highlight syntax. Slot
highlighted markup if you need colours.

Whitespace is preserved, so put the code in a `<pre>` (or start it right after the opening tag) and escape `<` as
`&lt;`. A slotted `<pre>` gets no margin. The block is as wide as its container, so size it with a wrapper.

```html live
<div class="demo-medium">
  <ui-code-block language="html"><pre>&lt;script type="module" src="https://realm.js.org/dist/realm.js"&gt;&lt;/script&gt;</pre></ui-code-block>
</div>
```

## Examples

### Multi-line code

```html live
<div class="demo-medium">
<ui-code-block language="html"><pre>&lt;custom-element name="hello-world"&gt;
  &lt;script&gt;
    defineProps({ name: prop.string().default("world") });
  &lt;/script&gt;
  &lt;p&gt;Hello, &lt;slot name="@name"&gt;&lt;/slot&gt;!&lt;/p&gt;
&lt;/custom-element&gt;</pre></ui-code-block>
</div>
```

### In a message

Code blocks fit inside a `ui-message` next to ghost bubbles for assistant replies.

```html live
<div class="demo-medium">
  <ui-message>
    <ui-message-header>Assistant</ui-message-header>
    <ui-bubble variant="ghost">Read the JSON body of a response like this:</ui-bubble>
    <ui-code-block language="js"><pre>const response = await fetch("/api/user");
const user = await response.json();</pre></ui-code-block>
  </ui-message>
</div>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | string | | Label shown in the top corner, in upper case. Display only. |

### Parts

`ui-code-block` has no child parts. Its default slot takes the code, usually a `<pre>`. Its trimmed `textContent` is
what the copy button copies.

### CSS parts

| Part | Description |
| --- | --- |
| `code` | The scrolling area around the code (`white-space: pre`). |
| `bar` | The corner bar with the language label and the copy button. |

### Accessibility

The copy button is a `ui-button` with `aria-label="Copy code"`. The check mark that confirms the copy is visual only, and
nothing is announced.
