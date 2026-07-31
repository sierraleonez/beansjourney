# Adversarial Review — ARCHITECTURE-SPINE.md (BeansJourney)

**Mandate:** Attack the spine as an adversary. Construct two units one level down that each obey every AD to the letter yet still build incompatibly — clashing shared-data shapes, two owners of one entity, conflicting state-mutation paths. Every pair found is a hole to close with a new or tightened AD.

**Target:** `_bmad-output/planning-artifacts/architecture/architecture-beansjourney-2026-07-31/ARCHITECTURE-SPINE.md`

**Method:** For each AD and each capability-to-AD binding, I tried to instantiate two concrete, independently-plausible implementations (as if built by two different developers/stories from the same spine, with no other coordination) and checked whether the spine's literal text disambiguates between them. Where it does not, that's a hole.

---

## Finding 1 — SEVERITY: HIGH — Bean ownership is contradictory within the spine itself (user-submitted vs. admin-curated catalog)

**AD(s) implicated:** AD-4, AD-5, and implicitly AD-1 (ERD), across CAP-1/CAP-2 vs. CAP-8.

**The contradiction:**
- AD-5's rule text explicitly lists bean creation as a *client*-mutating route: *"Every mutating client route (create bean/review/recipe/comment/vote) is gated by `auth` + `verified` middleware."* This states, as architecture fact, that logged-in regular users create beans directly from the Inertia client.
- But the spine's own ERD (`erDiagram` block, lines 100–114) has **no `USER ||--o{ BEAN}` relation at all**. Beans are only related to `ROASTERY ||--o{ BEAN : produces`. The Capability Map lists CAP-1 (Roastery/provenance) and CAP-2 (Beans list & detail) as governed only by "AD-1, paradigm" — no ownership/authorship model, no policy binding, no `AD-5` binding for CAP-1/CAP-2 at all (AD-5's "Binds" line only names CAP-5, CAP-6, CAP-8).
- The `app/` structural seed lists `Filament/Resources/` covering `Bean, Roastery, Review, Recipe, User` (line 122) — i.e., Bean is explicitly an admin-managed Filament resource — while also implying (via AD-5's prose) a client-side create-bean flow.

**Two compliant-but-incompatible units:**
- **Unit A (client bean creation, CAP-1/2):** Implements `BeanController@store` → `BeanService::createBean($userId, $data)`. Adds a migration column `beans.created_by_user_id` (nullable FK to users), publishes the bean immediately, and writes `BeanPolicy::update()` as `$user->id === $bean->created_by_user_id || $user->isAdmin()`. This literally satisfies AD-4 (writes go through a Service), AD-5 (route gated by `auth`+`verified`), and AD-6 (Controller → Service → Model).
- **Unit B (admin bean management, CAP-8):** Implements `Filament/Resources/BeanResource` treating `Bean` purely as an admin-curated catalog entity parallel to `Roastery` — no `created_by_user_id` column in its migration, no ownership concept, `BeanPolicy::update()` written as `$user->isAdmin()` only. This also satisfies AD-4, AD-5, AD-6 to the letter — nothing in the spine tells this story that beans might have a non-admin owner.
- **Collision:** Whichever migration lands second either silently drops/never-adds `created_by_user_id` (breaking Unit A's policy check with a missing-column error) or the two `BeanPolicy::update()` implementations directly contradict each other on the same class — one authorizes user-authors, the other rejects them. There is no way to tell from the spine which is "correct": both are literal readings of AD-4/AD-5/AD-6.

**Fix direction:** Add an AD (or extend AD-5) that pins Bean/Roastery as one of two explicit models: either (a) admin-only-authoritative catalog entities with no end-user write path at all (and then AD-5's "create bean" in the mutating-route list is an error to remove), or (b) user-submittable content with an explicit ownership column, a moderation/approval state, and an explicit statement of whether admins can override a user-authored bean. Also add the `USER ||--o{ BEAN}` relation to the ERD if (b) is chosen.

---

## Finding 2 — SEVERITY: HIGH — AD-4's "Services only" rule has no enforcement mechanism; Filament's default CRUD lifecycle silently violates it

**AD(s) implicated:** AD-4 (and AD-6, since the violation collapses the dependency direction).

**The gap:** AD-4 says *"neither surface mutates Eloquent models directly for these entities."* Nothing in the spine specifies **how** a Filament resource is supposed to route through a Service — Filament v5's stock `CreateRecord`/`EditRecord`/`DeleteAction` page classes call `$model::create()` / `$record->update()` / `$record->delete()` directly against Eloquent by default. To comply with AD-4, a developer must know to override specific lifecycle hooks (e.g. `handleRecordCreation()`, `handleRecordUpdate()`, or an `Action::using()` closure) to delegate to a Service instead. The spine states the *rule* but never the *mechanism*, and — critically — provides no architecture test, static-analysis rule (e.g. Deptrac/PHPArchitect), or CI gate anywhere in the document (Consistency Conventions only mentions Policy checks in `can*` hooks, not Service delegation) that would catch a resource that skips the override.

**Two compliant-but-incompatible units:**
- **Unit A (`BeanResource`, careful story):** Overrides `handleRecordUpdate()` to call `BeanService::updateBean()`, funneling admin edits through the same validation/side-effects (e.g. cache invalidation, audit log) as the client path.
- **Unit B (`RoasteryResource` or `UserResource`, scaffolded story):** Generated via `php artisan make:filament-resource` and shipped as-is with Filament's default `EditRecord`/`CreateRecord` pages — no override, so it mutates `Roastery`/`User` directly. Nothing in the spine's text was violated from this developer's point of view: they never wrote a line that "mutates Eloquent models directly" — Filament's framework code did, on their behalf, invisibly.
- **Collision:** Two admin resources built from the same spine now have divergently-enforced business rules (e.g., one funnels through a Service that fires a domain event/invalidates a cache; the other doesn't), and no reviewer using only the spine's stated rules would catch the second one as non-compliant — it "looks" identical to the first from a code-review-against-the-spine perspective.

**Fix direction:** Tighten AD-4 with a concrete, checkable mechanism: name the exact Filament hooks that must be overridden, and/or mandate an architecture test (e.g. a Pest/PHPUnit test asserting no `Filament\Resources\Pages\*` class ships without overriding create/update/delete handlers for the six shared entities).

---

## Finding 3 — SEVERITY: HIGH — DB-level FK cascade deletes are a Service-bypass loophole invisible to AD-4's own wording

**AD(s) implicated:** AD-4, AD-2, AD-3.

**The gap:** AD-4 forbids *application code* in Http Controllers / Filament Resources from mutating models directly, and AD-6 only constrains dependency direction between code layers. Neither AD says anything about **database-level cascading constraints**. A migration can add `->foreignId('parent_id')->constrained('comments')->cascadeOnDelete()` or an FK from `votes` to the polymorphic `commentable_id`-style parent — this lets the database itself delete/mutate rows with zero Service, Controller, or Policy involvement, at any call site, from either surface. Every AD in the spine is satisfied to the letter ("no code mutates models directly" — true, MySQL did it) while the actual behavioral guarantee AD-4 was meant to provide (consistent business-rule enforcement for shared-entity mutation) is completely undermined.

**Two compliant-but-incompatible units:**
- **Unit A (comments, CAP-3):** Migration adds `parent_id` with `->cascadeOnDelete()` so that deleting a top-level comment via `CommentService::deleteComment()` automatically hard-deletes all descendant replies at the DB layer — no notification, no vote-count decrement on those replies' votes, no audit trail, since the Service was never called for the children.
- **Unit B (votes, CAP-3/CAP-4):** `VoteService::deleteVote()` (called when a comment is deleted) expects to be explicitly invoked per-vote so it can decrement a denormalized `comments.vote_count` cache column. When Unit A's cascade fires, `votes` rows referencing the cascaded-away comments are cleaned up (if `votable_id` also has a cascading FK) or orphaned (if it doesn't — polymorphic FKs typically *can't* have a real DB constraint at all, since `votable_type` varies), with `VoteService` never in the loop either way.
- **Collision:** One story's migration decision (cascade vs. no cascade) silently changes the runtime guarantees the other story's Service code depends on, and both stories can point to AD-4's literal text as fully satisfied.

**Fix direction:** Add a rule to AD-4 (or a new AD) explicitly stating whether DB-level cascading FK constraints are permitted on the shared `comments`/`votes` tables, and if so, which side-effects (counters, notifications) are allowed to be lost vs. must be handled via model events/observers instead of Service calls.

---

## Finding 4 — SEVERITY: MEDIUM — AD-3 doesn't pin vote directionality/shape, and the `votes` table is physically shared across CAP-3 and CAP-4

**AD(s) implicated:** AD-3.

**The gap:** AD-3's rule — *"unique on (votable_type, votable_id, user_id)... voting again toggles/removes the vote"* — is consistent with two structurally different schemas: (a) **boolean/existence-based**: a vote row's mere existence means "upvoted"; toggle = insert/delete, no extra column needed; (b) **directional/value-based**: a `value` column (e.g. `tinyint`, `+1`/`-1`) supports upvote *and* downvote, where "voting again" on the same direction removes it but voting the opposite direction updates `value` in place rather than delete+insert. Both readings satisfy the stated unique constraint and toggle language. Since `AD-3` binds **both** CAP-3 (Review threads) and CAP-4 (Recipe threads) to the **same single `votes` table**, whichever story's migration lands first fixes the schema for both.

**Two compliant-but-incompatible units:**
- **Unit A (`ReviewService::toggleVote`)**: built against a `votes` table with no `value` column; treats existence as upvote, `delete()` as un-vote.
- **Unit B (`RecipeService`/`CommentService::vote`)**: built for a UI that shows up/down arrows (nothing in AD-3 forbids this — "votable" is generic), expects a `value tinyint not null` column and writes `updateOrCreate([...], ['value' => $direction])`.
- **Collision:** Only one migration for `votes` can exist. Whichever lands second either fails to add `value` (breaking Unit B's `updateOrCreate` with a missing-column error) or adds it as `NOT NULL` with no default (breaking Unit A's plain `insert()` calls that never set `value`).

**Fix direction:** AD-3 should explicitly state whether votes are single-direction (upvote-only, boolean/existence semantics — no `value` column) or bidirectional (with a pinned `value` column, type, and allowed range), since this is a shared physical table two independently-built capabilities must agree on before either migration is written.

---

## Finding 5 — SEVERITY: MEDIUM — AD-2 doesn't pin comment deletion semantics (soft vs. hard delete, orphan/cascade behavior) on the shared `comments` table

**AD(s) implicated:** AD-2.

**The gap:** AD-2 specifies the polymorphic shape (`commentable_type`/`commentable_id`, nullable `parent_id`) but says nothing about what happens when a comment with replies is deleted. This is a single shared table across CAP-3 and CAP-4, so — as with Finding 4 — whichever story's migration/Service convention lands first constrains the other.

**Two compliant-but-incompatible units:**
- **Unit A (Review comment moderation, CAP-3):** Implements soft delete (`SoftDeletes` trait, `deleted_at` column) so `parent_id` chains survive and replies can render under a "[comment deleted]" placeholder — a common, defensible UX choice for threaded moderation.
- **Unit B (Recipe comment moderation, CAP-4)**, built independently against the same table: implements straightforward hard delete (`$comment->delete()` really deletes the row), with no `deleted_at` column added, and its own moderation UI/Service written assuming permanently-gone rows (e.g. for GDPR-style "actually erase this" behavior it was asked to support).
- **Collision:** Both are legitimate, both satisfy AD-2's literal text (which never mentions deletion at all), but they need mutually exclusive table structures (`deleted_at` present-and-honored vs. absent) and produce different runtime behavior for the *other* capability's threads once the migration that wins is applied to the shared table.

**Fix direction:** Extend AD-2 (or add a companion rule) to pin: soft-delete vs. hard-delete for comments; what happens to `parent_id` children on delete (orphan-and-display-placeholder vs. cascade); and whether this is uniform across both Review and Recipe threads (it must be, since it's one table).

---

## Finding 6 — SEVERITY: MEDIUM — Deletion/moderation authority for Review/Recipe/Comment (author vs. admin) is unspecified, and AD-4 permits multiple divergent Service methods per entity

**AD(s) implicated:** AD-4, AD-5, Consistency Conventions (Policy row).

**The gap:** The Consistency Conventions table says *"one Policy per model, checked in both Http controllers... and Filament resource `can*` hooks"* — but never states the actual authorization rule (author-owns vs. admin-only vs. both) for destructive actions, and AD-5's mutating-route list only calls out **creation** ("create bean/review/recipe/comment/vote"), not deletion. AD-4 requires writes to go "through Application Services" but does not require a *single canonical Service method per mutation type* — a developer could add both `ReviewService::deleteReview()` (author-facing, soft delete, preserves child comments) and a separately-named `ReviewService::moderateDelete()` or an `AdminModerationService::removeReview()` (admin-facing, hard delete cascading children) and both would "go through Services," satisfying AD-4's letter.

**Two compliant-but-incompatible units:**
- **Unit A (client-side self-service delete, CAP-3):** `ReviewPolicy::delete()` → author-or-admin; `ReviewService::deleteReview()` soft-deletes, leaving `commentable_id` intact so existing comments still render against a "[review removed]" placeholder.
- **Unit B (Filament moderation, CAP-8):** Builds a separate `ModerationService::purgeReview()` for admin "remove spam" actions that hard-deletes the review row outright (reasoning: admin removal should be permanent, unlike self-service delete) — orphaning any comments/votes that pointed at it (`commentable_id` now dangling) since AD-2/AD-3 never said what happens to polymorphic children when their parent is gone.
- **Collision:** Same entity, two different deletion semantics reachable from two different surfaces, both "through a Service" per AD-4, with no spine text forcing them to be the same method or to agree on child-row handling.

**Fix direction:** Either require exactly one Service method per mutation-type-per-entity (no parallel "admin variant" methods), or explicitly define both an author-delete and an admin-moderation-delete path with pinned, differing semantics — and state what happens to polymorphic `comments`/`votes` children in each case.

---

## Finding 7 — SEVERITY: LOW/MEDIUM — Roastery creation ownership is unaddressed: implicit user-side `firstOrCreate` vs. admin-curated taxonomy

**AD(s) implicated:** AD-4, AD-1 (ERD), Capability Map.

**The gap:** The ERD has `ROASTERY ||--o{ BEAN : produces`, and Roastery only appears in the Capability Map under CAP-8 (admin, via `Filament/Resources`) — implying Roastery is an admin-curated taxonomy. But nothing prevents (or forbids) the bean-creation flow (CAP-1/2, presumably user-facing per Finding 1) from letting a user type a free-text roastery name that the Service resolves with `Roastery::firstOrCreate(['name' => $input])`.

**Two compliant-but-incompatible units:**
- **Unit A (`BeanService::createBean`)**: silently `firstOrCreate`s a `Roastery` row from user-typed text, so regular users indirectly create Roastery records — never routed through any admin review, despite Roastery having no stated user-facing capability at all.
- **Unit B (`Filament/RoasteryResource`)**: built assuming Roastery is a strictly admin-managed, deduplicated, admin-approved catalog (e.g. with a unique-name constraint and manual merge tooling for near-duplicate entries typed inconsistently by admins themselves) — never anticipating unreviewed inbound rows from end users, and its dedup/merge admin workflow now has to contend with an uncontrolled stream of near-duplicate, unapproved roastery names it wasn't designed to absorb.
- **Collision:** Both are literal-compliant with AD-4 (writes go through a Service either way) and AD-1/AD-6, but they encode opposite assumptions about who is allowed to originate a `Roastery` row, producing duplicate/dirty data neither story alone would produce.

**Fix direction:** State explicitly in the Capability Map / AD-4 whether Roastery is create-only-by-admin (client bean-creation flow must select from an existing list, with an explicit "request new roastery" moderation step if needed) or open to indirect user-side creation (in which case the ERD's admin-only implication should be corrected and a dedup rule specified).

---

## Finding 8 — SEVERITY: LOW — "verified" middleware scope: does it cover update/delete/toggle routes, or only the "create X" routes literally named?

**AD(s) implicated:** AD-5.

**The gap:** AD-5's rule literally scopes the `verified` requirement to "create bean/review/recipe/comment/vote" — an enumerated list of *creation* actions. It does not explicitly say whether update/delete routes, or a vote *toggle-off* (which is a DELETE under AD-3's "toggles/removes" semantics), also require `verified`.

**Two compliant-but-incompatible units:**
- **Unit A (`CommentController`)**: reads AD-5's general framing ("Every mutating client route... is gated by `auth` + `verified`") as the operative rule and applies `verified` middleware to comment update/delete routes too.
- **Unit B (`VoteController`)**: reads AD-5's parenthetical list literally — only *creating* a vote needs `verified`; treats the toggle-off (removal) as a lightweight, already-authenticated-is-enough action and omits `verified` from that route, reasoning it's not "content creation."
- **Collision:** Inconsistent security posture across two mutation surfaces built from the same sentence — an unverified user's capabilities differ unpredictably depending on which story built which controller, undermining the spec's stated constraint that only verified users may act.

**Fix direction:** Rewrite AD-5's rule to state the middleware requirement as a blanket rule for *all* mutating routes on the six shared entities (create/update/delete/toggle alike), removing the ambiguous parenthetical enumeration, or explicitly carve out which mutation verbs are exempt.

---

## Summary Table

| # | Severity | Pair | AD to close it |
| --- | --- | --- | --- |
| 1 | HIGH | Client-created Bean (user-owned) vs. Filament-only Bean (admin-owned catalog) — ERD vs. AD-5 prose contradiction | AD-5 / new AD, + ERD fix |
| 2 | HIGH | Filament resource with overridden Service-delegating hooks vs. scaffolded default CRUD that silently mutates models | AD-4 (add mechanism + gate) |
| 3 | HIGH | Cascading DB FK on comments/votes vs. Service-mediated cleanup with counters/notifications | AD-4 / new AD on DB constraints |
| 4 | MEDIUM | Boolean-existence votes schema vs. directional `value`-column votes schema, same shared table | AD-3 |
| 5 | MEDIUM | Soft-deleted comments (Review) vs. hard-deleted comments (Recipe), same shared table | AD-2 |
| 6 | MEDIUM | Author self-delete Service vs. separate admin-moderation-delete Service, divergent cascade semantics | AD-4 / AD-5 |
| 7 | LOW/MEDIUM | User-side `firstOrCreate` Roastery vs. admin-curated-only Roastery catalog | AD-4 / Capability Map |
| 8 | LOW | `verified` middleware on update/delete/toggle routes vs. create-only per literal enumeration | AD-5 |
