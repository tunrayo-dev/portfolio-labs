# Portfolio Labs Calendar setup

## What is in the repository
- `calendar.html`: signed-in calendar workspace with month/agenda views, event creation, reminders, in-app notification inbox, and basic iCalendar import/export.
- `assets/calendar.js` and `assets/calendar.css`: client interface.
- `supabase/migrations/20261125000300_calendar_reminders.sql`: private per-user event, reminder and notification tables plus a due-reminder processor.
- `supabase/setup/calendar-reminder-cron.sql`: optional one-minute scheduler for creating in-app notifications.

## Required dashboard action
1. Open the Portfolio Labs Supabase project: https://supabase.com/dashboard/project/rjlfdqlgtqlswhjxnaik
2. Open SQL Editor.
3. Run the full contents of `supabase/migrations/20261125000300_calendar_reminders.sql`.
4. Open Database -> Extensions and confirm `pg_cron` is enabled.
5. Run `supabase/setup/calendar-reminder-cron.sql` once. Check Database -> Cron Jobs and confirm `portfolio-labs-process-reminders` exists.
6. Open https://tunrayo-dev.github.io/portfolio-labs/calendar.html while signed in.

Do not run this SQL in The POV's Supabase project. Do not put service-role keys or external provider passwords in browser code.

## Current limits
- Calendar data is private to the signed-in user through RLS.
- In-app notification generation requires the cron job above.
- The current interface supports basic .ics import/export; complex recurrence/time-zone rules from third-party calendars may need manual review.
- Outlook OAuth, Apple/CalDAV two-way sync, Zoho, browser push delivery and email delivery are not configured.
- Browser push needs a secure server-side subscription and VAPID setup; it is not implied by the in-app notification inbox.
- Product-originated reminders will appear once each product is integrated with the shared reminder tables.

## Test checklist
- Create an event with a reminder and verify both rows appear in the database.
- Create a standalone one-time and recurring reminder.
- Run the reminder processor and confirm a notification appears.
- Mark notifications read and reminders complete.
- Sign in with a second test account and verify it cannot see the first account's data.
- Test month navigation, mobile layout, .ics export and a small .ics import.
