---
title: 'BeansJourney MVP — full platform'
type: 'feature'
created: '2026-07-31'
status: 'ready-for-dev'
review_loop_iteration: 0
context:
  - '_bmad-output/specs/spec-beansjourney/SPEC.md'
  - '_bmad-output/planning-artifacts/architecture/architecture-beansjourney-2026-07-31/ARCHITECTURE-SPINE.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-beansjourney-2026-07-31/DESIGN.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-beansjourney-2026-07-31/EXPERIENCE.md'
---

## Intent

**Problem:** BeansJourney has a validated SPEC + architecture + UX contract but zero implementation — no Laravel app, no schema, no client, no admin.

**Approach:** Greenfield build of the full MVP in one pass: Laravel 13 + Inertia/React client + Filament admin, MySQL schema, Application Services layer, auth with email verification, bean/roastery catalog, review & recipe threads with nested comments and upvote toggles, and an admin console with activity log + basic analytics. Source contract: SPEC.md (capabilities CAP-1..8), ARCHITECTURE-SPINE.md (invariants AD-1..7), DESIGN.md/EXPERIENCE.md (client UX). Follow those companions for detail; this spec pins the decisions and the plan.

## Boundaries & Constraints

**Always:**
- Implement every invariant AD-1..AD-7 from ARCHITECTURE-SPINE.md: MySQL 8.4 single source of truth; polymorphic `comments` (commentable_type/commentable_id + nullable parent_id, soft-delete only, `[deleted]` placeholder); polymorphic `votes` (votable_type/votable_id/user_id unique, no direction column, toggle-off deletes row); all writes to governed entities via Application Services with plain args (no `Http\Request`), enforced in both Http controllers and Filament resource lifecycle hooks; FK from comments/votes RESTRICT (no cascade); auth+verified gates every mutating client route; admin-only editing of Bean/Roastery after creation (AD-7).
- `Recipe.brew_method` enum: `americano`, `espresso`, `v60`, `french_press`, `aeropress`, `tubruk`, `other`. `Recipe.tools` = JSON key/value pairs.
- `users.role` enum `user`|`admin`. Filament `canAccessPanel()` requires `role = admin`.
- Client UI follows DESIGN.md tokens (palette, Playfair Display + Inter, warm shadows) and EXPERIENCE.md behaviors: upvote-only toggle, `[deleted]` comment placeholder, gate-banner for guests on write actions, load-more pagination, sort controls, empty-state and persistent-error copy in the warm plain register. Accessibility floor WCAG 2.2 AA (focus rings, aria-labels on icon buttons, aria-live for vote/count/toast changes, skip-to-content link, keyboard-operable star picker).
- Client pages are route-driven Inertia pages (tabs backed by query params/routes for deep-linkability).
- Verification: `php artisan test` green; `npm run build` clean.

**Ask First:**
- Adding dependencies beyond: laravel/breeze (React), filament/filament, spatie media anything (no), or any package not in the stack table.
- Login modal overlay (mockup) vs Breeze's dedicated login page — modal requires a global overlay; confirm approach if it complicates the build.
- Expanding `brew_method` enum or adding `username`/collections/bookmark features — all deferred by default.

**Never:**
- No downvotes, no vote value column, no hard-delete of comments, no DB triggers for cleanup, no CASCADE FKs for comments/votes.
- No e-commerce, no messaging, no real-time push, no native app, no image upload, no full-text search.
- No direct Eloquent mutation from controllers or Filament actions for governed entities.
- No username uniqueness feature, no "Add to My Collection" bookmarks (not in any CAP).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Verified user opens bean, posts 5-star review | Review appears immediately, attributed, at top of Reviews tab | N/A |
| GUEST_WRITE | Guest on bean detail tries write-review | Dark gradient gate-banner "Log in to add a review" with CTA replaces the form; guest upvote redirects to login | Auth redirect w/ intended-URL return |
| UNVERIFIED_USER | Registered but not verified tries to post | Policy denies; treated as not-fully-active (no create) | Redirect/session notice to verify email |
| VOTE_TOGGLE | Verified user upvotes, upvotes again | First: count +1, button caramel-filled. Second: count back, outline. Exactly 1 row per user/votable | Duplicate-row race → unique constraint; service returns new state idempotently |
| DELETED_COMMENT | Author deletes comment that has replies | Comment renders `[deleted]` placeholder; replies stay attached and visible; commentable's reply tree intact | N/A |
| DUPLICATE_EMAIL | Register with existing email | Validation error under field, form keeps values | Laravel validation → Inertia shared `errors` prop |
| NEW_ROASTERY | Verified user submits bean naming a roastery that doesn't exist | Roastery find-or-create by name; bean created with created_by; both visible in catalog | Duplicate-name race → unique name constraint, retry once |
| EXPIRED_RESET | Reset link opened after 30-min expiry | Show expired/error state on reset step | Inline error row in error color, resend path offered |
| ZERO_STATE | Bean with no reviews/recipes | "No reviews yet — be the first to try this bean" empty-state card + write CTA | N/A |
| NOT_FOUND | Deep link to missing bean/roastery | 404 page styled to DESIGN.md empty-state conventions | `ModelNotFound` → 404 |

## Code Map

- `routes/web.php` -- Inertia routes for discover, roastery, bean, review-thread, recipe-thread, submission; auth routes from Breeze
- `app/Models/*.php` -- User, Roastery, Bean, Review, Recipe, Comment, Vote, ActivityLog (polymorphic morphs, parent_id self-ref, soft-deletes)
- `app/Policies/*.php` -- one per model; verified-user + owner/admin checks
- `app/Services/*.php` -- CreateBean (roastery find-or-create), CreateReview, CreateRecipe, CommentService (store/soft-delete), ToggleVote, DeletePost (actor-aware soft-delete + activity log)
- `app/Http/Controllers/*.php` -- thin Inertia controllers; Form Requests in `app/Http/Requests/`
- `app/Filament/Resources/*.php` -- Bean, Roastery, Review, Recipe, Comment, User resources; lifecycle hooks call Services per AD-4
- `app/Filament/Widgets/*.php` -- analytics widget(s): counts + recent activity
- `app/Models/ActivityLog` + writer -- appended by Services on mutations
- `database/migrations/*` -- users(+profile cols), roasteries, beans, reviews, recipes, comments, votes, activity_logs; enums; unique constraints
- `database/seeders/*` -- demo user (admin + verified member), sample roasteries/beans/reviews/recipes/comments/votes
- `resources/js/Pages/*` -- Discover, Roastery, Bean/Show (tabs), ReviewThread, RecipeThread, Auth/* (Breeze, restyled), Profile/* (settings)
- `resources/js/Components/*` -- design-system components: Button, Card, Input, Pill/Badge, Avatar, VoteButton, GateBanner, EmptyState, StarRating, SortControl, LoadMore, Modal, BrandHeader
- `tailwind.config.js` + `resources/css/*` -- DESIGN.md tokens as Tailwind theme; fonts via Google Fonts
- `vite.config.js`, `package.json`, `composer.json` -- toolchain

## Tasks & Acceptance

**Execution:**
- [ ] `composer create-project laravel/laravel` -- Laravel 13 scaffold
- [ ] Install Breeze (React) + `@inertiajs/react` + Filament v5.7.4+ -- auth scaffold, admin panel provider; add `canAccessPanel()` role gate
- [ ] Migrations + models + relations (morphs, soft-deletes, enums, unique indexes) -- AD-1/2/3/5 schema
- [ ] Services layer + ActivityLog writer -- AD-4/AD-7; plain args; actor-aware soft-delete
- [ ] Policies wired into controllers + Filament `can*` hooks -- AD-5
- [ ] Inertia pages + design-system components per DESIGN/EXPERIENCE -- client UX
- [ ] Filament resources w/ lifecycle hooks calling Services + analytics widgets -- CAP-8, AD-4
- [ ] Seeders + `php artisan test` suites for services, policies, auth gates -- verification
- [ ] `npm run build` + full pass against the 8 mockups (imports/mockup/*.html) -- fidelity check

**Acceptance Criteria:**
- Given any registered verified user, when they post a review or recipe on a bean, then it appears immediately in the catalog attributed to them, with correct upvote count, and guest/unverified users cannot create it (gate-banner / policy denial).
- Given the threads, when a user upvotes a review, recipe, or comment, then the count changes by exactly 1 and re-click reverts it (AD-3); when a comment is deleted, then it renders `[deleted]` and its replies remain.
- Given an admin, when they open the Filament panel and manage beans, reviews, users, comments, or view analytics + a user's activity history, then CRUD/moderation works and all mutations route through Services (visible in activity_log).
- Given a bean detail page, when visited, then every CAP-2 field (Process, Origin, Variety, Flavour Perception, Roast Date, Roast Profile, Purpose, Purchased On, Altitude) is displayed for catalog beans.
- Given email verification flow, when a user registers and clicks the emailed link, then their account activates; password reset works via emailed link; profile edits persist and propagate to their existing posts.

## Spec Change Log

## Design Notes

- **DeletePost service** takes (`User $actor`, model, mode) — own soft-delete for author vs admin soft-delete; both paths call the same method, only the actor differs; ActivityLog entry written for admin actions.
- **Vote toggling** reads current row by (votable, user); delete if present else create. Unique index enforces the AD-3 contract at DB level; catch duplicate-create race and re-read.
- **Comment load-more**: one level of replies indented 44px; deeper chains collapse into a "Load N more comments" button (EXPERIENCE.md), never a 3rd indent tier.
- **Review sorting**: Top (upvotes), Newest, Highest Rated. **Recipe sorting**: Most Upvoted, Newest, Most Discussed (comment count). Single-select, default Top/Most Upvoted.
- **Bean detail tabs** (Overview/Reviews/Recipes) backed by `?tab=` query param so each is deep-linkable; Reviews/Recipes tabs show condensed preview + link to full thread pages.
- **Star picker**: radio-group semantics + hover preview for keyboard parity; commits rating 1–5.
- **Auth**: Breeze routes/pages as base; restyle to DESIGN.md; login as modal overlay where feasible (Ask First if it fights the build); keep Breeze's controller logic, swap views.
- **SQLite for tests** (phpunit), MySQL 8.4 for local dev via Sail; `QUEUE_CONNECTION=queue` + Sail worker for verification emails.
- **Simplifications flagged**: password-strength meter and 3-state async buttons are mockup-fidelity flourishes — implement the accessible, simpler versions; add polish only if time permits. `ponytail:` full mockup fidelity ceiling is unreached by design.

## Verification

**Commands:**
- `php artisan test` -- expected: green (service/policy/auth suites)
- `npm run build` -- expected: clean production build
- `php artisan migrate:fresh --seed && php artisan serve` + `npm run dev` -- expected: app boots; walk CAP-1..8 flows in browser against mockups in `_bmad-output/planning-artifacts/ux-designs/ux-beansjourney-2026-07-31/imports/mockup/`

**Manual checks (if no CLI):**
- Spot-check DESIGN.md palette/typography on each client page; WCAG AA contrast on `mocha` text over `bg`/`card`.
- Admin panel: verify resource actions log to activity_log and obey admin-only role.
