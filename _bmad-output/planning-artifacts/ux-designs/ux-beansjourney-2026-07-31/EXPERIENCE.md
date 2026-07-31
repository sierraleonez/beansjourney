---
name: BeansJourney
status: final
sources: ['../../../specs/spec-beansjourney/SPEC.md', '../../architecture/architecture-beansjourney-2026-07-31/ARCHITECTURE-SPINE.md']
updated: 2026-07-31
---

# BeansJourney — Experience Spine

> Derived from 8 built HTML mockups (`imports/mockup/*.html`) plus SPEC.md and ARCHITECTURE-SPINE.md. The mockups use a placeholder wordmark "Grounded" — every visual/behavioral pattern below is real and extracted as-is; only the brand name maps to BeansJourney. Paired with `DESIGN.md`.

## Foundation

Responsive web only — Laravel 13 + Inertia/React client (per SPEC constraints and architecture's non-goal ruling out a native app). All 8 mockups carry identical, evidenced `@media` breakpoints at 1200px, 900px, and 600px with real layout reflow at each (two-column → single-column, 3/2/1-column grids, padding compression) — so mobile-web responsiveness down to roughly 360–400px is a confirmed foundation, not a gap. `[ASSUMPTION]` One real hole: no mockup shows a mobile navigation replacement — `.nav-links` simply `display:none` under 900px in every file with nothing shown taking its place (no hamburger icon, no drawer). A slide-in nav drawer is the reasonable default consistent with `{DESIGN.md}`'s card/modal language, but it is unverified against any mock and should be confirmed before build.

Single-tenant, no real-time features (per architecture non-goals — no chat/messaging; comments and votes are the only interaction primitive, and vote/comment updates are expected to be page-load or manual-refresh driven, not live-pushed).

## Information Architecture

| Screen | Mockup | Capability | Reached from |
|---|---|---|---|
| Register + Verify Email (2-step) | `registration-verification.html` | CAP-5 | "Join Free" nav CTA |
| Log In (overlay modal, not a page) | `login-modal.html` | CAP-5 | "Log In" nav button, or any gated action (e.g. "Log In to Review" banner) |
| Forgot / Reset Password (3-step) | `forgot-reset-password.html` | CAP-6 | "Forgot password?" link inside the login modal |
| Profile Settings | `profile-settings.html` | CAP-7 | Avatar dropdown → "Settings" |
| Roastery profile + its beans | `roastery-beans-directory.html` | CAP-1 | "Roasters" nav, or any bean's roaster link/breadcrumb |
| Bean detail | `bean-detail.html` | CAP-2 | Bean card click (from roastery page, search, or sidebar "similar beans") |
| Review thread (full page) | `review-thread.html` | CAP-3 | Bean detail's "Reviews" tab → "See all" / tab click |
| Recipe thread (full page) | `recipe-thread.html` | CAP-4 | Bean detail's "Recipes" tab → "See all" / tab click |

**Implied but not mocked:**
- **Beans discovery/search landing** — the nav's "Discover" link and every gated bean-search entry point has no dedicated mockup; `roastery-beans-directory.html` only shows one roastery's beans, not a cross-roastery catalog browse/search/filter view. `[ASSUMPTION]` gap — needed for CAP-2's "Users can browse a Beans list" but not mocked.
- **Bean submission form** — CAP-2's "a verified user can also submit a new Bean (creating its Roastery if it doesn't exist yet)" has no mockup. `[ASSUMPTION]` gap — should follow the form/input patterns in `{DESIGN.md}` Components (labeled Inter fields, caramel focus ring) and likely reuses the roastery find-or-create pattern per AD-7.
- **Filament admin console (CAP-8)** — correctly has **no** mockup. Per ARCHITECTURE-SPINE.md, Filament Resources auto-generate the admin UI from the shared Application Services/Models layer; it is out of scope for hand-authored UX mockups by design.

Bean detail (`bean-detail.html`) itself embeds condensed Reviews/Recipes tabs; `review-thread.html` and `recipe-thread.html` are the "expanded, dedicated page" versions of those same tabs (same bean header, richer sort/community sidebar, full nested comments). Both patterns should exist: an inline preview on bean detail, and a full thread page reached via tab/"see all."

## Voice and Tone

Warm, concrete, and coffee-fluent — copy speaks like a knowledgeable, friendly barista, never like generic SaaS boilerplate. Visual identity lives in `{DESIGN.md}`; this is the words.

| Do | Don't |
|---|---|
| "Join Grounded" / "The home for specialty coffee lovers" | "Sign up today!" / generic value-prop filler |
| "How did this bean taste to you? Share your brewing method, tasting notes, grind setting…" | "Leave a comment" |
| "Share how you brew this bean" / "Help the community discover the best way to enjoy [Bean Name]" | "Add content" |
| "Be specific. Include your brewing method, grind size, and water temp when possible." (community rule copy) | Vague moderation boilerplate |
| Verb-led, specific button labels: "Post Review", "Share a Recipe", "Add to My Collection", "Send Reset Link" | Generic "Submit" / "OK" |
| "Check your inbox" / "Email sent!" | "Success" |

Form hints are short and functional ("This is shown on your reviews and posts.", "Must be unique. Letters, numbers, and underscores only."). No empty-state or error-state copy is present in any of the 8 mockups (every screen renders populated, happy-path data) — see State Patterns below; extrapolated copy should match this same warm-but-plain register, not invent a different voice.

## Component Patterns

Visual specs live in `{DESIGN.md}.Components`. Behavior:

| Component | Use | Behavioral rules |
|---|---|---|
| Login modal | Any gated action, nav "Log In" | Renders as a dimmed/blurred overlay on top of the current page (not a route change) — `role="dialog" aria-modal="true"`. Closes on: backdrop click, X button, or `Escape`. Empty-field submit shakes the field red for ~1.8s then clears. Submit shows an inline loading→success micro-state (see State Patterns) before closing. |
| Register / Verify Email | "Join Free" | Two sequential steps rendered as a step-pill progress indicator (Step 1 → Step 2), not a single long form. Step 2 (verify) shows a "Resend email" link that disables + confirms "Email sent!" for 3s, then re-enables. |
| Forgot/Reset Password | "Forgot password?" in login modal | Three sequential steps (request → sent confirmation with a visible 30-min expiry badge → set new password), same step-pill pattern. Password field shows a live 4-segment strength meter plus a checklist of requirements (8+ chars / uppercase / number / special) that toggle a checkmark live as typed; confirm-password field shows a live match/no-match indicator. |
| Vote control (review/recipe/comment) | Reviews, recipes, and nested comments | **Upvote-only toggle** per ARCHITECTURE-SPINE.md AD-3 (single `votes` row per user/votable, no direction column — casting again deletes the row). One button: caramel-filled when the current user has voted, outline otherwise; count increments/decrements by exactly 1 on toggle. `[NOTE]` The mockups render a bidirectional up/down arrow pair with count-shifts-by-2 when switching direction — that specific behavior is a mockup/architecture divergence and is **not** the build target; only the visual "arrow + count" anatomy from the mockup should be kept, collapsed to a single upvote toggle. |
| Nested comment thread | Reviews, recipes | Top-level comments show a vertical connector line down to their replies. Replies (one level of nesting shown expanded) indent ~44px with a left accent border instead of a repeated connector line — i.e., the mockups render at most 2 visual indent levels before falling back to a "Load N more comments" button rather than indenting infinitely. Deeper reply chains should collapse into that same load-more pattern rather than introducing a 3rd+ visual indent tier. Comments are soft-deleted only per AD-2 — a removed comment must render as a `[deleted]` placeholder with its replies still attached, not disappear. |
| Write review / Write recipe | Bean detail, review thread, recipe thread | Review: star picker (hover-preview, click-to-set) + free-text textarea + optional brew-method/grind tag tools, single "Post Review" action. Recipe: structured fields for brew method (tag-pill single-select matching the architecture's `brew_method` enum: americano/espresso/v60/french_press/aeropress/tubruk/other) and tools used (multi-tag chips, free-form key/value per AD's JSON `tools` column) plus a numbered step-by-step brewing-process editor and a free-text tasting-notes field. Both require auth + verified email (AD-5) — unauthenticated visitors see a gating banner ("Log in to add a review") in place of the write form, per SPEC's read-only-for-guests constraint. |
| Roast slider (profile preferences) | Profile Settings | Single-handle range input over a light→dark gradient track; live-updates a text label (Light/Light-Medium/Medium/Medium-Dark/Dark) as it's dragged. Not a brew-method or flavor field — purely a personalization preference, separate from any bean's actual `roast_profile` data. |
| Flavor/brew-method chip multi-select | Profile Settings (preferences), bean filter chips | Toggle-selected chips (caramel fill when active) for multi-select; single-select tag-pills (also caramel-active) for brew method on recipes. Both patterns share the same visual chip component but differ in single- vs multi-select behavior — keep that distinction explicit in implementation. |
| Async submit buttons (all forms) | Every form across all 8 mockups | Consistent 3-state pattern: idle label → spinner + "-ing…" label (disabled) → success label + green fill for ~2s → reverts to idle. This is the canonical loading/success treatment; reuse it rather than inventing per-form variants. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Button-level loading/success | Every submit action | Spinner icon + "Verb-ing…" text, disabled, ~1-2s simulated delay in mockups → green checkmark + "Done!" label for ~2s → reverts. Directly evidenced across all 8 mockups; carry forward as-is for real async calls. |
| Inline field validation (empty required field) | Login, forgot-password, review post | Red border (`{colors.error}`) + `box-shadow` ring for ~1.8-2s, then clears. **No persistent inline error message text is shown in any mockup** — `[ASSUMPTION]` gap: real validation (e.g. server-side password-reset-link-expired, duplicate email) needs a persistent error-message pattern that isn't demonstrated; recommend a small text row under the field in `{colors.error}` using the same Inter body-sm scale, since nothing else is evidenced. |
| Cold/empty bean (zero reviews, zero recipes) | Bean detail, review/recipe thread | Not shown in any mockup — every screen renders populated data. `[ASSUMPTION]` gap: needs an empty-state treatment (e.g. "No reviews yet — be the first to try this bean" + the existing write-review CTA) consistent with the voice-and-tone table above, but no visual precedent exists to extract from. |
| Unauthenticated / gated write actions | Bean detail | **Evidenced**: a dark gradient "gate-banner" ( `{colors.brown}`→`{colors.espresso}`) reading "Log in to add a review" with a caramel CTA button replaces the write-review form for guests. Reuse this exact pattern for gated recipe/comment composition too. |
| Resend/retry cooldown | Verify email, forgot password | Evidenced: resend link/button disables and shows a confirmation ("Email sent!" / "Sent again!") for ~2-3s before re-enabling. No explicit rate-limit-exceeded state shown — `[ASSUMPTION]` gap. |
| 404 / not-found bean or roastery | Any deep link | Not shown in any mockup. `[ASSUMPTION]` gap — no visual precedent; should follow `{DESIGN.md}`'s empty-state card conventions once designed. |
| Session-expired mid-action | Any mutating action | Not shown. `[ASSUMPTION]` gap — architecture's `verified`+`auth` middleware gates every mutating route (AD-5), so a real 401/redirect-to-login treatment is needed but has no mockup precedent. |

## Interaction Primitives

- **Modal dismissal**: click backdrop, click X, or `Escape` — consistent across the login modal (the only mockup with a JS-driven overlay). Apply the same triad to any other modal introduced later (e.g. confirm-delete on the client side, if added).
- **Hover-lift cards**: clickable cards (bean cards, recipe cards, roaster-list rows) lift `translateY(-2px to -3px)` + shadow swap on hover as the "this is clickable" signal (see `{DESIGN.md}` Elevation). On touch, this has no hover equivalent — tap simply navigates; no separate touch affordance is mocked.
- **Star rating input**: hover previews the rating (fills stars up to cursor position + shows a text label like "Great"/"Outstanding"), click commits it. Used identically in bean-detail's condensed write-review and review-thread's full write-review card.
- **Tab switching** (bean detail Overview/Reviews/Recipes, review/recipe thread's Overview/Brew Guides/Reviews/Similar): single active tab, underline indicator in caramel, content swap with no URL/route change shown in the mockups — `[ASSUMPTION]` real implementation should likely back these with real navigation (query param or route) for deep-linkability, since Inertia pages are route-driven, but the mockups only demonstrate client-side tab toggling.
- **Load more** (comments, reviews): button swaps to a spinner then either loads more content or (comments) disables with "No more comments" — no infinite scroll anywhere in the mockups; pagination/load-more is the consistent pattern.
- **Sort controls** (review thread sidebar: Best/New/Top/Highest Rated/Controversial; recipe thread: a `<select>` for Most Upvoted/Newest/Most Discussed/Saved Count): single-select, one active at a time, no multi-sort.

## Accessibility Floor

Visual contrast lives in `{DESIGN.md}` (warm caramel-on-cream palette; contrast ratios were not independently verified against the mockup CSS and should be checked against WCAG 2.2 AA during build, particularly `{colors.mocha}` body text on `{colors.bg}`/`{colors.card}`).

**Evidenced in mockups:**
- Login modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and explicit `aria-label` on its close and password-toggle buttons.
- `Escape` closes the login modal; backdrop click and X button both work as alternate close paths.
- All form inputs show a visible focus ring (`0 0 0 3px rgba(196,123,58,0.12)`) consistently — a real, reusable focus-visible treatment.
- Semantic `<nav aria-label="Breadcrumb">` on breadcrumb trails (bean-detail, review-thread, recipe-thread).

**`[ASSUMPTION]` gaps to close during build** (not demonstrated in any mockup, default to WCAG 2.2 AA as the floor):
- Icon-only buttons elsewhere (nav search icon, card ellipsis/more, bookmark/share action buttons) mostly rely on `title=` tooltips rather than `aria-label` — tooltips are not a screen-reader substitute.
- No `aria-live` region is used anywhere for dynamic updates that a screen-reader user would otherwise miss: vote-count changes, "Posted!"/"Saved!" toast-style button confirmations, resend-email confirmations.
- No skip-to-content link is present in any mockup.
- Star-rating pickers (hover/click only) need an equivalent keyboard/radio-group pattern — no keyboard interaction is demonstrated in the mockup JS.
- Heading hierarchy was not audited across all 8 files; verify `h1`→`h2`→`h3` order holds once assembled into real page templates rather than standalone mockup files.

## Key Flows

### Flow 1 — First review (Dewi, new visitor, discovering specialty coffee)

1. Dewi finds a roastery page (`roastery-beans-directory.html` pattern) through a shared link and browses the beans grid, filtering by "Single Origin."
2. She clicks into a bean she likes the look of — lands on `bean-detail.html`. The specs dashboard (Process, Origin, Variety, Roast Date, Altitude, etc. — all CAP-2 fields) and flavor-intensity bars help her judge it before buying anything.
3. She scrolls to the Reviews tab and sees the gate-banner: "Log in to add a review" with a caramel CTA. She clicks "Join Free" in the nav instead.
4. Register flow (`registration-verification.html`): she fills display name, email, password (watching the live strength meter climb to "Strong"), agrees to terms, submits — button shows "Creating account…" spinner → "Account Created!" success state.
5. Step 2 auto-advances to "Check your inbox" — she opens her email, clicks the verification link.
6. **Climax:** Back on the bean page, the gate-banner is gone, replaced by the real write-review card. Dewi picks 5 stars, writes her first tasting note, and posts. Her review appears immediately at the top of the thread, attributed to her — the same page that turned her away now reflects her own words back to her.

Failure: if she mistypes her password confirmation, the field shows a red "Passwords do not match" indicator inline (evidenced in `forgot-reset-password.html`'s reset step) before she can submit.

### Flow 2 — Deciding what to buy and how to brew it (Bagas, returning user)

1. Bagas opens a roastery page he follows (`roastery-beans-directory.html`) to see what's new, using the "Trending Beans" and "Top Roasters" sidebar modules to orient himself.
2. He opens a bean he hasn't tried — `bean-detail.html`. The Specs dashboard tells him Process (Natural), Roast (Light), Purpose (Filter); the Tasting Notes flavor pills and intensity bars (Acidity 8/10, Sweetness 9/10) tell him whether it matches his palate before he spends money.
3. Satisfied, he clicks "Add to My Collection" (bean detail sidebar) to bookmark it for a future order — no in-platform checkout exists (architecture non-goal), this is purely a personal tracking action.
4. He switches to the Recipes tab / opens the full `recipe-thread.html` to find a proven brew method. He scans the recipe cards' structured brew-method tag pills and reads James Whitfield's V60 recipe — dose/ratio, grind, water temp, a 3-stage pour timeline, and the author's own tasting notes.
5. **Climax:** Bagas upvotes the recipe (single caramel-filled toggle, count ticks up by exactly one) and leaves a comment in the recipe's discussion thread asking about grind size on his own grinder. He now has both a buy decision and a brew plan, sourced entirely from the community — no separate research needed.

Failure: if the recipe's brew-method enum value doesn't match his equipment (e.g. he only owns a Moka Pot, not on the enum), he'd need to fall back to the free-text tasting notes/process fields — a real limitation of the fixed `brew_method` enum per AD's architecture note, worth flagging if this recurs.

### Flow 3 — Being part of a thread (James, established reviewer)

1. James gets notified (via email, per architecture's transactional-only notification scope — no in-app notifications) that someone replied to his top review on Ethiopia Bishan Beke.
2. He opens `review-thread.html` directly, finds his review (142 upvotes, "Top Reviewer" badge), and reads james.v60's nested reply asking about his grind size.
3. He replies inline — his reply renders nested one level under the original comment, tagged "OP" to show he's the original reviewer, per the mockup's nested-comment pattern.
4. Later, he goes to `profile-settings.html` and updates his bio ("Light roast devotee. V60 obsessive…") and adjusts his Flavor Profile chips and Roast Level slider — small personalization updates, not tied to any specific post.
5. **Climax:** Per CAP-7's success criterion, his updated display name/profile would need to reflect across his existing reviews, recipes, and comments — the mockups don't show this propagation directly (each thread mockup hardcodes usernames), so this is a build-time contract from the spec, not a visual pattern to copy. Flagging this explicitly: the UI shows *where* profile data displays (review/comment author rows) but not *how* an edit ripples through already-rendered content.

Failure: if his username change collides with an existing handle, `profile-settings.html` shows the pattern to reuse — a live success/error suffix icon on the username field (green check "available" vs. red X "too short/taken").
