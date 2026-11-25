-- Portfolio Labs: grant authenticated users API privileges.
-- RLS policies remain responsible for restricting each user's rows.
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_data to authenticated;
