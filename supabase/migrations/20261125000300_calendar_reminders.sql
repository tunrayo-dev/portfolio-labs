-- Portfolio Labs Calendar, Reminders and in-app Notifications.
-- Apply only in the Portfolio Labs Supabase project.
create table if not exists public.calendar_events (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 description text not null default '' check (char_length(description)<=1500),
 starts_at timestamptz not null,
 ends_at timestamptz,
 all_day boolean not null default false,
 timezone text not null default 'Africa/Lagos',
 category text not null default 'personal' check (category in ('personal','study','work','health','deadline','other')),
 source_product text not null default 'calendar' check (source_product in ('calendar','readwell','studykit','promptlab','flowstate','habittrack','datalens','sellsmart','budgetboard','cvstudio','roboroute')),
 source_record_key text,
 external_provider text,
 external_event_id text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint calendar_event_time_order check (ends_at is null or ends_at > starts_at)
);
create index if not exists calendar_events_owner_start_idx on public.calendar_events(owner_id,starts_at);
alter table public.calendar_events enable row level security;
drop policy if exists "Users manage their own calendar events" on public.calendar_events;
create policy "Users manage their own calendar events" on public.calendar_events for all to authenticated using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
grant select,insert,update,delete on public.calendar_events to authenticated;

create table if not exists public.workspace_reminders (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 event_id uuid references public.calendar_events(id) on delete set null,
 title text not null check (char_length(title) between 1 and 120),
 body text not null default '' check (char_length(body)<=500),
 due_at timestamptz not null,
 timezone text not null default 'Africa/Lagos',
 repeat_rule text not null default 'none' check (repeat_rule in ('none','daily','weekly','monthly')),
 status text not null default 'pending' check (status in ('pending','sent','completed','cancelled')),
 source_product text not null default 'calendar' check (source_product in ('calendar','readwell','studykit','promptlab','flowstate','habittrack','datalens','sellsmart','budgetboard','cvstudio','roboroute')),
 source_record_key text,
 notified_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists workspace_reminders_due_idx on public.workspace_reminders(status,due_at) where status='pending';
create index if not exists workspace_reminders_owner_idx on public.workspace_reminders(owner_id,due_at);
alter table public.workspace_reminders enable row level security;
drop policy if exists "Users manage their own reminders" on public.workspace_reminders;
create policy "Users manage their own reminders" on public.workspace_reminders for all to authenticated using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
grant select,insert,update,delete on public.workspace_reminders to authenticated;

create table if not exists public.workspace_notifications (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 reminder_id uuid references public.workspace_reminders(id) on delete set null,
 title text not null,
 body text not null default '',
 notification_type text not null default 'reminder',
 read_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists workspace_notifications_owner_created_idx on public.workspace_notifications(owner_id,created_at desc);
alter table public.workspace_notifications enable row level security;
drop policy if exists "Users manage their own notifications" on public.workspace_notifications;
create policy "Users manage their own notifications" on public.workspace_notifications for all to authenticated using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
grant select,insert,update,delete on public.workspace_notifications to authenticated;

create or replace function public.process_due_workspace_reminders()
returns integer language plpgsql security definer set search_path=public as $$
declare r record; processed integer:=0; next_due timestamptz;
begin
 for r in select * from public.workspace_reminders
   where status='pending' and due_at<=now()
   order by due_at
   for update skip locked
 loop
   insert into public.workspace_notifications(owner_id,reminder_id,title,body,notification_type)
   values(r.owner_id,r.id,r.title,r.body,'reminder');
   if r.repeat_rule='daily' then
     update public.workspace_reminders set due_at=r.due_at+interval '1 day',notified_at=now(),updated_at=now() where id=r.id;
   elsif r.repeat_rule='weekly' then
     update public.workspace_reminders set due_at=r.due_at+interval '7 days',notified_at=now(),updated_at=now() where id=r.id;
   elsif r.repeat_rule='monthly' then
     update public.workspace_reminders set due_at=r.due_at+interval '1 month',notified_at=now(),updated_at=now() where id=r.id;
   else
     update public.workspace_reminders set status='sent',notified_at=now(),updated_at=now() where id=r.id;
   end if;
   processed:=processed+1;
 end loop;
 return processed;
end; $$;
revoke all on function public.process_due_workspace_reminders() from public, anon, authenticated;
