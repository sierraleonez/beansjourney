---
name: 'BeansJourney Architecture Spine — Version Verification Review'
type: review
target: '../ARCHITECTURE-SPINE.md'
purpose: 'Verify every Stack table version claim was web-researched rather than asserted from training data'
reviewed: '2026-07-31'
---

# Version Verification Review — ARCHITECTURE-SPINE.md Stack Table

Mandate (verbatim): "Verify every committed decision was web-researched or reality-checked rather than asserted from training data: current library/framework versions, that each named technology still exists and fits, and — greenfield — the live defaults of any starter it leans on. Flag anything that could be out of date and wasn't confirmed against the web, the existing project, or the current starter."

All checks performed via live web search on 2026-07-31 (today).

## Claim-by-claim

### 1. PHP 8.3+ (Laravel 13 minimum)

**Verdict: VERIFIED, correct.**

Laravel 13 (released March 17, 2026) requires a minimum PHP version of **8.3** and supports through PHP 8.5. This matches the spine exactly — Laravel 13 dropped PHP 8.2 support.

Sources:
- https://laravel-news.com/laravel-13-released
- https://benjamincrozat.com/laravel-13
- https://laravel.com/docs/13.x/releases

### 2. Laravel 13

**Verdict: VERIFIED, correct and current.**

Laravel 13 released March 17, 2026; latest patch as of July 2026 is v13.21.0. Laravel 12 (Feb 2025) is the prior major, now in bug-fix-only mode until Aug 13, 2026. **Laravel 14 is not due until ~March 2027** — so Laravel 13 is genuinely the current major, not a version behind. No newer major exists that the spine should have picked instead.

Sources:
- https://laravel-news.com/laravel-13-released
- https://releasebot.io/updates/laravel
- https://endoflife.date/laravel
- https://laravel-news.com/laravel-13

### 3. Filament v5

**Verdict: VERIFIED with a caveat (LOW severity).**

Filament v5 exists, is the current major (driven by Livewire v4 support), and is confirmed compatible with Laravel 13 — latest stable v5.7.4 (as of July 29, 2026) is "fully compatible with Laravel 13." No Filament v6 beta/preview was found; v5 is the current major, so the spine picked correctly.

**Caveat not captured in the spine:** early Filament v5 releases had a real dependency conflict — `filament/filament` required `illuminate/contracts ^11.28|^12.0`, which initially clashed with Laravel 13's Illuminate packages, before being resolved in later v5.x patches. The spine says only "Filament v5" with no floor. If a dev runs `composer require filament/filament` today it'll correctly resolve to a Laravel-13-compatible v5.7.x, but the spine gives no explicit minimum patch, so this is a latent trap only if someone locks to an earlier v5 tag (e.g. via a stale lockfile or tutorial-copied version constraint).

Sources:
- https://www.answeroverflow.com/m/1483525072542236692
- https://filamentphp.com/insights/danharrin-filament-v5-blueprint
- https://packagist.org/packages/filament/filament

### 4. `inertiajs/inertia-laravel` v3

**Verdict: VERIFIED, correct and current.**

Inertia Laravel v3 is stable (past beta), with releases up to v3.1.1 (July 2, 2026). Matches spine.

Sources:
- https://github.com/inertiajs/inertia-laravel/blob/3.x/CHANGELOG.md
- https://laravel.com/blog/inertiajs-v3-is-now-in-beta
- https://inertiajs.com/docs/v3/getting-started/upgrade-guide

### 5. `@inertiajs/react` ^3.6

**Verdict: VERIFIED, correct and current.**

npm shows `@inertiajs/react` latest is **3.6.1**, published ~21 days before this review (i.e. within the ^3.6 range the spine specifies). The claim is real and current, not a hallucinated version number.

Source:
- https://www.npmjs.com/package/@inertiajs/react

### 6. React 19.2

**Verdict: VERIFIED as the correct major/minor, but flagging a real, unaddressed security issue (MEDIUM severity).**

React 19 is still the current major; no React 19.3 or React 20 stable release exists as of 2026-07-31 (only an experimental 19.3 canary dated July 29, 2026). So "19.2" as the minor line is correctly current — not out of date on the major-version axis.

**However:** React versions **19.2.0, 19.1.1, 19.1.0, and 19.0.0 are all affected by CVE-2025-55182 ("React2Shell")** — a critical (CVSS 10.0), unauthenticated remote-code-execution vulnerability in the Flight protocol used by React Server Components, actively exploited in the wild since December 2025 (coin-miner payloads, among others). Fixed in 19.0.1 / 19.1.2 / **19.2.1**. Latest patch as of this review is 19.2.8 (July 21, 2026).

The spine's Stack table lists a bare `React 19.2` with no patch floor. Taken literally that string is satisfied by installing the vulnerable 19.2.0. This looks like it was asserted from training-data familiarity with "React 19.2" as a milestone rather than checked against the current patch/security state — exactly the failure mode this review is meant to catch.

**Mitigating factor:** the CVE is specific to React Server Components (RSC)/the Flight wire protocol. This stack is Inertia.js + React as a client-rendered SPA-style adapter — it does not use RSC or the Flight protocol, so the exploit path likely doesn't apply here even at 19.2.0. That said, the spine should still pin a patched floor (e.g. `^19.2.1` or "latest 19.2.x") as a matter of hygiene and because the "was this asserted vs. verified" test is failed regardless of exploitability in this particular architecture.

**Recommendation:** change Stack table entry to `React ^19.2.1` (or "React 19.2.x, latest patch") and add a one-line note that RSC is not in use so the CVE is non-applicable, to make clear this was checked rather than skipped.

Sources:
- https://react.dev/blog/2025/10/01/react-19-2
- https://github.com/react/react/releases/tag/v19.2.8
- https://www.zscaler.com/blogs/security-research/react2shell-remote-code-execution-vulnerability-cve-2025-55182
- https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182
- https://endoflife.date/react

### 7. MySQL 8.0+

**Verdict: STALE / discrepancy (MEDIUM-HIGH severity).**

MySQL 8.0 series reached **End of Life in April 2026** (final release 8.0.46) — Oracle no longer ships security updates, bug fixes, or support for it as of this review's date (2026-07-31), i.e. it has been EOL for roughly 3 months already. Full support had already ended a year earlier (April 2025); the series has been running out its extended-support tail since then.

The spine's constraint "MySQL 8.0+" is **technically satisfiable by an EOL, unpatched release line** — a new greenfield MVP starting today should not target 8.0 at all. Oracle's own guidance and multiple independent sources agree the correct choice for a new 2026 production project is **MySQL 8.4 LTS** (supported until April 2032, drop-in successor to 8.0 with no breaking changes), with MySQL 9.x reserved for experimentation (Innovation track, ~8 months support per release, not intended for production).

This reads as a version asserted from training-data familiarity ("MySQL 8.0 is the safe Laravel default") rather than checked against the current EOL calendar — precisely the kind of staleness this review exists to catch. The AD-1 rule text itself is otherwise fine (relational-vs-NoSQL reasoning, adjacency-list modeling) — only the version floor needs correction.

**Recommendation:** change Stack table entry (and AD-1 rule, and the Structural Seed diagram's `DB[(MySQL 8.0+)]` node) from `MySQL 8.0+` to `MySQL 8.4 LTS+` (or explicitly "8.4 or 9.x").

Sources:
- https://atlasgo.io/blog/2026/05/05/mysql-8-eol
- https://www.jusdb.com/blog/mysql-80-eol-in-2026-why-upgrading-to-mysql-84-lts-is-mission-critical
- https://endoflife.date/mysql
- https://dev.mysql.com/blog-archive/introducing-mysql-innovation-and-long-term-support-lts-versions/
- https://www.percona.com/blog/mysql-8-0-end-of-life-date/

## Greenfield starter defaults

The spine does not name or lean on a specific starter kit / boilerplate (e.g. Laravel Breeze-Inertia-React starter, `laravel/react-starter-kit`, or a Filament starter); AD-5 references "Fortify/Breeze conventions" generically without pinning a starter-kit version or checking its live defaults. This is a minor gap relative to the review mandate's "greenfield — the live defaults of any starter it leans on" clause: if implementation later scaffolds from `laravel new` with the React starter kit, that starter's actual current default stack (Inertia/React versions it ships, whether it already matches ^3.6/19.2.x) has not been independently confirmed here. Recommend a follow-up check at scaffold time rather than blocking on it now, since the spine doesn't commit to a specific starter package name.

## Summary Table

| Claim | Verdict | Severity if wrong |
| --- | --- | --- |
| PHP 8.3+ | Verified, correct | — |
| Laravel 13 | Verified, correct, current (no L14 until 2027) | — |
| Filament v5 | Verified compatible w/ Laravel 13; early-v5 dependency friction noted | Low |
| inertia-laravel v3 | Verified, correct, current (v3.1.1) | — |
| @inertiajs/react ^3.6 | Verified, correct, current (3.6.1) | — |
| React 19.2 | Correct major/minor; unpinned patch technically permits CVE-2025-55182-affected 19.2.0 (RSC-specific, likely non-exploitable in this Inertia/client-React stack) | Medium |
| MySQL 8.0+ | **Stale** — 8.0 line is EOL as of April 2026; should be 8.4 LTS+ | Medium-High |
