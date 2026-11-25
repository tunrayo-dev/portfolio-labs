# Portfolio Labs — Motunrayo Linda Idowu

A collection of browser-based productivity, learning, business and data tools, plus native source-code projects.

## Web tools

| Product | Purpose | Technologies |
|---|---|---|
| FlowState | Task planning and focus sessions | HTML, CSS, JavaScript |
| HabitTrack | Habit check-ins and weekly review | HTML, CSS, JavaScript |
| ReadWell | Study planning, courses, flashcards and focus | HTML, CSS, JavaScript |
| StudyKit | Flashcards and active-recall revision | React, Tailwind CSS |
| PromptLab | Prompt drafting, templates and versioning | JavaScript |
| DataLens | CSV/JSON exploration and analysis | JavaScript |
| BudgetBoard | Income, expenses, budgets, goals and reports | JavaScript |
| SellSmart NG | Business profile, products, invoices and sales reports | JavaScript |
| CV Studio | CV builder, versions and print-to-PDF | JavaScript |
| RoboRoute | Pathfinding visualiser and Lagos-focused route explorer | JavaScript |

## Native code projects

- `code-projects/cpp/expense-tracker.cpp` — C++17 console expense tracker.
- `code-projects/csharp/study-cards.cs` — C# console flashcard app.
- `code-projects/python/csv-insights.py` — Python CSV category summary tool.
- `code-projects/typescript/task-board.ts` — typed task manager class.
- `code-projects/sql/community-learning-hub.sql` — PostgreSQL schema and reporting queries.

These source examples run in their respective compiler or runtime; they are not browser apps.

## Account and data status

Portfolio Labs has a Supabase email/password authentication foundation. The browser apps currently retain their main working datasets in local storage unless a product explicitly indicates otherwise. **Signing in does not yet mean all product data is synced to the cloud or available on another device.**

The shared cloud-workspace adapter and its database migration are being prepared. Cloud sync must not be considered active until the migration is applied in the Portfolio Labs Supabase project and each product has been integrated and tested. Never place a Supabase service-role key or private provider secret in this repository.

A first shared Calendar and Reminders workspace is available at `calendar.html`. It requires the calendar migration and optional Cron setup described in [the Calendar setup guide](docs/CALENDAR-SETUP.md).\n\nSee [the master completion tracker](docs/MASTER-COMPLETION-TRACKER.md) for implementation and testing status.

## Run and publish

Open `index.html` in a modern browser or publish with GitHub Pages. Most of the site has no build step. StudyKit loads React, ReactDOM, Babel and Tailwind from public CDNs, so its first load requires internet access. Some mapping and geocoding features also require an internet connection.

## Install

Portfolio Labs is an installable Progressive Web App on supported browsers. This is a PWA install, not a Google Play Store release.

Founded and created by **Linda (Motunrayo Linda Idowu)**.
