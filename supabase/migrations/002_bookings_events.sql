-- Bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  counselor_id integer not null,
  counselor_name text not null,
  session_type text not null check (session_type in ('video', 'in-person', 'chat')),
  date text not null,
  time text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  created_at timestamptz default now() not null
);

alter table public.bookings enable row level security;

create policy "Users can manage their own bookings"
  on public.bookings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Event registrations table
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  event_id integer not null,
  registered_at timestamptz default now() not null,
  unique (user_id, event_id)
);

alter table public.event_registrations enable row level security;

create policy "Users can manage their own event registrations"
  on public.event_registrations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
