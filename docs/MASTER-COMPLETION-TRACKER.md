# Portfolio Labs — Master Completion Tracker

This is the source of truth for the rebuild. A feature is not marked **tested** until its real user flow has been exercised. A successful GitHub Pages deployment only confirms that the static site published.

## Status key
- **Implemented** — code exists, but the full user flow may not be verified.
- **Needs integration** — foundation exists, but it is not connected end-to-end.
- **Needs setup** — requires a dashboard setting, provider credential, or user action.
- **Not started** — no verified implementation found.
- **Tested** — verified in the deployed site with the relevant flow.

## Platform foundation

| Workstream | Current status | Remaining work |
|---|---|---|
| Static hosting | Implemented | Keep GitHub Pages deployment green |
| Supabase email/password auth | Implemented | Test signup, confirmation, sign-in, recovery, sign-out |
| Google sign-in | Needs setup | Configure Google OAuth provider and redirect URLs, then add UI flow |
| Profile metadata | Implemented | Test profile creation/update and error handling |
| Profile table | Needs verification | Confirm schema, policies, and profile row creation |
| Cloud workspace table | Needs setup | Apply `supabase/migrations/20261125000200_workspace_records.sql` |
| Shared cloud adapter | Implemented | Integrate with each product and test account isolation |
| Cross-device sync | Not started | Add load/save, conflict handling, offline queue, and multi-device tests |
| Cloud file storage | Not started | Define private buckets, size/type limits, signed URLs, and RLS |
| Account data export | Partial | Include product records and supported files |
| Account deletion | Not started | Add a secure deletion flow and document retention effects |
| Security review | Needs verification | Audit all tables, storage policies, input validation, and public configuration |
| Password recovery | Implemented | Test email delivery and callback URL in production |

## Product work

| Product | Existing foundation | Remaining work |
|---|---|---|
| FlowState | Tasks, focus timer, history and local storage | Cloud sync, reliable reminders, settings, full task/focus tests |
| HabitTrack | Habit check-ins, history and browser notifications | Cloud sync, reminder lifecycle, permission/error states, tests |
| ReadWell Learn Suite | ReadWell study workspace and AI-helper prompt area | Confirm suite boundaries, cloud sync, revision workflows, saved history, AI provider integration if desired |
| StudyKit | Flashcards, review flow, import/export and local storage | Cloud sync, robust CSV parsing, shared decks only with explicit sharing controls |
| PromptLab | Prompt builder, templates and saved local prompts | Cloud sync, version history, AI provider integration (not just prompt drafting) |
| DataLens | CSV/JSON dataset exploration and analysis | Test larger files, Excel import, saved reports/analyses, cloud persistence |
| BudgetBoard | Transactions, budgets, goals, debts, recurring rules and reports | Cloud sync, recurring-rule edge cases, import/export and calculation tests |
| SellSmart NG | Business profile, products, customers, invoices, payments and reports | Cloud records, logo storage, invoice PDF tests, backup/restore and tax/receipt validation |
| CV Studio | CV editor, templates, local versions, import/export and print | Cloud drafts/versions, PDF layout tests, document management |
| RoboRoute | Algorithm visualizer and Lagos-focused map routing | Validate geocoding edge cases, routing failures, saved routes, mobile map tests |

## Shared experience

- [x] Shared footer and return-to-home links added to product pages.
- [x] Shared typography, form, card and spacing stylesheet added.
- [x] Shared dark/light/system theme reader added.
- [ ] Verify theme consistency on every product and on mobile.
- [ ] Persist preferences to the signed-in account across devices.
- [ ] Add language preference (English/Pidgin) only after all interface strings are centralised.
- [ ] Add currency preference (NGN first; other currencies only where calculations support it).
- [ ] Add accessible reduced-motion behavior across all products.
- [ ] Standardise loading, empty, success and error states.
- [ ] Verify side navigation, mobile navigation, keyboard access and footer links.

## Notifications and community

- [ ] Shared notification preferences and permission explanation.
- [ ] Reliable reminders that work within browser/PWA limits; explain that browsers may suspend background work.
- [ ] Sharing with explicit owner-controlled access and revocation.
- [ ] Community/friend challenges only after privacy, moderation and reporting controls exist.
- [ ] Optional focus/distraction controls only where supported by the browser and user consent.

## Quality and release

- [ ] Test every product in a current mobile browser and desktop browser.
- [ ] Test signed-out, signed-in, expired-session, offline and failed-network states.
- [ ] Test two separate accounts to verify no cross-account data leakage.
- [ ] Test install/PWA cache updates and offline fallback.
- [ ] Run JavaScript syntax checks and review console/network errors.
- [ ] Verify every external API dependency, usage limits and fallback behavior.
- [ ] Update README with accurate storage and feature status after each release.
- [ ] Mark a feature **Tested** only after the test is actually completed.

## Non-negotiable implementation rules

1. Never put Supabase service-role keys, AI provider secrets, or private API keys in browser code.
2. Keep each user's records isolated with RLS; client-side filtering is not security.
3. Do not silently overwrite newer cloud data. Add conflict detection before multi-device editing.
4. Keep a local backup/export path for important user data.
5. Do not promise background notifications, live traffic, or AI features unless the required platform/provider actually supports them.
