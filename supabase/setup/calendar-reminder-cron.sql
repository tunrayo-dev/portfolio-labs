-- Optional scheduler setup for Portfolio Labs Calendar reminders.
-- Run after the calendar migration, in the Portfolio Labs project SQL Editor.
-- First confirm pg_cron is available under Database -> Extensions (enable pg_cron if needed).
-- This creates in-app notifications; browser push/email delivery is a separate later setup.
select cron.schedule(
  'portfolio-labs-process-reminders',
  '* * * * *',
  $$select public.process_due_workspace_reminders();$$
);
