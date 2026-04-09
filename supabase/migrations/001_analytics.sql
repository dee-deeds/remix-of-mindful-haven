-- ─────────────────────────────────────────────
-- 001_analytics.sql
-- Mood logs + Assessment results for the
-- MindCare analytics dashboard
-- Run this in your Supabase SQL editor
-- ─────────────────────────────────────────────

-- ── mood_logs ──────────────────────────────────
create table if not exists public.mood_logs (
  id          uuid      primary key default gen_random_uuid(),
  user_id     uuid      not null references auth.users(id) on delete cascade,
  mood_value  smallint  not null check (mood_value between 1 and 5),
  note        text,
  logged_at   timestamptz not null default now()
);

-- Enforce one entry per user per UTC calendar day
create unique index if not exists mood_logs_user_day_idx
  on public.mood_logs (user_id, date(logged_at at time zone 'utc'));

create index if not exists mood_logs_user_time_idx
  on public.mood_logs (user_id, logged_at desc);

alter table public.mood_logs enable row level security;

create policy "Users read own mood logs"
  on public.mood_logs for select
  using (auth.uid() = user_id);

create policy "Users insert own mood logs"
  on public.mood_logs for insert
  with check (auth.uid() = user_id);

-- Allow upsert (update) for same-day re-log
create policy "Users update own mood logs"
  on public.mood_logs for update
  using (auth.uid() = user_id);


-- ── assessment_results ─────────────────────────
create table if not exists public.assessment_results (
  id        uuid      primary key default gen_random_uuid(),
  user_id   uuid      not null references auth.users(id) on delete cascade,
  score     smallint  not null check (score between 0 and 30),
  level     text      not null,   -- Minimal | Mild | Moderate | Significant
  answers   jsonb     not null,   -- array of answer indices [0-3] x 10 questions
  taken_at  timestamptz not null default now()
);

create index if not exists assessment_results_user_time_idx
  on public.assessment_results (user_id, taken_at desc);

alter table public.assessment_results enable row level security;

create policy "Users read own assessment results"
  on public.assessment_results for select
  using (auth.uid() = user_id);

create policy "Users insert own assessment results"
  on public.assessment_results for insert
  with check (auth.uid() = user_id);
