# Contributing to REALM

Thank you for helping with REALM. This guide covers how we work, how to set up the repository and how to send a change.

## We build REALM with AI

REALM is developed with AI coding assistants, and we encourage you to use one too: Claude Code, Codex, Cursor, Copilot or any other. The repository is set up so an assistant can work in it well:

- **[`AGENTS.md`](../AGENTS.md)** holds the rules for this codebase: commands, coding conventions and how components are written. Claude Code reads it through `CLAUDE.md`, and most other assistants read `AGENTS.md` directly.
- **OpenSpec skills** in `.claude/skills` and `.agents/skills` take a change from idea to archive: `/opsx:explore` to think it through, `/opsx:propose` to write the proposal, design, specs and tasks, `/opsx:apply` to implement it and `/opsx:archive` to finish.
- **The REALM agent skill** in [`skills/realm`](../skills/realm) teaches an assistant to write REALM components, use REALM UI and Unicons, and avoid common mistakes. Install it in your own projects with `npx skills add realmorg/realm`.

Using AI does not change who is responsible for the change: you are. Before you open a pull request:

- Read and understand every line you submit, and be ready to explain it in review.
- Run the checks below yourself. Do not rely on the assistant saying they pass.
- Keep the change focused. Ask the assistant for one change at a time and review the diff before you commit.
- Never paste secrets, tokens or private data into an assistant.

You do not need to say which tool you used.

## Setting up

You need Node.js 22 or later and [pnpm](https://pnpm.io).

```shell
git clone https://github.com/realmorg/realm.git
cd realm
pnpm install
```

The repository is a monorepo:

| Folder | Contents |
| --- | --- |
| `packages/realm` | The runtime, `@realmorg/realm` |
| `packages/ui` | REALM UI components, `@realmorg/ui` |
| `packages/unicons` | The icon library, `@realmorg/unicons` |
| `packages/vite-plugin` | The Vite plugin, `@realmorg/vite-plugin` |
| `apps/site` | The website at realm.js.org, built with REALM |
| `apps/examples` | Example apps, served by the website |
| `skills/realm` | The REALM agent skill |
| `openspec/specs` | The specification of REALM's behaviour |

To work on the website, the docs or the examples, run `pnpm --filter site dev` and open http://localhost:5173/.

## Making a change

1. **Behaviour changes start as an OpenSpec proposal.** REALM's behaviour is specified in `openspec/specs`. Propose a change with `/opsx:propose` (or `pnpm exec openspec` in a terminal) instead of editing the specs directly. Fixes to docs, examples or tests do not need a proposal.
2. **Every change comes with tests.** Each spec scenario has a test with the same title, and the coverage of `packages/realm/src` and of every component script stays at 100%.
3. **Package changes need a changeset.** Run `pnpm change` and describe the change for the changelog.

Run the checks before you push:

| Check | Command |
| --- | --- |
| Lint and format | `pnpm lint` (fix with `pnpm format`) |
| Types | `pnpm typecheck` |
| Specs | `pnpm spec` |
| Runtime tests with the coverage gate | `pnpm --filter @realmorg/realm coverage` |
| Runtime in Firefox and WebKit | `pnpm --filter @realmorg/realm test:cross` |
| UI components | `pnpm --filter @realmorg/ui coverage` and `pnpm --filter @realmorg/ui test:cross` |
| Website and examples | `pnpm --filter site coverage` and `pnpm --filter site test` |
| Runtime size | `pnpm build && pnpm size` |
| Agent skill | `pnpm skill:check` and `pnpm skill:test` |

## Sending a pull request

1. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, such as `fix(ui): keep hovered buttons readable`.
2. Open a pull request against `main` and describe what changed and why. Link related issues.
3. CI runs every check in Chromium, Firefox and WebKit. A maintainer reviews and merges the pull request when it passes.

## Issues and questions

Report bugs and suggest improvements in the [issue tracker](https://github.com/realmorg/realm/issues). For a bug, include the smallest page that shows it, the browser and what you expected to happen.

For anything else, contact the maintainers at [god@realm.codes](mailto:god@realm.codes).
