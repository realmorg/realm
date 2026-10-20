## Why
The documentation review found four runtime bugs.

## What Changes
- Page handler attributes also cover events sent with dispatch().
- Form-associated components created inside a disabled fieldset start disabled.
- An absent value leaves progress and meter indeterminate.
- focusgroup walks the flat tree and skips items that are not rendered.

## Impact
Runtime only.
