## Why
A consumer build under script-src self showed script-less compound parts still assembled at runtime and were blocked.

## What Changes
- Definitions with no script and no handlers insert no script.
- The compiler and plugin pre-assemble handler-only definitions by inserting a script src.

## Impact
Runtime and plugin.
