# ambrosey.dev — Design Specs

Reference for building new pages/features consistent with the existing site.
Everything below is derived from the current CSS/HTML, not invented. Where a rule
is a judgement call for *new* work it is marked **[convention]**.

Stack: static HTML + vanilla CSS + ES modules. No framework, no build step, no
CSS preprocessor. Keep it that way.

---

## 1. File layout & load order

```
/index.html /works.html /connect.html   pages
/css/styles.css                         global: fonts, tokens, reset, nav
/css/<page>.css                         per-page: page tokens + page components
/scripts/<page>Handler.js               per-page ES module (type="module")
/data/*.json                            content data
/data/definitions.js                    shared JS constants
/assets/svgs, /assets/images            art
/fonts                                  Cascadia Mono variable TTFs
```

**Rule for new pages:** create `css/<page>.css` and load it **after**
`css/styles.css` so page-level `:root` overrides win:

```html
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/<page>.css">
```

> Known inconsistency: `index.html` loads `index.css` *before* `styles.css`, so
> on the home page `styles.css` wins the shared tokens (`--background-color:
> #F3F3F3`). `works.html` and `connect.html` load page CSS last, so their
> `:root` overrides win (`#f0f0f0` light). Don't copy index.html's order.

`index.css` also duplicates the `@font-face` blocks already in `styles.css`.
New page CSS should **not** redeclare `@font-face` — `styles.css` covers it.

---

## 2. Typography

**Family:** `"Cascadia Mono", monospace` via `--font-defaults`. Applied globally
through the `*` reset, so never set `font-family` on individual elements.

Variable font, weight axis `100–700`, normal + italic faces self-hosted from
`/fonts`.

**Weights in use:** `400` (roles/dates), `250` (experience bullet lists).
Default browser weights elsewhere (`h1`/`h2` bold, body 400).

**Casing:** headings, tags, buttons, and nav links are `UPPERCASE` — either
literal in HTML (`AMBROSE YIP`, `HOME`) or via `text-transform: uppercase`.
Body copy is sentence case.

### Font size scale (all fluid, `clamp(min, vw-based, max)`)

| Role | Value | Where |
| --- | --- | --- |
| Site title `nav h1` | `clamp(3rem, 3.5vw + 1rem, 5.5rem)` | styles.css |
| Nav links `nav span` | `clamp(1.25rem, 2vw + 0.5rem, 4rem)` | styles.css |
| Hero heading | `clamp(2.5rem, 3.5vw + 1rem, 4rem)` | connect.css |
| Hero paragraph | `clamp(1.25rem, 2vw + 0.1rem, 2.75rem)` | connect.css |
| Section heading `.about-me h2` | `clamp(1rem, 2vw + 0.5rem, 3rem)` | index.css |
| Dialog title | `clamp(1.5rem, 4vw + 0.25rem, 2.15rem)` | works.css |
| Card title | `clamp(1.5rem, 1.25vw + 0.25rem, 2rem)` | works.css |
| Company name | `clamp(1.25rem, 1.5vw + 0.5rem, 2rem)` | works.css |
| Role / date | `clamp(1rem, 0.75vw + 0.5rem, 1.5rem)` | works.css |
| Skill chip | `clamp(1rem, 1.25vw + 0.5rem, 1.5rem)` | works.css |
| Dialog footer links | `clamp(1.15rem, 1.25vw + 0.25rem, 1.5rem)` | works.css |
| Contact buttons | `clamp(1rem, 1vw + 0.25rem, 2rem)` | connect.css |
| Type tag | `clamp(1rem, 1.25vw + 0.25rem, 1.25rem)` | works.css |
| Body copy | `clamp(0.75rem, 0.5vw + 0.5rem, 2rem)` | index.css |
| List item | `clamp(0.75rem, 0.75vw + 0.25rem, 1.3rem)` | works.css |

**Rule:** never use a fixed `font-size` for text. Pick the row above that matches
the semantic role; if none fits, build a new clamp with the same shape
(`clamp(<mobile floor>, <n>vw + <rem base>, <desktop ceiling>)`). The only fixed
size in the codebase is the dialog close button glyph (`2.75rem`), which is an
icon, not text.

**Line height:** `1.5` for paragraphs. Headings use explicit `line-height` equal
to their own size (hero) or a fixed rem near it (`2rem` card title,
`2.25rem` dialog title).

**Letter spacing:** only `nav h1` — `0.75rem`, dropping to `0.25rem` ≤1024px and
`0` ≤768px. Nothing else tracks out.

---

## 3. Color tokens

All colors go through CSS custom properties. **Never hardcode a hex in a rule** —
the only literals in the codebase are the token definitions themselves, the
`::backdrop` scrim, and JS-driven data colors.

### Global tokens (`css/styles.css`)

| Token | Light | Dark |
| --- | --- | --- |
| `--background-color` | `#F3F3F3` | `#2B2B2B` |
| `--background-color-faded` | `#F3F3F300` | `#2B2B2B00` |
| `--bg-pattern-color` | `#E3E3E3` | `#5D5D5D` |
| `--text-color` | `#4e4e4e` | `#F3F3F3` |
| `--text-secondary-color` | `#353535` | `#c1c1c1` |
| `--link-color` | `#3ea5ed` | `#75c4ff` |
| `--link-active-color` | `#9441ea` | `#cc9cff` |

`--background-color-faded` is the same hue at `00` alpha — used only for the nav
gradient fade. If you override `--background-color` on a page, override the
faded variant to match or the nav fade will band.

### Shading ramp (borders, shadows, 3D faces, chip fills)

| Token | Light | Dark |
| --- | --- | --- |
| `--light-shading` | `#dfdfdf` | `#4C4C4C` |
| `--medium-shading` | `#D9D9D9` | `#3D3D3D` |
| `--dark-shading` | `#C5C5C5` | `#373737` |
| `--very-dark-shading` | `#A0A0A0` | `#202020` |

`--very-dark-shading` is the default shadow color across the whole site.

### Page-scoped tokens

`works.css` — `--background-color` `#f0f0f0`/`#2B2B2B`, `--bg-pattern-color`
`#e0e0e0`/`#353535`, `--card-background-color` `#ffffff`/`#3A3A3A`,
`--experience-text-color` `#000000`/`#FFFFFF`.

`connect.css` — `--hero-background-1` `#717171`/`#989898`, `--hero-background-2`
`#888888`/`#cccccc`, `--hero-h-color` `#ffffff`/`#252525`, `--hero-p-color`
`#F5F5F5`/`#303030`, plus the same `--bg-pattern-color` / `--card-background-color`
overrides as works. (`--link-btn-depth: 1rem` is declared but currently unused.)

`index.css` — `--road-color` `#E8E8E8`/`#414141`, `--line-color`
`#D9D9D9`/`#676767`.

### Data-driven colors

`data/definitions.js` → project type tag fills:
`web #fb6e49`, `data #52d66a`, `ml/ai #435dd6`, `library #efd05a`, `game #bc60e1`.
Fallback `#ccc`. These are the site's only saturated accents besides links —
use them sparingly and only for category identity.

`data/experience_data.json` carries a per-entry `background: [light, dark]` pair
applied inline by JS. Any new experience entry must supply both.

### Dark mode

Implemented purely with `@media (prefers-color-scheme: dark)` blocks that
re-declare `:root` tokens. There is **no** manual theme toggle and no `.dark`
class. Every new token you add must have a dark counterpart in the same file.

### Selection

`::selection` / `::-moz-selection` invert: `background var(--text-color)`,
`color var(--background-color)`.

---

## 4. Spacing

**Unit: `rem` everywhere.** Viewport units only for full-bleed sizing
(`100vw`, `100dvh`) and inside clamps. `px` appears once (`perspective: 350px`
in connect.css) — treat that as legacy, prefer rem.

**Scale — stick to these steps:**

`0.1` · `0.25` · `0.5` · `1` · `1.5` · `2` · `3` rem

Observed usage:

- `0.25rem` — chip gaps, tag padding-Y, underline thickness, shadow spread
- `0.5rem` — nav internal gap, card padding, tag offsets, dialog top margin
- `1rem` — default component padding, standard flex/grid gap, nav padding-Y
- `1.5rem` — stacked list gap (`.experiences-flex`, `.connect-container`),
  contact panel padding
- `2rem` — generous block padding (`.about-me`, `.contact-hero`), grid gap,
  heading bottom margin, `nav` padding-X
- `3rem` — page inline padding on connect, max scene gap

**Global reset** zeroes all `margin`/`padding` and sets `box-sizing: border-box`.
Every spacing value is therefore explicit and intentional — a component with no
declared padding genuinely has none.

**Prefer `gap` over margins.** Almost all rhythm on this site comes from flex/grid
`gap`. The few margins that exist are deliberate: `.scene > div { margin: 1rem }`,
`h1 { margin-bottom: 2rem }`, `.about-me h2 { margin-bottom: 1rem }`,
dialog `margin: auto` for centering, and `margin-top: auto` to push the dialog
footer down.

### Page-level padding

| Context | Padding |
| --- | --- |
| `nav` | `1rem 2rem 8rem 2rem` (→ `1rem 2rem 4rem 2rem` ≤480px) |
| index `main` | inline `clamp(5rem, 25vw + 1rem, 30rem)`, bottom `clamp(2rem, 5vh, 5rem)` |
| index `main` ≤768px | `5vw` inline, `5vh` bottom |
| works `.scene` | top `clamp(var(--nav-height) - 4rem, 20vh, var(--nav-height))` |
| connect `.scene` | inline `3rem`, top `clamp(var(--nav-height) - 4rem, 20vw, var(--nav-height))` |

**Any new page that sits under the fixed nav must reserve top space with that
same clamp.** `--nav-height` is `17rem`.

---

## 5. Layout

- Page root is `<section class="scene">` — one per page, owns the full-viewport
  background pattern and the nav clearance. New pages should follow this.
- Heights use `100dvh` (not `100vh`) so mobile browser chrome doesn't clip.
- Flexbox is the default. Grid is used once, for the project card grid:
  `repeat(auto-fill, minmax(15rem, 1fr))`.
- Content max-width: `.connect-container` caps at `50rem`. Use that as the
  reading-width ceiling **[convention]**.
- `overflow: hidden` on scenes that contain the 3D/animated art.

### Breakpoints

`1024px` · `900px` · `768px` · `480px`, plus a landscape guard:
`(max-width: 780px) and (orientation: landscape), (max-height: 580px) and (orientation: landscape)`.

All are `max-width` (desktop-first). Behavior at each:

- **1024** — reduce nav letter-spacing; scale index scene geometry to `0.65`
- **900** — works `.scene` stacks to `flex-direction: column`
- **768** — nav letter-spacing to `0`, nav text-centered; index padding → `5vw`;
  geometry scale `0.45`
- **480** — nav bottom padding `8rem → 4rem`; project grid becomes a column;
  `.experience` stacks vertically with `0.5rem` padding; hero stacks and centers,
  hero image hidden
- **landscape** — flatten perspective to `4rem`, hide `.pfp`

Decorative images are hidden rather than shrunk at the smallest sizes.

---

## 6. Surfaces & elevation

The site's visual signature is a **hard, offset, spread shadow** — not a soft
Material-style blur. Reuse these exact recipes:

| Purpose | Shadow |
| --- | --- |
| Standard raised card / panel | `var(--very-dark-shading) 0 0 0.25rem 0.25rem` |
| Pressed / active state | `inset 0 0 0.25rem 0.25rem var(--very-dark-shading)` |
| Small chip (type tag) | `var(--dark-shading) 0.1rem 0.1rem 0 0` |
| Close button | `var(--very-dark-shading) 0 0 0.1rem 0.1rem` |
| Modal (hard offset, no blur) | `var(--light-shading) -0.5rem 0.5rem 0 0` |
| Contact link button | `0.25rem 0.25rem 0.5rem var(--very-dark-shading)` |

**No `border-radius` anywhere.** Everything is square. Keep it square.
**No `border`** either — the dialog explicitly sets `border: none`. Separation
is done with shadow and background contrast.

### Background patterns (one per page, full-scene)

- **index** — dot grid: `radial-gradient(var(--bg-pattern-color) 15%, transparent 16%)`, `background-size: 2.5rem 2.5rem`
- **works** — 45° stripes: `repeating-linear-gradient(45deg, transparent, transparent 2rem, var(--bg-pattern-color) 2rem, var(--bg-pattern-color) 4rem)`
- **connect** — checkerboard: `repeating-conic-gradient(var(--bg-pattern-color) 0% 25%, var(--background-color) 0% 50%)`, `background-size: 4rem 4rem`

A new page should get its **own** CSS-generated pattern in this family — geometric,
low-contrast, built from `--bg-pattern-color` over `--background-color`, tile
size `2–4rem`. No raster textures.

### Heading underline motif

Used by `.about-me h2` and `#project-dialog h2`:

```css
h2::after {
    content: '';
    display: block;
    width: 12%;
    height: 0.25rem;
    background: var(--text-color);
    margin-top: 0.25rem;
}
```

Reuse verbatim for major section headings.

---

## 7. Components

### Nav (in `styles.css`, identical markup on every page)

```html
<nav>
    <h1>AMBROSE YIP</h1>
    <span>
        <a href="index.html">HOME</a> <span>/</span>
        <a class="active" href="works.html">MY WORKS</a> <span>/</span>
        <a href="connect.html">CONNECT</a>
    </span>
</nav>
```

`position: fixed`, `top: 0`, `width: 100vw`, `z-index: 5`, column flex, `gap: 0.5rem`.
Bottom fade: `linear-gradient(to bottom, var(--background-color) 0%,
var(--background-color) 75%, var(--background-color-faded) 100%)`.
`nav *` forces `color: var(--text-color)` so links don't take link blue.

Adding a page means adding its `<a>` to this list in **all** page files and
marking the current one `class="active"`.

Note: `max-height: clamp(var(--nav-height) - 4rem, 20vh, var(--nav-height))` is
valid — `clamp()`/`min()`/`max()` accept math expressions directly, no `calc()`
wrapper needed. Same pattern appears in the scene `padding-top` values.

The active-link rule is `nav span .active { color: var(--text-secondary-color) }`.
It out-specifies `nav *` (0,1,2 vs 0,0,1), so the active page does render in the
secondary text color — a subtle difference (`#353535` vs `#4e4e4e` in light).

### Card (`.project-card`)

`--card-background-color` fill, `height: 20rem`, `padding: 0.5rem`, column flex
with `justify-content: space-between`, image at `height: 75%` `object-fit: cover`,
`cursor: pointer`, `user-select: none`, standard raised shadow. Active state:
inset shadow + `filter: invert(15%)`.

### Tag / chip

Absolute-positioned `.project-type-tag` overhangs the card by `-0.5rem` on top
and left with `padding: 0.25rem 0.5rem`, uppercase, `z-index: 1`.
Inline chips (`.project-skills span`) use `--bg-pattern-color` fill,
`padding: 0 1rem`, `line-height: 2rem`, `gap: 0.25rem`.

### Modal (`<dialog id="project-dialog">`)

Native `<dialog>` + `showModal()`. `30rem × 45rem`, `inset: 0; margin: auto`,
`border: none`, hard offset shadow. `body:has(#project-dialog[open]) { overflow: hidden }`
locks scroll. `::backdrop { background: rgba(0, 0, 0, 0.5) }`.
Close button is a `<button autofocus>` inside `<form method="dialog">` — no JS
close handler needed. Footer is pushed down with `margin-top: auto`.
Disabled links: `.disabled` → `--medium-shading` bg, secondary text,
`pointer-events: none`.

> `#project-dialog` has no responsive rules; at ≤480px width or short viewports
> the fixed `30rem × 45rem` will overflow. Add `max-width`/`max-height` clamps
> when building anything similar.

### Buttons / links

Site links are plain `<a>` in `--link-color`, `--link-active-color` on `:active`.
Button-style links (`.contact-methods a`) are `display: block`, uppercase,
`text-decoration: none`, `--bg-pattern-color` fill, `padding: 1rem`, offset shadow.

> `styles.css` `a:active` has a stray `!important` outside the declaration
> (`color: var(--link-active-color);\n!important`). Harmless but malformed —
> clean it up, don't copy it.

---

## 8. Motion

Durations: `500ms` for entrances, `255ms` for interaction transitions,
`2s`/`3s`/`5s` for looping ambient animation.

Easing: `ease-out` (entrances), `ease-in-out` (idle loops), `linear` (scrolling
patterns), `cubic-bezier(0.17, 0.89, 0.32, 1.27)` — an overshoot curve — for the
`.pfp` press scale.

Named keyframes available: `fadeIn`, `pfpIdleAnimation`, `moveLines`,
`moveBuildings` (index), `tweenPatternDown` (connect).
`aboutMeSpawnAnimation` is referenced in `index.css:52` but **never defined** —
that animation is a no-op. Define it or drop it.

**Accessibility gate — required on every page.** `styles.css` already ships:

```css
@media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
}
```

Since it's global, any new animation is automatically covered — just don't
introduce motion via JS `requestAnimationFrame` without your own check.

### 3D scene conventions (index)

`perspective: var(--perspective)` (`20rem`), `perspective-origin: center top`,
`transform-style: preserve-3d`, faces rotated with `rotate3d(1, 0, 0, 75deg)`.
Face shading maps to the ramp: roof `--light-shading`, front `--medium-shading`,
side `--dark-shading`, base/shadow `--very-dark-shading`. Geometry driven by
`--house-height: 7.5rem`, `--house-width: 20rem`, `--road-width: 20rem`, scaled
by a literal factor per breakpoint (`0.65` / `0.45` / `0.4`).

---

## 9. Interaction & input

- **Touch-first, no hover states.** There is not a single `:hover` rule in the
  codebase — all feedback is on `:active`. Match this: new interactive elements
  get an `:active` state (inset shadow + `filter: invert(15%)` is the house
  pattern), and must not *depend* on hover to be usable.
- Global `touch-action: manipulation !important` in the `*` reset kills the
  300ms tap delay.
- Viewport meta locks zoom: `maximum-scale=1.0, user-scalable=no` on all pages.
- `user-select: none` on cards, chips, close button, and the connect container.
- Global `backface-visibility: hidden` in the reset.

---

## 10. Data & rendering conventions

Content lives in `/data/*.json`, is fetched with `fetch()` in an ES module, and
rendered by imperative `document.createElement` calls — no templating library,
no `innerHTML` for user-facing strings (only `innerHTML = ""` to clear).
Click handling uses **event delegation** on the container with
`e.target.closest(".project-card")`, plus `dataset.index` to map back to the record.

Dark mode in JS (needed for the per-experience background colors):

```js
const matchDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
```

Note this is evaluated once at load and does not react to live theme changes —
use `.addEventListener('change', ...)` on the MediaQueryList if that matters.

Empty/missing fields degrade gracefully to a disabled state rather than being
hidden (`sourceUrl` empty → label "private", `.disabled` class applied).

Follow the same shape for new content types: JSON in `/data`, a
`render<Thing>()` async function in `scripts/<page>Handler.js`, shared constants
in `data/definitions.js`.

---

## 11. Checklist for a new page

1. Copy the `<head>` + `<nav>` block; load `css/styles.css` **then**
   `css/<page>.css`; add the new link to the nav on all pages.
2. Wrap content in `<section class="scene">`; reserve nav space with
   `padding-top: clamp(var(--nav-height) - 4rem, 20vh, var(--nav-height))`.
3. Define page tokens in `:root` **and** in a
   `@media (prefers-color-scheme: dark)` block.
4. Give the scene its own geometric CSS background pattern from
   `--bg-pattern-color`, tile `2–4rem`.
5. Size all type with `clamp()`; use `rem` for all spacing on the
   `0.25/0.5/1/1.5/2/3` scale.
6. Square corners, no borders, `--very-dark-shading` offset shadows.
7. `:active` feedback on every interactive element; no hover dependency.
8. Verify at 1024 / 900 / 768 / 480 and in landscape on a short viewport.
9. Check both light and dark schemes.

---

## 12. Open issues (inherited, worth fixing)

| Location | Issue |
| --- | --- |
| `styles.css:66-69` | stray `!important` outside the `a:active` declaration |
| `index.css:52` | `aboutMeSpawnAnimation` referenced but never defined |
| `index.css:1-13` | `@font-face` duplicated from `styles.css` |
| `index.html:9-10` | page CSS loaded before `styles.css`, inverting token precedence |
| `works.css:59` | `filter: shadow(...)` is not a valid filter function — should be `drop-shadow()` |
| `works.css:158` | `#project-dialog` fixed at `30rem × 45rem` with no responsive fallback |
| `connect.css:26` | `perspective: 350px` — only `px` value in the codebase; perspective is set but nothing in `.contact-hero` uses 3D transforms |
| `index.css:310-312`, `connect.css:150` | empty rule / commented-out declarations left in place |
