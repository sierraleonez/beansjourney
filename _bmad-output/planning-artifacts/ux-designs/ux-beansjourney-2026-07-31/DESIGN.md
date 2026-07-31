---
name: BeansJourney
description: Warm, editorial specialty-coffee review & recipe platform — Playfair Display serif headings over an Inter sans-serif UI, a caramel-on-cream palette, and warm-tinted (not gray) elevation. Extracted from 8 built HTML mockups (brand wordmark "Grounded" in the mockups stands in for BeansJourney).
sources: ['../../../specs/spec-beansjourney/SPEC.md', '../../architecture/architecture-beansjourney-2026-07-31/ARCHITECTURE-SPINE.md']
status: final
updated: 2026-07-31
colors:
  bg: '#FAF7F2'
  card: '#F0E8DC'
  espresso: '#3B1F0E'
  brown: '#5C3317'
  caramel: '#C47B3A'
  caramel-hover: '#B36B2C'
  mocha: '#7A6152'
  border: '#E8DDD4'
  white: '#FFFFFF'
  shadow: 'rgba(59,31,14,0.08)'
  shadow-hover: 'rgba(59,31,14,0.15)'
  success: '#3A7A3A'
  success-bg: '#EEF7EE'
  success-border: '#C3E0C3'
  error: '#C0392B'
  error-alt: '#DC2626'
  roast-light-bg: '#FEF5E7'
  roast-light-fg: '#C47B3A'
  roast-light-border: '#F5DEB3'
  roast-medium-bg: '#F9EDE0'
  roast-medium-fg: '#8B4513'
  roast-medium-border: '#DEB887'
  roast-dark-bg: '#F0E6E0'
  roast-dark-fg: '#5C3317'
  roast-dark-border: '#C4A882'
typography:
  display:
    fontFamily: 'Playfair Display'
    fontSize: 42px
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.5px
  display-sm:
    fontFamily: 'Playfair Display'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  heading:
    fontFamily: 'Playfair Display'
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.2'
  heading-sm:
    fontFamily: 'Playfair Display'
    fontSize: 17px
    fontWeight: '700'
    lineHeight: '1.3'
  body:
    fontFamily: 'Inter'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: 'Inter'
    fontSize: 12.5px
    fontWeight: '500'
    lineHeight: '1.5'
  label:
    fontFamily: 'Inter'
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.6px
  button:
    fontFamily: 'Inter'
    fontSize: 13.5px
    fontWeight: '600'
    lineHeight: '1.4'
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '7': 28px
  '8': 32px
  '10': 40px
  '12': 48px
  '14': 56px
  '15': 60px
  gutter-desktop: 48px
  gutter-tablet: 28px
  gutter-mobile: 16px
  card-padding: 24px
components:
  button-primary:
    background: '{colors.caramel}'
    background-hover: '{colors.caramel-hover}'
    foreground: '{colors.white}'
    radius: '{rounded.md}'
    shadow-hover: '0 4px 12px rgba(196,123,58,0.3)'
  button-ghost:
    background: 'transparent'
    border: '1.5px solid {colors.border}'
    foreground: '{colors.espresso}'
    radius: '{rounded.md}'
    hover-border: '{colors.brown}'
    hover-background: '{colors.card}'
  button-icon:
    size: 38px
    radius: '{rounded.md}'
    foreground: '{colors.mocha}'
    hover-foreground: '{colors.brown}'
  card:
    background: '{colors.white}'
    border: '1px solid {colors.border}'
    radius: '{rounded.xl}'
    shadow: '0 2px 16px {colors.shadow}'
    shadow-hover: '0 10px 28px {colors.shadow-hover}'
  card-cta-dark:
    background: 'linear-gradient(135deg, {colors.brown} 0%, {colors.espresso} 100%)'
    foreground: '{colors.bg}'
    radius: '{rounded.lg}'
  modal:
    background: '{colors.white}'
    radius: '{rounded.2xl}'
    shadow: '0 24px 64px rgba(59,31,14,0.22), 0 8px 24px rgba(59,31,14,0.12), 0 0 0 1px rgba(59,31,14,0.06)'
    padding: '44px'
  input:
    background: '{colors.bg}'
    background-focus: '{colors.white}'
    border: '1.5px solid {colors.border}'
    border-focus: '{colors.caramel}'
    radius: '{rounded.md}'
    focus-ring: '0 0 0 3px rgba(196,123,58,0.12)'
  pill-badge:
    radius: '{rounded.full}'
    padding: '4px 12px'
    fontSize: 12px
    fontWeight: '600'
  avatar:
    radius: '{rounded.full}'
    border: '2px solid {colors.border}'
    fallback-background: '{colors.card}'
    fallback-font: 'Playfair Display'
  vote-control:
    idle-border: '1.5px solid {colors.border}'
    idle-foreground: '{colors.mocha}'
    active-background: 'rgba(196,123,58,0.12)'
    active-border: '{colors.caramel}'
    active-foreground: '{colors.caramel}'
    radius: '{rounded.sm}'
---

## Brand & Style

BeansJourney is a warm, editorial home for specialty-coffee reviewing — closer in spirit to a well-designed coffee-table magazine than a SaaS dashboard. The brand pairs a Playfair Display serif for anything that carries weight (headings, prices, ratings, the wordmark) with a clean Inter sans-serif for everything functional (forms, nav, body copy). The palette reads as "warm cream and espresso," never neutral gray — every shadow, border, and secondary text color is tinted brown rather than true black or gray, which is what gives the surface its coffeehouse warmth even in dense data views (spec grids, review threads).

The posture is confident-but-unfussy: generous white(cream)space, one accent color (caramel) used consistently for anything actionable, and content — bean photography, flavor notes, tasting language — allowed to be the most visually rich element on the page. Decoration is restrained to a few recurring devices: a circular coffee-cup logo mark, warm gradient CTA cards, and pill-shaped tags for flavor/roast/status metadata.

## Colors

- **`{colors.bg}` (#FAF7F2)** — the base page background everywhere. Warm off-white, never pure white; it's what makes the whole product feel like paper/cream rather than a screen.
- **`{colors.card}` (#F0E8DC)** — a slightly deeper cream used for input fills, tag/chip backgrounds, and subtle section fills (e.g. specs dashboard). Distinguishes "recessed" content from `{colors.white}` "raised" cards.
- **`{colors.white}` (#FFFFFF)** — reserved for raised surfaces: cards, modals, focused inputs. Never the page background.
- **`{colors.espresso}` (#3B1F0E)** — primary ink. All headings and high-emphasis body text.
- **`{colors.brown}` (#5C3317)** — secondary ink and the logo mark's circle fill; also the base of the dark gradient used on CTA/upsell cards (`linear-gradient(135deg, {colors.brown}, {colors.espresso})`).
- **`{colors.mocha}` (#7A6152)** — muted text: meta info, timestamps, placeholder copy, nav links at rest. Never used for primary actions or headings.
- **`{colors.caramel}` (#C47B3A)** — the single brand/action color. Every primary button, active nav/tab state, focus ring, link, upvote-active state, and price/rating accent uses caramel. Darkens to `#B36B2C` on hover/press. This is the only color that means "you can act here" — do not spend it on decoration.
- **`{colors.border}` (#E8DDD4)** — all hairline borders and dividers.
- **Shadow tints** (`{colors.shadow}` / `{colors.shadow-hover}`) are warm-brown rgba, not neutral black — this is deliberate and should not be swapped for a generic gray shadow.
- **Semantic accents** are used sparingly and only where the mockups show them: `{colors.success}` green for verified badges, save/post confirmations, and password-strength "strong"; `{colors.error}` red for validation failure and destructive actions/report. Roast-tier tints (`roast-light/medium/dark`) exist only to color-code the three roast levels on pills — not a general-purpose warning/info palette.

## Typography

Two families, strict role split:

- **Playfair Display (serif)** — the "this matters" voice. Logo wordmark, page/section headings (`h1`/`h2`), bean names, prices, star ratings, stat numbers (follower counts, review counts), and single-letter avatar fallbacks. Sizes observed range from 42px (bean detail hero name) down to 16-17px (sidebar card titles) — always weight 700, tight line-height (1.15–1.3).
- **Inter (sans)** — everything else: nav, buttons, form fields, body copy, meta text, badges. Weight 400 for body, 500–600 for labels/buttons, 700 reserved for emphasis (usernames, bold stat labels).

Small uppercase Inter labels (11–12px, weight 600–700, letter-spacing 0.3–1px) are the recurring "eyebrow" pattern for section labels like ORIGIN, ROAST DATE, RECOMMENDED BREW METHODS.

## Layout & Spacing

Spacing is rooted in a 4px scale (`{spacing.1}`…`{spacing.15}`), with the most common increments being 8/12/16/20/24/32/48px for internal card padding and gaps. Page content sits inside a `max-width: 1728px` centered container.

- **Desktop (≥1200px):** gutter `{spacing.gutter-desktop}` (48px), two-column layouts (`1fr 320px` or `1fr 300px`) pairing a main content column with a fixed-width sidebar (roastery beans, bean detail, review/recipe threads all follow this pattern).
- **Tablet (900–1200px):** gutter narrows to `{spacing.gutter-tablet}` (28px), sidebar width shrinks (280px/260px) but stays a second column; multi-column grids (3→2 beans-per-row) collapse by one column.
- **≤900px:** sidebar drops below main content (single column), nav text links (`.nav-links`) are hidden entirely (see Accessibility Floor / gaps — no drawer replacement is mocked).
- **≤600px (mobile):** gutter `{spacing.gutter-mobile}` (16px), card padding compresses (28–32px → 16–20px), grids go to 1 column, hero/display type steps down one size (e.g. 42px → 26px bean name).

These breakpoints (1200 / 900 / 600px) recur identically across all 8 mockups — this is a real, evidenced responsive system, not a gap.

## Elevation & Depth

A consistent, warm-tinted 2-tier shadow language is used throughout (not skipped — this is a deliberate part of the brand):

- **Resting card shadow:** `0 2px 12–16px {colors.shadow}` — every card, sidebar module, and settings panel at rest.
- **Hover/elevated shadow:** `0 4–10px 24–28px {colors.shadow-hover}` — clickable cards (bean cards, recipe cards) lift `translateY(-2px to -3px)` and swap to this shadow on hover, the universal "this is clickable" signal.
- **Modal shadow:** a heavier 3-layer stack — `0 24px 64px rgba(59,31,14,0.22), 0 8px 24px rgba(59,31,14,0.12), 0 0 0 1px rgba(59,31,14,0.06)` — reserved for true overlays (login modal, register/verify, forgot/reset steps).

Shadows are always brown-tinted rgba against `{colors.espresso}`, never neutral gray/black — swapping to a generic shadow color would visibly break the brand's warmth.

## Shapes

Radius scales with a surface's "weight": small interactive controls use `{rounded.sm}`–`{rounded.md}` (6–8px: inputs, small buttons, spec-item tiles), cards use `{rounded.lg}`–`{rounded.xl}` (12–16px), modals use `{rounded.2xl}` (20px) — the largest radius in the system, reserved for the highest-emphasis overlay surface. Pills, chips, badges, and tags always use `{rounded.full}` regardless of size (flavor tags, roast badges, filter chips, step-progress pills). Avatars are always fully circular.

## Components

- **Button — primary (`btn-cta` / `btn-submit` / `btn-login`)**: solid `{colors.caramel}` fill, white text, `{rounded.md}` corners. Hover darkens to `{colors.caramel-hover}` and adds a lift shadow + `translateY(-1px)`. Reserved for the single primary action per view/card (Create Account, Log In, Post Review, Add to Collection).
- **Button — ghost (`btn-ghost`)**: transparent fill, 1.5px `{colors.border}`, `{colors.espresso}` text. Hover: border and text shift to `{colors.brown}`, background fills `{colors.card}`. Used for secondary actions (Log In in nav when logged out, Discard, Back to Log In).
- **Button — icon (`btn-icon`)**: 38×38px transparent square/circle, `{colors.mocha}` icon, hover fills `{colors.card}` and darkens icon to `{colors.brown}`. Used for search, close, and utility actions.
- **Card**: white fill, 1px border, `{rounded.xl}`, resting shadow. The universal content container — bean cards, roastery card, review/recipe cards, sidebar modules, settings sections all share this exact anatomy.
- **Card — dark CTA/upsell**: `linear-gradient(135deg, {colors.brown}, {colors.espresso})` fill, cream text, caramel button. Recurring "sign up / track your collection" nudge in sidebars, transparent border.
- **Modal**: white, `{rounded.2xl}`, 3-layer shadow, 44px padding. Anatomy top-to-bottom: brand lockup (circular brown icon + Playfair wordmark) → Playfair `h1` heading (26–30px) → mocha subtext → optional Google SSO button + "or" divider → Inter form fields → full-width primary button → mocha footer link.
- **Input**: `{colors.bg}` fill (turns `{colors.white}` on focus), 1.5px `{colors.border}`, `{rounded.md}`, caramel focus ring `0 0 0 3px rgba(196,123,58,0.12)`. Password fields carry a right-aligned eye-toggle icon button.
- **Pill / badge**: `{rounded.full}`, small (11–12px) semi-bold text. Variants by color: caramel-tinted (active/brand), green (verified/success), roast-tier tri-color, neutral card-tint (flavor tags, generic metadata).
- **Avatar**: circular, 1.5–3px border in `{colors.border}`; falls back to a Playfair-serif single initial on `{colors.card}` background when no photo is available.
- **Vote control**: a compact vertical stack — arrow button, bold count, arrow button — 32×28px buttons, `{rounded.sm}`, idle state is `{colors.mocha}` outline, active state fills `rgba(196,123,58,0.12)` with a caramel border/icon. See EXPERIENCE.md Component Patterns for the upvote-only behavioral contract (the mockups render this control bidirectionally; the build target is upvote-toggle-only per architecture).

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use Playfair Display only for headings, prices, ratings, stat numbers, and avatar-fallback initials | Set body copy, buttons, or form labels in Playfair Display |
| Reserve `{colors.caramel}` for actionable/active elements only (buttons, active states, focus rings, links) | Use caramel as a decorative accent or background wash |
| Keep shadows warm-tinted (`rgba(59,31,14,…)`) | Use neutral gray/black box-shadows anywhere |
| Use `{rounded.full}` for every pill/chip/badge/avatar regardless of size | Mix square and pill shapes for the same metadata-tag role |
| Lift clickable cards on hover (`translateY` + shadow swap) as the universal affordance | Add hover-only affordances with no visible focus/tap equivalent for touch or keyboard |
| Keep the two-column `main + sidebar` layout for content-heavy pages (bean detail, threads, roastery) | Introduce a third column or nested sidebars |
