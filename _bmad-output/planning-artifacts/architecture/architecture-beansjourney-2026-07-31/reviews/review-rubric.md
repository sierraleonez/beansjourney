# Review — ARCHITECTURE-SPINE.md (BeansJourney, 2026-07-31)

Reviewer: independent, adversarial-but-fair. Inputs: `ARCHITECTURE-SPINE.md`, `SPEC.md` (SPEC-beansjourney), `.memlog.md`.

**Verdict: pass-with-notes.** The six ADs (relational engine, polymorphic comments, polymorphic votes, shared service layer, auth boundary, dependency direction) are concrete, enforceable, and correctly resolve the spec's stated open question and the "logged-in users only" constraint. But three spec-driven success criteria (CAP-4's structured recipe fields, CAP-8's activity-history log, CAP-8's analytics surface) land nowhere in the spine — not governed, not in the map, not even in Deferred — and one AD (AD-5) asserts a client-side "create bean" route that no capability in the map actually provisions.

---

## Part A — Reconciliation against SPEC.md

### Capabilities

| Spec item | Landed? | Notes |
| --- | --- | --- |
| CAP-1 Roastery/provenance (name, contact/social, location; roastery page lists all + its beans) | Partial | `Models/Roastery`/`Models/Bean` + AD-1/paradigm govern persistence and the ERD shows `ROASTERY \|\|--o{ BEAN`. Roastery's specific fields (contact/social, location) aren't named anywhere, but that's plain-scalar-column territory appropriate to defer to schema/story level — not flagged as a defect. |
| CAP-2 Beans list & detail (9 named fields: Process, Origin, Variety, Flavour Perception/Tasting Notes, Roast Date, Roast Profile, Purpose, Purchased On, Altitude) | **Gap (minor)** | None of the 9 fields appear in the spine (not in the ERD, not in a note). Most read as safe plain-scalar columns, but "Flavour Perception/Tasting Notes" and "Roast Profile" are plausible candidates for structured/tag modeling rather than a plain string — the spine doesn't rule either way. See Finding 4. |
| CAP-3 Review threads (post review, comment, upvote, nested) | Landed | AD-2 (polymorphic comments) + AD-3 (polymorphic votes) directly govern this; correct and enforceable. |
| CAP-4 Recipe threads (brew method, tools, free-text process — **"structured method/tools fields"**) | **Gap (real)** | AD-2/AD-3 cover the comment/vote half only. Nothing governs how brew method (enum vs. lookup table) or tools (single field vs. multi-field vs. a related `Tool` entity, since the spec names three tool *categories*: machine, grinder, dripper) are modeled. The spec's own success criterion uses the word "structured," signaling this isn't a throwaway free-text field — it's a real schema decision, and it's completely absent from the spine, including from Deferred. See Finding 3. |
| CAP-5 Register & email verify (unverified accounts can't create content) | Landed | AD-5: `MustVerifyEmail` on `web` guard, `verified` middleware on mutating routes. Directly and explicitly ties back to the spec constraint. Good. |
| CAP-6 Password reset via emailed link | Landed | AD-5 + "Laravel's native auth (Fortify/Breeze conventions)" implicitly covers this (standard framework feature, no further architectural decision needed). Fine. |
| CAP-7 Profile edit, reflected across existing reviews/recipes/comments | Landed | Implied correctly by the ERD's FK-based relations (`USER \|\|--o{ REVIEW`, etc.) — display name is never denormalized onto child records, so a rename propagates automatically. Not called out explicitly, but no risk: the relational design forecloses the naive "copy the name at write time" mistake. |
| CAP-8 Admin console: **basic analytics** | **Gap** | Maps only to generic `Filament/Resources/*`. Filament analytics/dashboards are conventionally `Widgets`/dashboard `Pages`, not `Resources` — the structural seed's source tree has no `Filament/Widgets/` or dashboard folder. A builder has no spine guidance on where analytics code lives. See Finding 6. |
| CAP-8 Admin console: CRUD/moderation on beans, reviews, **and users** | Landed | `Filament/Resources/*` (Bean, Roastery, Review, Recipe, User) + AD-4 (writes through Services) + AD-5 (role gate). Good — Recipe is reasonably included even though CAP-8's success line doesn't name it, consistent with the intent's "all platform resources." |
| CAP-8 Admin console: **user activity history log** | **Missing entirely** | No table, package, service, or even a Deferred note. See Finding 1 — the most significant gap in the document. |
| CAP-8 comment moderation (implied by Deferred's "manual admin moderation" and by threads being user-generated content) | **Gap** | Source tree's Filament Resources list is "Bean, Roastery, Review, Recipe, User" — no `CommentResource`/`VoteResource`. See Finding 5. |

### Constraints

- "Backend is Laravel 13." — Landed (Stack table).
- "Client-facing area built with React via Inertia.js." — Landed (Stack table + Design Paradigm diagram).
- "Admin console built with Filament." — Landed (Stack table + Filament Resources in source tree).
- "Only registered, logged-in users may create beans, reviews, recipes, or comments; unauthenticated visitors are read-only." — Landed in AD-5's Rule, with the constraint quoted almost verbatim ("per the spec's constraint that only registered, logged-in users may create content"). This is the exact quiet-requirement class the review brief asked to check for, and the spine got it right — good, explicit, enforceable via `auth`+`verified` middleware.
  - **But**: AD-5's Rule folds "create bean" into the same gated-route list as review/recipe/comment/vote, asserting a *client-side* Inertia route for bean creation. No other part of the spine (Capability→Architecture Map, source tree, CAP-2's "list & detail" framing) acknowledges a user-facing bean-creation flow — Bean appears to be catalog data that only Admins CRUD via Filament (CAP-8). This reads as the spine parroting the spec constraint's literal wording without checking whether "create bean" is a feature that actually exists on the client side in this architecture. See Finding 2.

### Non-goals

- No in-platform e-commerce, no native mobile app, no real-time chat — none of these are built toward anywhere in the spine (correctly), and none are explicitly echoed back either. This is harmless (nothing in the stack/paradigm risks drifting toward them) but is a minor hygiene gap worth a one-line acknowledgment. Not flagged as a real finding — see notes below.

### Open Question

- "Database engine for threaded reviews/recipes... relational or NoSQL?" — Explicitly and correctly resolved by AD-1, with the resolution stated in-line ("This resolves the spec's open question: relational is sufficient at MVP scale"). Well handled.

---

## Part B — Rubric walk

**1. Fixes the real divergence points, misses none obvious.**
Mostly yes. The polymorphic comment/vote pair (AD-2/AD-3) is the single most important divergence point in this spec (two content types sharing threading + voting) and it's handled cleanly. The dual-surface (Inertia + Filament) write-path divergence is handled by AD-4/AD-6. But three spec-driven divergence points are missed: recipe method/tools structure (Finding 3), the admin activity-history mechanism (Finding 1), and the admin analytics surface (Finding 6). These are all things two independently-built units could plausibly implement in incompatible ways.

**2. Every AD's Rule is enforceable and prevents its stated divergence.**
Yes, across all six. Each Rule names concrete tables/columns/constraints/middleware/class-dependency rules that are mechanically checkable (grep for direct `Model::create` outside Services; check `parent_id`/`commentable_type` column names; check `canAccessPanel()` logic; check for `Http\Request` type-hints inside `app/Services`). No AD is vague. AD-4 in particular is well-specified — "plain arguments, no `Http\Request` dependency" gives a literal negative test.

**3. Nothing under Deferred is actually load-bearing.**
The seven explicit Deferred items (MySQL vs. Postgres, search/filter, rate limiting, deployment provider, image upload, in-app notifications, extended role system) are all legitimately optional at MVP scope and correctly deferred — none of them is silently required by a CAP's success criterion.
The bigger problem is the *inverse*: things that ARE load-bearing per a CAP's success criterion (activity-history log, recipe structured fields, comment moderation resource, analytics surface) aren't in Deferred at all — they're simply absent, which is worse than an explicit deferral because a builder has no signal that a decision is still open. See Findings 1, 3, 5, 6.

**4. Named tech is internally consistent.**
No contradictions found: PHP 8.3+ paired with "Laravel 13 minimum," Filament v5, Inertia protocol v3 with `@inertiajs/react ^3.6`, React 19.2, MySQL 8.0+. Nothing here contradicts anything else in the document.

**5. Ratifies rather than invents conventions where the spec was silent.**
Good discipline throughout — naming conventions, ID/date/error-envelope conventions, and the deployment/queue assumptions are all standard Laravel defaults, correctly tagged `[ASSUMPTION]` where the spec didn't specify (engine choice, deployment target). Nothing overreaches into invented product behavior.

**6. Capability → Architecture Map: all 8 CAPs present and correct?**
All 8 rows present. Correctness issues: CAP-2's row (`Http/Controllers/BeanController`, `Pages/Beans/*`, governed by AD-1/paradigm only) doesn't account for the "create bean" client route AD-5 implies exists (Finding 2) — if that route is real, the row is missing AD-4/AD-5 governance; if it isn't real, AD-5 is overreaching. CAP-8's row (`Filament/Resources/*`, AD-4/AD-5) is too coarse to resolve the analytics-widget and comment-moderation gaps (Findings 5, 6).

**7. Deployment/environmental envelope — decided, deferred, or flagged (not silent)?**
Not silent — good. The Structural Seed has an explicit "Deployment & environments `[ASSUMPTION]`" paragraph: single Laravel deployable, `local` (Sail/Docker) + `production` via `.env`, queue driver starts `database` (sync-safe) with a stated upgrade path to Redis, specific host explicitly left open and cross-referenced in Deferred. This satisfies the rubric's requirement that this dimension not be left totally silent.

---

## Findings (ranked)

**1. [HIGH] CAP-8's "user activity history log" has zero architectural grounding.**
The spec's CAP-8 success criterion explicitly requires an admin to "view a user's history log." Nothing in the spine — no table in the ERD, no package in Stack, no service, not even a line in Deferred — addresses how this is built: an audit-log table (e.g. `spatie/laravel-activitylog`), a UI rollup query over the user's existing Review/Recipe/Comment/Vote rows, or something that also captures admin/moderation actions and login events. This is the one CAP-8 sub-requirement most likely to be implemented two structurally incompatible ways by independent builders (a dedicated `activity_log` table vs. an ad-hoc query), and unlike every other omission in this document it isn't even acknowledged as open.

**2. [MEDIUM-HIGH] AD-5 asserts a client-side "create bean" route that no capability in the map provisions.**
AD-5's Rule lists "create bean/review/recipe/comment/vote" as the set of mutating client routes gated by `auth`+`verified`. But CAP-2 (the only capability that touches Bean on the client) is scoped to "list & detail" only, and Bean CRUD otherwise appears exclusively under CAP-8/Filament (admin-curated catalog, matching CAP-1's "provenance" framing). This looks like the spine copying the spec constraint's literal wording ("registered, logged-in users may create beans...") without checking whether user-facing bean creation is an actual feature in this architecture. As written, a builder reading AD-5 could scaffold a public "submit a bean" flow that no other part of the spec or spine intends to exist.

**3. [MEDIUM] CAP-4's "structured method/tools fields" for Recipes has no governing decision.**
The spec calls for brew method (from a set: americano, espresso, v60, french press, aeropress, tubruk, etc.) and tools (machine, grinder, dripper) to be "structured," and the success criterion repeats "structured method/tools fields." AD-2/AD-3 cover only the comment/vote half of CAP-4. Whether brew method is a DB enum vs. a lookup table, and whether tools are one field vs. several vs. a related `Tool` entity, is left completely open — not decided, not deferred, not flagged. Given the spec's explicit "structured" language, this is a real schema decision, not a story-level detail.

**4. [MEDIUM] CAP-2's nine named bean-detail fields aren't addressed even as a one-line ruling.**
Process, Origin, Variety, Flavour Perception/Tasting Notes, Roast Date, Roast Profile, Purpose, Purchased On, Altitude — none appear in the ERD or elsewhere. Most are plausible plain scalar columns and this is likely fine to leave to migration/story level, but "Flavour Perception/Tasting Notes" and "Roast Profile" are candidates for structured/tag data, and the spine is silent on which way it goes. A one-line note ("Bean detail fields are plain scalar columns on `beans`, no separate lookup/tag tables") would close this off cheaply.

**5. [MEDIUM] No Filament resource for Comment (or Vote) moderation.**
The source tree's Filament Resources are "Bean, Roastery, Review, Recipe, User" — Comment is absent. The Deferred section says "Rate limiting / spam moderation beyond manual admin moderation," which presupposes manual admin moderation of comments is in scope and already provided for — but with no `CommentResource`, there's no way for an admin to actually moderate an individual comment from the console.

**6. [LOW] "Basic analytics" maps to `Filament/Resources/*`, which is the wrong structural bucket.**
Filament dashboards/analytics are conventionally built as `Widgets` (or dashboard `Page`s), not `Resources`. The structural seed's source tree has no `Filament/Widgets/` entry, so a builder has no location to put analytics code, and the Capability Map's "Governed by: AD-4, AD-5" for CAP-8 doesn't distinguish CRUD resources from a dashboard.

**7. [LOW / nit] Non-goals aren't echoed anywhere in the spine.**
No in-platform e-commerce, no native mobile app, no real-time chat — harmless by omission since nothing in the stack pulls toward them, but a one-line acknowledgment (even just in Deferred) is cheap insurance against scope creep in later epics.

---

## Summary for the epic/story builder

Safe to build from for CAP-1, CAP-3, CAP-5, CAP-6, CAP-7, and the CRUD portions of CAP-8. Before starting CAP-2 (bean creation ambiguity), CAP-4 (recipe method/tools schema), and the analytics/history-log portions of CAP-8, get an explicit ruling — these are exactly the kind of "two teams build it two incompatible ways" risks an architecture spine exists to close off, and three of them currently have no answer anywhere in the document.
