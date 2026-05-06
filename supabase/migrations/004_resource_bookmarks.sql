-- Resource bookmarks (persisted per user)
create table if not exists public.resource_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  resource_id integer not null,
  created_at timestamptz default now() not null,
  unique (user_id, resource_id)
);

alter table public.resource_bookmarks enable row level security;

create policy "Users can manage their own bookmarks"
  on public.resource_bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
