-- Portfolio Labs cloud workspace storage.
-- Apply this migration in the Portfolio Labs Supabase project before enabling app sync.
-- Each signed-in user can only access their own records through RLS.
create table if not exists public.workspace_records (
  owner_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null check (product_key in (
    'readwell', 'studykit', 'promptlab', 'flowstate', 'habittrack',
    'datalens', 'sellsmart', 'budgetboard', 'cvstudio', 'roboroute'
  )),
  record_key text not null check (char_length(record_key) between 1 and 120),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint workspace_records_pkey primary key (owner_id, product_key, record_key)
);

create index if not exists workspace_records_product_updated_idx
  on public.workspace_records (owner_id, product_key, updated_at desc);

alter table public.workspace_records enable row level security;

drop policy if exists "Users can read their own workspace records" on public.workspace_records;
create policy "Users can read their own workspace records"
  on public.workspace_records for select to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Users can insert their own workspace records" on public.workspace_records;
create policy "Users can insert their own workspace records"
  on public.workspace_records for insert to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "Users can update their own workspace records" on public.workspace_records;
create policy "Users can update their own workspace records"
  on public.workspace_records for update to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete their own workspace records" on public.workspace_records;
create policy "Users can delete their own workspace records"
  on public.workspace_records for delete to authenticated
  using (auth.uid() = owner_id);

grant select, insert, update, delete on public.workspace_records to authenticated;
