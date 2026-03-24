## Luzmo (embedded analytics)

When implementing Luzmo functionality (Embed tokens, core API, Flex SDK, or Luzmo IQ), ALWAYS refer to Luzmo's [AGENTS.md](https://developer.luzmo.com/agents.md) file for official best practices and implementation guidelines.


## Architecture Rules

1. **Vanilla TypeScript only.** No React, Angular, Vue, or Svelte.
2. **Web Component friendly.** DOM must accommodate `<luzmo-*>` custom elements.
3. **No heavy UI frameworks.** No Tailwind, Bootstrap, Material UI, etc.
4. **Strict typing.** `strict: true` in tsconfig. No `any` types.
5. **Immutable state updates.** Store uses pure reducer-style updates (spread, filter, concat).
6. **Module separation:**

## Code Quality Standard

### On every change, verify:

1. **Zero type errors.** Run `npx tsc --noEmit`.
2. **No dead code.** Remove unused imports, variables, functions, CSS rules.
3. **Consistent naming.** `camelCase` vars/functions, `PascalCase` types, `UPPER_SNAKE` constants, BEM CSS (`block__element--modifier`).
4. **No `any` types.** Use `unknown` + narrowing, or define a proper interface.
5. **Immutable state.** All store updates use spread/filter/concat.
6. **CSS via custom properties.** Use `:root` design tokens. No hard-coded one-off values. Tokens: palette (`--color-bg/surface/surface-raised/surface-hover/accent/accent-hover/accent-subtle/accent-glow/accent-border/accent-rgb/text/text-muted/text-dim/border/border-light/danger`), typography (`--font-heading/display/body`), spacing (`--space-xs/sm/md/lg/xl/2xl`), radii (`--radius-sm/md/lg`), shadows (`--shadow-sm/md/lg/card-hover/button-hover`), transitions (`--ease-out/duration-fast/normal/slow`), layout (`--sidebar-width/sidebar-collapsed-width/header-height`). Use `rgba(var(--color-accent-rgb), <opacity>)` for accent at arbitrary opacity.
7. **Animations must not fight.** Use `animation-fill-mode: backwards` for entrance animations (not `forwards` or `both`).
8. **Accessibility.** Every interactive element needs a visible focus state, semantic role, and `aria-label` if purpose isn't obvious.
9. **No console output in production paths.** `console.warn` / `console.error` for error reporting only.
10. **Clean imports.** Use `import type` for type-only imports. External packages first, then local modules, alphabetically within groups.
11. **Concise JSDoc.** Public functions and interfaces get a one-line JSDoc.

---

## Styling / Design Requirements

Commit to a distinctive "industrial / modern construction" aesthetic (not generic dashboard UI):

- **Typography:** Characterful display font for headings + clean body font. Pair fonts intentionally via Google Fonts `<link>` in `index.html`.
- **Color system:** CSS variables only. Dark slate base + one strong accent (safety orange) + restrained neutrals. Keep a dominant palette with sharp accents.
- **Spatial composition:** Clean grid, strong hierarchy, generous spacing. Sidebar feels like a "tool drawer"; main area like a "canvas".
- **Depth & atmosphere:** Subtle texture (faint noise overlay, soft gradient, or thin grid pattern). Modern shadows and borders used sparingly; prefer crisp lines with a few elevated surfaces.
- **Motion:** Page-load reveal with staggered fade/slide for sidebar items and tiles. Hover/focus micro-interactions with consistent timing.
- **Accessibility:** Visible focus states, keyboard-navigable sidebar and buttons, sensible contrast.

## Running the project

1. `npm install`
2. `npm run start`
3. Open `http://localhost:3000`