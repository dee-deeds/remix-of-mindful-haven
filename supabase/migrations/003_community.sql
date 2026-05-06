-- Community posts
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  display_name text not null,
  is_anonymous boolean not null default true,
  content text not null,
  category text not null default 'General',
  created_at timestamptz default now() not null
);

alter table public.community_posts enable row level security;

create policy "Anyone can read posts"
  on public.community_posts for select using (true);

create policy "Authenticated users can create posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.community_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

-- Community comments
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  display_name text not null,
  is_anonymous boolean not null default false,
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.community_comments enable row level security;

create policy "Anyone can read comments"
  on public.community_comments for select using (true);

create policy "Authenticated users can create comments"
  on public.community_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.community_comments for delete
  using (auth.uid() = user_id);

-- Community likes (one per user per post)
create table if not exists public.community_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (post_id, user_id)
);

alter table public.community_likes enable row level security;

create policy "Anyone can read likes"
  on public.community_likes for select using (true);

create policy "Authenticated users can like"
  on public.community_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.community_likes for delete
  using (auth.uid() = user_id);

-- Community shares (tracked for post owner insights)
create table if not exists public.community_shares (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  sharer_name text,
  created_at timestamptz default now() not null
);

alter table public.community_shares enable row level security;

create policy "Anyone can read shares"
  on public.community_shares for select using (true);

create policy "Authenticated users can record a share"
  on public.community_shares for insert
  with check (auth.uid() = user_id);
