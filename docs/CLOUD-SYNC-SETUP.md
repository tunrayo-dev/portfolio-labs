# Cloud workspace setup

This setup is for the **Portfolio Labs** Supabase project only. Do not run it in the separate Girls Unplugged / The POV project.

## 1. Apply the database migration

1. Open the Portfolio Labs project in the Supabase dashboard (project ref: `rjlfdqlgtqlswhjxnaik`).
2. Open **SQL Editor** and create a new query.
3. Open `supabase/migrations/20261125000200_workspace_records.sql` in this repository.
4. Copy the complete SQL file into the editor and run it.
5. Confirm that `public.workspace_records` exists and Row Level Security is enabled.

The migration creates a per-user key/value workspace table. Policies restrict each signed-in account to rows where `owner_id = auth.uid()`. The browser must use only the existing publishable key; never expose a service-role key.

## 2. Verify the table

Run this read-only check in the SQL Editor:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename = 'workspace_records';
```

Expected: one row for `workspace_records` with `rowsecurity = true`.

## 3. What this does not enable by itself

Applying the migration creates the secure storage layer. It does **not** automatically sync the products. Each product still needs explicit load/save integration, safe local-to-cloud migration, conflict handling and two-account isolation tests before cloud sync can be called live.

Do not delete local browser data while this integration work is in progress. Keep product exports/backups until cloud records have been verified on a second device.
