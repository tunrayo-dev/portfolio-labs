# Portfolio Labs — Commercial Readiness Roadmap

**Purpose:** turn the current product suite into a dependable service that users can trust, subscribe to and recommend. This is a release plan, not a claim that unfinished capabilities are already live.

## Current position

Portfolio Labs is publicly hosted on GitHub Pages and can be installed as a Progressive Web App on supported browsers. The catalogue contains seven workspaces built from ten product modules. There is a Supabase authentication foundation, a shared calendar/reminder interface, local-first product data and a shared workspace adapter.

The platform is **not yet ready to take public payments as a fully managed SaaS**. A successful static-site deployment proves that files were published; it does not prove product workflows, data security, cross-device sync, billing or support are production-ready.

## Release gates — in priority order

### Gate 1 — Trust, data safety and account correctness

- [ ] Apply and verify the workspace-records database migration in the Portfolio Labs Supabase project.
- [ ] Review every table's Row Level Security policies, grants, indexes and ownership rules.
- [ ] Test signup, email confirmation, sign-in, sign-out, password recovery and expired sessions in production.
- [ ] Integrate each product with the shared cloud adapter; do not claim sync until each product passes read/write tests.
- [ ] Add conflict detection so an older device cannot silently overwrite newer cloud data.
- [ ] Add offline queue/retry behavior and clear sync status (local, syncing, synced, needs attention).
- [ ] Test two independent accounts and verify that neither can read or change the other's records.
- [ ] Complete account export and secure account deletion, including documented effects on files and backups.
- [ ] Keep local export/restore available until cloud sync is proven reliable.

**Release rule:** never expose private keys in browser code. Use least-privilege policies and server-side functions for privileged operations.

### Gate 2 — Product quality and consistency

- [ ] Give every workspace the same quality baseline: navigation, spacing, typography, forms, cards, focus states, responsive behavior and footer.
- [ ] Preserve each product's visual identity while using shared design tokens and reusable patterns.
- [ ] Standardise loading, empty, success, warning, validation and error states.
- [ ] Add clear onboarding and useful sample/demo data that can be removed safely.
- [ ] Add undo or confirmation for destructive actions; avoid silent data loss.
- [ ] Validate imports, exports, file sizes, malformed input and duplicate records.
- [ ] Test invoices, CV exports, charts, calculations, timers, route failures and restore flows with realistic sample data.
- [ ] Add keyboard navigation, visible focus, semantic labels, contrast checks and reduced-motion support.
- [ ] Test current desktop and mobile browsers, narrow screens, offline mode and slow/failed networks.
- [ ] Run automated JavaScript syntax checks and smoke tests on every release; monitor console and network failures.

### Gate 3 — Reliable shared services

- [ ] Finish calendar migration, RLS verification and reminder processor tests.
- [ ] Integrate product-originated reminders with the shared calendar/notification model.
- [ ] Add user-controlled notification preferences and explain browser permission limits.
- [ ] Configure email and web-push delivery through a server-side provider before advertising them.
- [ ] Add provider OAuth only for integrations with a clear user need and a secure token-storage design.
- [ ] Define file storage buckets, private access, file limits, signed URLs and retention rules before storing user documents in the cloud.
- [ ] Document third-party service dependencies, rate limits, outages and fallback behavior.

### Gate 4 — A credible paid product

- [ ] Interview target users and identify the highest-value workflows they would pay to solve.
- [ ] Choose a narrow initial paid audience instead of charging for every feature at once.
- [ ] Define a free plan and paid plan around measurable value and sustainable operating costs.
- [ ] Validate pricing with users before publishing prices.
- [ ] Select a payment provider that supports the target countries, currencies, recurring billing, refunds and webhook verification.
- [ ] Implement billing on a trusted server-side endpoint; never unlock paid features based only on a browser flag or client-side redirect.
- [ ] Add subscription status, renewal/cancellation, failed-payment handling, receipts and customer billing history.
- [ ] Write clear refund, cancellation, acceptable-use, privacy and terms pages before accepting money.
- [ ] Add a support contact, issue-reporting flow, status/incident communication and a documented response process.
- [ ] Track product activation, repeat use, successful task completion, retention, conversion, churn and support burden without collecting unnecessary personal data.

**Possible packaging to validate (not a final pricing decision):**
- Free: core personal workflows with local-first use and clear export.
- Plus: secure cloud sync, backup history and advanced personal workflows.
- Business: SellSmart NG team access, roles, shared records and business reporting.
- Education/team: managed seats and shared learning or productivity spaces where privacy controls are ready.

Do not launch a paid tier until the included benefits work end-to-end and the costs of hosting, storage, email, AI and support are understood.

### Gate 5 — Investor and partnership readiness

- [ ] Prepare a concise product deck: problem, target customer, solution, differentiation, product screenshots, traction, roadmap, team and funding/partnership ask.
- [ ] Collect verified evidence: active users, weekly/monthly active users, retention cohorts, completed workflows, user interviews and paid pilot results.
- [ ] Separate actual metrics from targets and projections; show the measurement period and source.
- [ ] Maintain a product demo account with safe synthetic data and a repeatable demo script.
- [ ] Document architecture, third-party dependencies, security controls, costs, risks and technical debt.
- [ ] Keep ownership, contributor permissions, licences, brand assets and third-party code attributions organised.
- [ ] Build a simple operating budget and 12-month runway/scenario model before seeking investment.

## Initial customer and product focus

Do not try to commercialise all seven workspaces at once. Run small pilots and prioritise based on repeated user pain, willingness to pay, frequency of use, retention and support cost.

Candidates to validate:
1. **SellSmart NG:** Nigerian micro and small businesses that need straightforward sales, stock and invoice workflows.
2. **ReadWell Learn Suite:** learners who need a reliable study and revision workflow.
3. **FlowState Routine Suite:** individuals who need task, habit and focus organisation.

These are hypotheses to test, not validated market demand. RoboRoute, DataLens, BudgetBoard and CV Studio can continue improving while early pilots reveal which product has the strongest adoption and revenue potential.

## Release status vocabulary

- **Implemented:** code exists; user flow may not have been tested.
- **Needs setup:** dashboard, provider or external configuration is still required.
- **Needs integration:** separate pieces exist but are not connected end-to-end.
- **Tested:** the actual deployed workflow has passed the defined test.
- **Paid-launch ready:** all relevant trust, quality, billing, legal and support gates have passed.

A green deployment is not a paid-launch certification. Update this roadmap and the master completion tracker after each verified milestone.
