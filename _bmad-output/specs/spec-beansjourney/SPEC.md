---
id: SPEC-beansjourney
companions: ['../../planning-artifacts/architecture/architecture-beansjourney-2026-07-31/ARCHITECTURE-SPINE.md', '../../planning-artifacts/ux-designs/ux-beansjourney-2026-07-31/DESIGN.md', '../../planning-artifacts/ux-designs/ux-beansjourney-2026-07-31/EXPERIENCE.md']
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# BeansJourney — Coffee Bean Review & Recipe Sharing Platform

## Why

A coffee buyer has no reliable way to judge whether a bean is worth buying before purchase, and once bought, no easy way to find the brewing method that suits it best. BeansJourney is a vision to realize: a web platform where buyers share bean reviews and the recipes they used, so others can research a bean before buying and find a proven brewing method afterward.

## Capabilities

- **CAP-1**
  - **intent:** The system stores Roastery entities (name, contact/social media, location), each of which can hold many Beans, so users can see a bean's provenance.
  - **success:** A roastery page lists its contact/social/location details and every bean it produces.
- **CAP-2**
  - **intent:** Users can browse a Beans list and open a Bean detail page showing Process, Origin, Variety, Flavour Perception/Tasting Notes, Roast Date, Roast Profile, Purpose, Purchased On, and Altitude; a registered, verified user can also submit a new Bean (creating its Roastery if it doesn't exist yet).
  - **success:** Every one of the listed fields is visible on the bean detail page for any bean in the catalog, and a verified user's submitted bean appears in the catalog immediately, attributed to them (editing an existing bean afterward is admin-only — see the architecture companion).
- **CAP-3**
  - **intent:** Registered users can post a free-text Review on a bean as a thread, and other users can comment on and upvote reviews and comments.
  - **success:** A bean page shows reviews sorted with visible upvote counts and nested comments.
- **CAP-4**
  - **intent:** Registered users can post a Recipe on a bean specifying brew method (americano, espresso, v60, french press, aeropress, tubruk, etc.), tools used (machine, grinder, dripper, etc.), and free-text process, and other users can comment on and upvote recipes and comments.
  - **success:** A bean page shows recipes sorted with visible upvote counts, structured method/tools fields, and nested comments.
- **CAP-5**
  - **intent:** Users can register and log in via email, with the account requiring email verification before it is fully active.
  - **success:** An unverified account cannot create beans, reviews, recipes, or comments; verifying the emailed link activates it.
- **CAP-6**
  - **intent:** Users can reset a forgotten password via a verification link emailed to them.
  - **success:** Submitting the emailed link lets the user set a new password and log in with it.
- **CAP-7**
  - **intent:** Logged-in users can edit their own profile (e.g. display name).
  - **success:** A profile change persists and is reflected across the user's existing reviews, recipes, and comments.
- **CAP-8**
  - **intent:** Admins can monitor and manage all platform resources through an admin console (basic analytics, beans, beans reviews, user activity history logs, user management).
  - **success:** An admin can view analytics and perform CRUD/moderation on beans, reviews, and users, and view a user's history log, from the admin console.

## Constraints

- Backend is Laravel 13.
- Client-facing area (beans list/detail, reviews, recipes, auth) is built with React via Inertia.js.
- Admin console is built with Filament.
- Only registered, logged-in users may create beans, reviews, recipes, or comments; unauthenticated visitors are read-only.

## Non-goals

- No in-platform e-commerce/checkout for buying beans directly — the site is for reviews and recipes, not a marketplace.
- No native mobile app for MVP; web only via the Laravel/Inertia client.
- No real-time chat/messaging between users; interaction is via threaded comments only.

## Success signal

A user can look up a bean, read reviews and recipes with comments/upvotes to decide whether to buy it and how to brew it, and can register (with email verification), post their own review or recipe, and see it appear immediately. An admin can view and moderate all of the above from the Filament console.

## Assumptions

- Assumed the three items in Non-goals since the user did not state them explicitly; drafted from context (a review/recipe sharing site, not stated as a marketplace, mobile app, or chat product) and not directly confirmed.
- Assumed the Success signal above since the user did not state one explicitly; drafted from Why + capabilities and not directly confirmed.

## Open Questions

- Database engine for threaded reviews/recipes (comments + upvotes): is a relational database (implied by Laravel/Eloquent) sufficient, or is NoSQL required? This is a HOW/architecture decision, best resolved in `bmad-architecture` — a relational schema with an adjacency-list or nested-set comment tree is a common, well-supported pattern for this shape at MVP scale.
