---
name: saas-sidebar-redesign
description: Redesign a Vue 3 app into a modern SaaS interface with a left vertical collapsible sidebar, CSS design tokens, and a slim top bar. Use this skill when the user asks to modernize the UI, add sidebar navigation, convert top-nav tabs to a side rail, introduce design tokens, or give the app a SaaS look.
---

# SaaS Sidebar Redesign

Transform a Vue 3 single-page app from a horizontal top-nav layout into a modern SaaS
interface: a **left vertical collapsible sidebar** for primary navigation, a **slim top bar**
for utility chrome, a **CSS design-token system** for consistent spacing/color, and a
polished, professional, accessible look.

You act as the **orchestrator**. You audit, design tokens, write precise delegation briefs,
and verify in the browser. You do **not** edit `.vue` files yourself — every `.vue` change is
performed by the `vue-expert` subagent (see Mandatory Delegation Rule).

This skill is **hybrid**: the methodology is generic and works on any Vue 3 app, but every
default below is derived from this repository (a factory inventory app) used as the worked
example. When run elsewhere, follow the detection heuristics in *Reusability*.

## When to Use This Skill

Invoke when the user wants to:
- Replace a top navigation bar with a vertical sidebar / side rail
- "Modernize", "polish", or give the app a "SaaS / dashboard" look
- Introduce a design-token system (CSS custom properties) for consistent spacing and color
- Add a collapsible navigation with icons

Do **not** use it for content/feature work, backend changes, or single-component tweaks that
don't touch app-wide layout.

## Prerequisites & Environment

- **Frontend** runs on `http://localhost:3000` (Vite), **backend** on `http://localhost:8001`.
- Start servers with the `start` skill (or `scripts/start.sh` on macOS/Linux). On Windows,
  start manually: `cd server; uv run python main.py` and `cd client; npm run dev`.
- **Browser verification** uses **Playwright MCP** (`mcp__playwright__*`) against
  `http://localhost:3000`.
- The redesign is **CSS + template structure only** — no new runtime dependencies, no router
  changes, no backend changes.

## Mandatory Delegation Rule (.vue → vue-expert)

> **You MUST NOT edit any `.vue` file directly.** Every creation or modification of a `.vue`
> file — `App.vue`, the new `Sidebar.vue`, `FilterBar.vue`, and all `views/*.vue` — **MUST be
> delegated to the `vue-expert` subagent** (Task tool, `subagent_type: vue-expert`). This is a
> hard rule from the project's CLAUDE.md.

Your direct responsibilities (allowed without delegation):
- Read / Glob / Grep to audit the codebase
- Playwright MCP verification (screenshots, accessibility snapshots)
- Editing **non-`.vue`** files only when necessary (e.g. `locales/*.js`) — but prefer bundling
  locale edits into the same `vue-expert` task that adds the labels, so strings stay in sync

Every brief you send to `vue-expert` must include: the exact file(s), the relevant token names
/ class names to use, the i18n keys to read or add, the accessibility requirements, and the
reminder **"no emojis."**

## Redesign Methodology

Execute these steps in order. Steps that touch `.vue` files are marked **[delegate]**.

### Step 1 — Audit the Current Layout
Read the nav host (`client/src/App.vue`), the router (`client/src/main.js`), the chrome
components, and one representative view. Record:
- The route table (this list **is** the sidebar item set)
- The nav label source — i18n (`t('...')`) vs hardcoded literals
- Sticky offsets, fixed heights, and the z-index ladder
- Hardcoded colors and ad-hoc spacing values to be tokenized

### Step 2 — Capture "Before" Screenshots
Confirm the dev server responds, then use Playwright MCP to screenshot `/`, `/inventory`, and
`/orders` at ~1440px. These are the baseline for the after-comparison and active-state check.

### Step 3 — Define Design Tokens **[delegate]**
Add the `:root` token block (see *Design Token Reference*) to the global `<style>` in
`App.vue`. Tokens go in first so every later step references them.

### Step 4 — Build `Sidebar.vue` **[delegate]**
Create `client/src/components/Sidebar.vue` per the *Sidebar Component Spec*: collapsible
(expanded icon+label / collapsed icon-only rail), localStorage-persisted toggle, active-route
highlight via `<router-link>` + `aria-current`, i18n labels, inline SVG icons. Do not wire it
into the layout beyond importing — the shell rewrite (Step 5) places it.

### Step 5 — Restructure the App Shell **[delegate]**
Rewrite the `App.vue` template from the flex-column + top-nav layout to the CSS Grid shell in
*Layout Architecture*. Move the logo into the sidebar header; keep a slim top bar for the
collapse toggle (left) and `LanguageSwitcher` + `ProfileMenu` (right). **Preserve the existing
`<script>` logic untouched** — the tasks/profile state and the `@show-profile-details` /
`@show-tasks` event wiring and modals must survive the template rewrite.

### Step 6 — Reposition Chrome **[delegate]**
Update `FilterBar.vue`: change its sticky `top: 70px` (tied to the old nav height) to
`top: var(--topbar-height)` so it sticks flush beneath the slim top bar. Confirm
`ProfileMenu` and `LanguageSwitcher` render in the top bar with dropdowns above content.

### Step 7 — Migrate Views to Tokens **[delegate]**
Update each `client/src/views/*.vue` so `.page-header`, spacing, and colors use the new CSS
variables (e.g. `padding: 1.25rem` → `var(--space-5)`, `#e2e8f0` → `var(--color-border)`).
CSS-only — no template or logic changes. Batch the six views into one or a few `vue-expert`
tasks.

### Step 8 — Responsive Behavior **[delegate]**
Add breakpoints: below ~1024px the sidebar auto-collapses to the rail; below ~768px it becomes
an off-canvas drawer (overlay + backdrop) toggled from the top bar.

### Step 9 — Verify with Playwright
Run the full *Verification Protocol*: after-screenshots at 1440/1024/375px, active-state
assertions, collapse persistence across reload, dropdown/FilterBar regression, no console
errors. Present before/after to the user.

## Design Token Reference

Add this block to the global `<style>` in `App.vue` (Step 3). Values are derived from the
existing slate/blue palette plus a 4px-base spacing scale.

```css
:root {
  /* Surfaces & text */
  --color-bg:            #f8fafc;
  --color-surface:       #ffffff;
  --color-surface-alt:   #f1f5f9;
  --color-text:          #1e293b;
  --color-text-strong:   #0f172a;
  --color-text-muted:    #64748b;
  --color-text-subtle:   #475569;

  /* Borders */
  --color-border:        #e2e8f0;
  --color-border-strong: #cbd5e1;

  /* Brand / accent */
  --color-accent:        #2563eb;
  --color-accent-hover:  #1d4ed8;
  --color-accent-soft:   #eff6ff;   /* active nav background */

  /* Status */
  --color-success:       #059669;
  --color-info:          #2563eb;
  --color-warning:       #ea580c;
  --color-danger:        #dc2626;

  /* Spacing (4px base) */
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.25rem; --space-6: 1.5rem;
  --space-8: 2rem;     --space-10: 2.5rem;

  /* Radii */
  --radius-sm: 6px;  --radius-md: 8px;  --radius-lg: 10px;  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 3px 0 rgba(0,0,0,0.05);
  --shadow-sm: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.08);

  /* Layout */
  --sidebar-width:           240px;
  --sidebar-width-collapsed: 64px;
  --topbar-height:           56px;
  --z-sidebar:    200;
  --z-topbar:     150;
  --z-filterbar:  90;
  --z-dropdown:   1000;
  --transition-fast: 0.2s ease;
}
```

When migrating, **replace each literal with the nearest token**. Keep existing status-badge
classes but point their colors at the status tokens.

## Layout Architecture

Replace the `.app` flex column with a CSS Grid shell whose collapse swaps a single variable:

```css
.app {
  --rail: var(--sidebar-width);          /* the one source of truth for column width */
  display: grid;
  grid-template-columns: var(--rail) 1fr;
  grid-template-rows: var(--topbar-height) 1fr;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  min-height: 100vh;
  transition: grid-template-columns var(--transition-fast);
}
.app.is-collapsed { --rail: var(--sidebar-width-collapsed); }

.sidebar      { grid-area: sidebar; position: sticky; top: 0; height: 100vh;
                z-index: var(--z-sidebar); background: var(--color-surface);
                border-right: 1px solid var(--color-border); }
.top-bar      { grid-area: topbar; position: sticky; top: 0; z-index: var(--z-topbar);
                display: flex; align-items: center; gap: var(--space-4);
                padding: 0 var(--space-6); background: var(--color-surface);
                border-bottom: 1px solid var(--color-border); }
.main-content { grid-area: content; padding: var(--space-6) var(--space-8); }
```

- **Widths:** expanded sidebar `240px`, collapsed rail `64px`, top bar `56px`.
- **z-index ladder:** sidebar `200` > top bar `150` > FilterBar `90`; dropdowns (Profile /
  Language) stay `1000`; mobile drawer backdrop ~`190` (just under the sidebar).
- **FilterBar:** its sticky offset moves from `top: 70px` to `top: var(--topbar-height)`.

## Sidebar Component Spec

`client/src/components/Sidebar.vue`:

- **State:** `collapsed` ref initialized from `localStorage.getItem('sidebar-collapsed')`;
  a `toggle()` writes it back. The `is-collapsed` class on `.app` is driven by this state
  (lift it to `App.vue` or emit, your choice — keep one canonical source).
- **Structure:** `<aside class="sidebar"><header>` (logo / logo-mark) `+ <nav aria-label="Primary">`
  containing one `<router-link>` per route.
- **Items:** built from the route list. Each item = inline SVG icon + label span. In rail
  mode the label is visually hidden but remains accessible (`title` + visually-hidden text or
  `aria-label`); never remove the accessible name.
- **Active state:** rely on `<router-link>` active classes and set `aria-current="page"` on the
  active route; style with `--color-accent` text + `--color-accent-soft` background.
- **Icons:** inline SVG, 24×24 viewBox, `stroke="currentColor"`/`fill="currentColor"` so they
  inherit link/hover/active colors. No icon library is installed — do not add one, and do not
  use emojis. (`FilterBar.vue` already uses an inline `currentColor` SVG; match that style.)
- **Labels:** use i18n (`t('nav.*')`), never hardcoded strings.

## i18n Requirements

- Reuse the existing `nav.*` keys for nav labels.
- Any **new** user-facing string (e.g. `nav.reports`, and aria labels like `sidebar.expand` /
  `sidebar.collapse`) MUST be added to **both** `client/src/locales/en.js` and
  `client/src/locales/ja.js`.
- **Repo-specific fix:** the current "Reports" nav link is hardcoded English while the other
  five use `t('nav.*')`. Add a `nav.reports` key to both locales and bind the sidebar item to
  it — do not carry the hardcoded string into the sidebar.

## Working Example: This Repo

Before → after for the factory inventory app:

- **Routes (sidebar items):** `/` Overview · `/inventory` Inventory · `/orders` Orders ·
  `/spending` Finance · `/demand` Demand Forecast · `/reports` Reports.
- **Before:** `App.vue` `.top-nav` (sticky, 70px, z-index 100) with horizontal `.nav-tabs`
  `<router-link>`s; `FilterBar` sticky at `top: 70px` (z-index 90); `LanguageSwitcher` +
  `ProfileMenu` top-right; `<main class="main-content">` (padding 1.5rem 2rem).
- **After:** grid shell; logo (`nav.companyName` = "Catalyst Components") in the sidebar
  header; the six routes as a vertical icon+label list; slim 56px top bar with the collapse
  toggle left and Language/Profile right; `FilterBar` sticking at `var(--topbar-height)`;
  views and `main-content` spacing on tokens.
- **Preserve:** the App.vue script's tasks/profile state and `@show-profile-details` /
  `@show-tasks` wiring with `ProfileDetailsModal` / `TasksModal`.

## Reusability: Running on a Different Vue App

The defaults above are "for this repo." On a different app, detect equivalents first:

- **Nav host & items:** Grep for `<router-link` / `router-view` to find the nav host
  component; read the router config for the route table — that list is the sidebar item set.
- **Label source:** check whether links use `t(`/`$t(` (i18n → reuse keys + locale files) or
  literals (→ keep literals).
- **Token system:** Grep for `:root` / `var(` / `--color`. If tokens exist, **extend** them;
  if absent, **introduce** the token block.
- **Icons:** check `package.json`. If an icon library is present, use it; if not, inline SVG.
- **Chrome:** scan the nav host template for top-right utilities (profile, language,
  notifications) and relocate them to the top bar.

## Verification Protocol

Using Playwright MCP against `http://localhost:3000`:

1. **Servers up:** confirm the frontend responds before screenshotting.
2. **Before/after screenshots:** `/`, `/inventory`, `/orders` at 1440px, 1024px, 375px; compare.
3. **Active state:** navigate to each route, snapshot the accessibility tree, assert the
   matching sidebar link has `aria-current="page"` and the active class.
4. **Collapse persistence:** toggle the sidebar, reload, confirm the rail stays collapsed
   (localStorage read on mount).
5. **No regression:** open `ProfileMenu` and `LanguageSwitcher` — dropdowns render above
   content; `FilterBar` sticks flush under the top bar with no gap; no console errors.
6. **Responsive:** at 1024px the sidebar is a rail; at 375px it's an off-canvas drawer with a
   working backdrop.

## Guardrails — What NOT to Do

- **No emojis** anywhere in the UI; icons are inline SVG only.
- **Never edit `.vue` files directly** — always delegate to `vue-expert`.
- **Don't change the router** — routes and paths in `main.js` stay identical; the sidebar binds
  to them, it doesn't redefine them.
- **Keep i18n intact** — reuse `nav.*`; add any new key to **both** `en.js` and `ja.js`; never
  hardcode user-facing strings.
- **Preserve `App.vue` script logic** — tasks/profile state and modal event wiring survive the
  template rewrite untouched.
- **Accessibility is required:** `<nav aria-label="Primary">`; `aria-current="page"` on the
  active link; the collapse control is a real `<button>` with `aria-expanded` and an
  `aria-label` that updates between expand/collapse; visible `:focus-visible` ring using
  `--color-accent`; accessible names remain in rail mode.
- **No new dependencies** — tokens + inline SVG only.
- **Fix the FilterBar offset** — `top: 70px` → `top: var(--topbar-height)`.
- **Stay within the palette** — slate/gray + accent blue + status colors, encoded as tokens.

## Completion Checklist

- [ ] `:root` design tokens added to `App.vue`; literals migrated to tokens across shell + views
- [ ] `Sidebar.vue` created: collapsible, icon+label/rail, localStorage persistence, inline SVG
- [ ] `App.vue` shell is a CSS Grid `[sidebar | topbar/content]`; logo in sidebar; slim top bar
- [ ] `LanguageSwitcher` + `ProfileMenu` in top bar; collapse toggle present; modals still wired
- [ ] `FilterBar` sticks at `var(--topbar-height)`; z-index ladder correct
- [ ] `nav.reports` (and any new keys) added to both locales; all labels via i18n
- [ ] Responsive: rail <1024px, drawer <768px
- [ ] a11y verified: `aria-current`, `aria-expanded`, focus ring, accessible rail labels
- [ ] Playwright before/after captured; active-state, persistence, no console errors confirmed
- [ ] Every `.vue` change was made by `vue-expert`, not directly
