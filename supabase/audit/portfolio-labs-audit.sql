-- Portfolio Labs Supabase diagnostic audit (read-only)
-- Run in Supabase Dashboard > SQL Editor for project rjlfdqlgtqlswhjxnaik.
-- This does not modify tables, policies, extensions, data, or scheduled jobs.

-- 1) Tables, row-level security, and approximate row counts (catalog only)
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  c.reltuples::bigint as estimated_rows
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r'
order by c.relname;

-- 2) Policies and their definitions
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname='public'
order by tablename, policyname;

-- 3) Public-schema functions (review security-definer and exposed functions)
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  p.proacl as privileges,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
order by p.proname;

-- 4) Extensions installed
select extname, extversion
from pg_extension
order by extname;

-- 5) Scheduled jobs (run separately only if pg_cron is installed)
-- select jobid, jobname, schedule, active, command from cron.job order by jobname;

-- 6) Check for tables without RLS (public schema)
select n.nspname as schema_name, c.relname as table_name
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' and c.relrowsecurity=false
order by c.relname;

-- 7) Check grants on public tables
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema='public'
order by table_name, grantee, privilege_type;
