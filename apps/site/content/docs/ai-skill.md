---
title: Use REALM with coding assistants
description: Install the REALM agent skill in Claude Code, Codex, Cursor and other assistants, or point them at llms.txt and the Markdown copy of every page.
group: Guides
order: 55
nav: Coding assistants
---

# Use REALM with coding assistants

Coding assistants know the big frameworks well and REALM hardly at all. Left alone, they write `{{ }}` in markup, expressions in attributes and React-style state. The REALM agent skill fixes that: a folder of Markdown that teaches an assistant how REALM, REALM UI and Unicons really work, which it reads only when a task needs it.

## What the skill contains

The skill follows the [Agent Skills](https://agentskills.io) format: a `SKILL.md` with the core rules, plus reference files the assistant opens on demand.

| File | Covers |
| --- | --- |
| `SKILL.md` | When to use the skill, the mental model, CDN setup, a quick start and the hard rules (no interpolation, references only in attributes, `type="realm"` for inline definitions, `repeat` inside lists, compound parts, design tokens) |
| `references/api.md` | Every script helper with its signature and an example |
| `references/markup.md` | Definitions, references, value slots, bindings, handlers, control flow, lists, `ref`, `focusgroup` |
| `references/fetching.md` | Every fetch attribute, trigger, mode and event |
| `references/imports.md` | `<import-element>`, component files, dependencies and shared modules |
| `references/styling.md` | `:host`, reactive CSS, custom states and the theme tokens |
| `references/forms-a11y.md` | Form-associated components and accessibility |
| `references/ui-components.md` | Every REALM UI component: tags, parts, attributes, events and a usage snippet |
| `references/unicons.md` | `<u-icon>` and its icon sets |
| `references/recipes.md` | A todo list, a fetched list, a validated form, dialogs, a dashboard and a multi-page app |
| `references/pitfalls.md` | Common mistakes and every console message REALM prints |
| `references/testing.md` | How to check a page in a browser |

The skill is generated and tested in the REALM repository. Every runnable example in it runs in Chromium in CI, and every helper, attribute and tag it names is checked against the runtime.

## Claude Code

Install it with the [`skills` CLI](https://github.com/vercel-labs/skills), from your project:

```bash
npx skills add realmorg/realm
```

The CLI asks which assistants to install it for. To skip the questions, or to install it for every project:

```bash
npx skills add realmorg/realm --skill realm -a claude-code
npx skills add realmorg/realm --skill realm -a claude-code -g
```

Or copy it by hand. Claude Code reads skills from `.claude/skills/` in a project and `~/.claude/skills/` for all projects:

```bash
curl -LO https://realm.js.org/skills/realm.zip
unzip realm.zip -d ~/.claude/skills/
```

The skill is then at `~/.claude/skills/realm/SKILL.md`. Claude Code loads it when a task involves REALM, or when you ask it to use the `realm` skill.

## Codex, Cursor and other assistants

The same command installs the skill for any assistant the CLI supports. Pass its name with `-a`:

```bash
npx skills add realmorg/realm --skill realm -a codex
npx skills add realmorg/realm --skill realm -a cursor
```

| Assistant | Project folder | Global folder |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.agents/skills/` | `~/.cursor/skills/` |

To install by hand, unzip [realm.zip]({{root}}skills/realm.zip) into one of these folders. The [skills CLI agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) has the folders for other assistants.

An assistant without skill support can still use it: add a line to its rules file (`AGENTS.md`, `.cursor/rules/`, `CLAUDE.md`) that says "When writing REALM code, read `skills/realm/SKILL.md` first", with the folder copied into the project.

## Download

- [realm.zip]({{root}}skills/realm.zip): the whole skill, in a `realm/` folder.
- The raw files, for reading or linking: [SKILL.md]({{root}}skills/realm/SKILL.md) and the [references]({{root}}skills/realm/references/ui-components.md) next to it.

## llms.txt and Markdown pages

For assistants that read the web instead of a skill:

- [llms.txt]({{root}}llms.txt) lists every page of this site with a one-line summary.
- [llms-full.txt]({{root}}llms-full.txt) is the whole site as one Markdown file.
- Every page has a Markdown copy at the same address with `.md` instead of the trailing slash, such as [docs/state.md]({{root}}docs/state.md). The "View as Markdown" link at the bottom of each page opens it.

## Tips

- Ask for REALM by name ("build this as a REALM component"), so the assistant reaches for the skill.
- Ask it to check the result in a browser and read the console. Every `[realm]` warning names the component and the problem, and the skill lists the fix for each one.
- Keep the CDN setup. REALM needs no `npm install` and no bundler, and the skill tells assistants not to add them.
