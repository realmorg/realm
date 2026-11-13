## Why
Binding a number to a string prop, such as `<ui-input _value="#cart.quantity">`, logged a warning and left the field empty, because the prop rejected anything that was not a string. A native input shows the number as text.

## What Changes
- A string prop converts a finite number to its text. Other types still fail with the same message.

## Impact
Runtime (`props.ts`), a few bytes.

