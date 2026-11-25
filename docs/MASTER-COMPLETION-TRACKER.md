# Portfolio Labs — Master Completion Tracker

This is the source of truth for the rebuild. A feature is not marked **tested** until its real user flow has been exercised. A successful GitHub Pages deployment only confirms that the static site published.

## Status key
- **Implemented** — code exists, but the full user flow may not be verified.
- **Needs integration** — foundation exists, but it is not connected end-to-end.
- **Needs setup** — requires a dashboard setting, provider credential, or user action.
- **Not started** — no verified implementation found.
- **Tested** — verified in the deployed site with the relevant flow.

## Platform foundation

- Read-only Supabase audit script committed at `supabase/audit/portfolio-labs-audit.sql`; **not yet run against the live project**.

| Workstream | Current status | Remaining work |
|---|---|---|
| Static hosting | Implemented | Keep GitHub Pages deployment green |
| Supabase email/password auth | Implemented | Test signup, confirmation, sign-in, recovery, sign-out |
| Google sign-in | Needs setup | Configure Google OAuth provider and redirect URLs, then add UI flow |
| Profile metadata | Implemented | Test profile creation/update and error handling |
| Profile table | Needs verification | Confirm schema, policies, and profile row creation |
| Cloud workspace table | Applied (RLS verified) | Live account/data isolation tests still required |
| Shared cloud adapter | Implemented | Remaining product integrations and account-isolation tests |
| Cross-device sync | Implemented for FlowState + HabitTrack (initial pass) | Validate live sync, conflict behavior, offline recovery, deletion recovery and two-device isolation; extend to remaining products |
| Cloud file storage | Not started | Define private buckets, size/type limits, signed URLs, and RLS |
| Account data export | Partial | Include product records and supported files |
| Account deletion | Not started | Add a secure deletion flow and document retention effects |
| Security review | Audit prepared; live results pending | Run `supabase/audit/portfolio-labs-audit.sql`, review tables/policies/functions/grants, then separately audit Storage and Auth settings |
| Password recovery | Implemented | Test email delivery and callback URL in production |

## Product work

| Product | Existing foundation | Remaining work |
|---|---|---|
| FlowState | Tasks, focus timer, history, moods and calendar; cloud-sync module committed | Live cross-device testing, conflict/recovery review, reliable reminder lifecycle, settings and task/focus tests |
| HabitTrack | Habit check-ins, history and browser notifications; cloud-sync module committed | Live sync tests, reminder lifecycle, permission/error states and deletion/recovery tests |
| ReadWell Learn Suite | ReadWell study workspace and AI-helper prompt area | Confirm suite boundaries, cloud sync, revision workflows, saved history, AI provider integration if desired |
| StudyKit | Flashcards, review flow, import/export and initial per-device cloud sync | Live sync/conflict/deletion tests, robust CSV parsing, shared decks only with explicit sharing controls |
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

## Calendar and notifications

| Workstream | Current status | Remaining work |
|---|---|---|
| Calendar interface | Implemented | Deploy and test signed-in flows |
| Calendar events database | Migration applied | Calendar migration was run in the Portfolio Labs Supabase project; independently verify RLS and event CRUD |
| Standalone reminders | Migration applied | Test one-time and recurring reminder creation, completion and time-zone behavior |
| In-app notification inbox | Scheduler enabled | Cron job `portfolio-labs-process-reminders` is active; verify actual due-reminder delivery in the deployed UI |
| iCalendar import/export | Basic implementation | Test provider compatibility and time-zone edge cases |
| Browser push and email delivery | Not started | Configure server-side push/email provider and permissions |
| Outlook / Apple / Zoho sync | Not started | Register providers and implement secure OAuth/CalDAV workflows |
| Product-originated reminders | Not started | Integrate all ten products with shared event/reminder tables |

## Notifications and community

- [x] Shared in-app notification inbox UI and per-user notification table migration drafted.\n- [ ] Apply calendar migration and enable the reminder scheduler.\n- [ ] Shared notification preferences and permission explanation.
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

## Commercial readiness\n\n- [ ] Validate the first paying customer segment and willingness to pay.\n- [ ] Define free/paid packaging and verify infrastructure costs before publishing prices.\n- [ ] Select and integrate a payment provider with server-verified webhooks and subscription state.\n- [ ] Publish privacy, terms, refund/cancellation and support policies before taking payments.\n- [ ] Establish product analytics, retention measurement, support process and incident communication.\n- [ ] Prepare verified traction evidence and a product/architecture deck for investors or partners.\n- See [the commercial readiness roadmap](COMMERCIAL-READINESS-ROADMAP.md).\n\n## Non-negotiable implementation rules

1. Never put Supabase service-role keys, AI provider secrets, or private API keys in browser code.
2. Keep each user's records isolated with RLS; client-side filtering is not security.
3. Do not silently overwrite newer cloud data. Add conflict detection before multi-device editing.
4. Keep a local backup/export path for important user data.
5. Do not promise background notifications, live traffic, or AI features unless the required platform/provider actually supports them.
