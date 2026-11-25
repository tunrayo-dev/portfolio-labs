# Portfolio Labs — Motunrayo Linda Idowu

Portfolio Labs is an independent digital product studio building focused browser-based tools for learning, productivity, small-business operations, personal finance, careers, data and route algorithms.

The public catalogue presents **seven product workspaces**. Some workspaces combine earlier standalone tools into one coherent suite; the ten names below describe the product modules, not ten separate top-level products.

## Product workspaces

| Workspace | Included modules | Purpose |
|---|---|---|
| FlowState Routine Suite | FlowState + HabitTrack | Tasks, focus sessions, habits and routines |
| ReadWell Learn Suite | ReadWell + StudyKit + PromptLab | Study planning, active recall, flashcards and prompt drafting |
| DataLens | DataLens | CSV/JSON exploration, cleaning and analysis |
| BudgetBoard | BudgetBoard | Income, expenses, budgets, goals and reports |
| SellSmart NG | SellSmart NG | Small-business customers, products, sales, stock and invoices |
| CV Studio | CV Studio | CV drafting, versions and document export |
| RoboRoute | RoboRoute | Pathfinding visualisation and route exploration |

The product catalogue at [the Portfolio Labs homepage](index.html) is the canonical list of public workspaces.

## Native code projects

- `code-projects/cpp/expense-tracker.cpp` — C++17 console expense tracker.
- `code-projects/csharp/study-cards.cs` — C# console flashcard app.
- `code-projects/python/csv-insights.py` — Python CSV category summary tool.
- `code-projects/typescript/task-board.ts` — typed task manager class.
- `code-projects/sql/community-learning-hub.sql` — PostgreSQL schema and reporting queries.

These source examples run in their respective compiler or runtime; they are not browser apps.

## Account, privacy and data status

Portfolio Labs has a Supabase email/password authentication foundation. **Authentication is not the same as cloud synchronisation.** The main working datasets in several browser products are still stored in the current browser's local storage. Signing in does not yet guarantee that data follows a user to another device.

The shared cloud-workspace adapter exists, but the database migration, product-by-product integration, conflict handling and account-isolation tests must be completed before cross-device sync can be advertised as available. Do not put Supabase service-role keys, AI provider secrets or private API keys in browser code.

A shared Calendar and Reminders workspace is available at `calendar.html`. Its database migration and optional Cron scheduler are documented in [the Calendar setup guide](docs/CALENDAR-SETUP.md). In-app reminder generation is not the same as reliable email or browser push delivery; those providers are not yet configured.

See the [master completion tracker](docs/MASTER-COMPLETION-TRACKER.md) for implementation and test status, and the [commercial readiness roadmap](docs/COMMERCIAL-READINESS-ROADMAP.md) for the work required before paid public launch.

## Run and publish

Open `index.html` in a modern browser or publish with GitHub Pages. Most of the site has no build step. Some experiences depend on third-party CDNs or external services and therefore require an internet connection.

## Install

Portfolio Labs is an installable Progressive Web App on supported browsers. This is a PWA install, not a Google Play Store release.

Founded and created by **Linda (Motunrayo Linda Idowu)**.
