# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-beansjourney-mvp.md`
  summary: Client UI to let a review/recipe author soft-delete their own post (server routes + policies + DeletePost service exist and are tested; mockups show no delete control).
  evidence: Found by Blind Hunter — AD-4's "author may soft-delete own post" is unreachable from the client; `isAuthor` prop is unused on thread pages.
- source_spec: `_bmad-output/implementation-artifacts/spec-beansjourney-mvp.md`
  summary: Decide email-reclaim policy for soft-deleted users (trashed users keep their unique email forever; re-registration says "already taken").
  evidence: Found by both reviewers — `users` soft-deletes + unique email + `unique:users` validation that counts trashed rows.
- source_spec: `_bmad-output/implementation-artifacts/spec-beansjourney-mvp.md`
  summary: Add trashed-record filter/restore affordances in Filament tables for beans/roasteries (deleted records vanish from admin lists; restore only reachable via the edit-page URL).
  evidence: Found by Edge Case Hunter — BeansTable/RoasteriesTable default scope hides soft-deleted rows; no trashed toggle.
