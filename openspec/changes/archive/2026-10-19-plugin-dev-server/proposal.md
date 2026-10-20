## Why
Vite dev rewrites inline module scripts in served HTML into html-proxy URLs, which REALM then reads as a precompiled script src.

## What Changes
- In dev, the plugin serves .html files fetched by import-element (not navigations) untransformed.

## Impact
Plugin only.
