-- CBSE Class 6 NCERT Revision App schema.
-- The current app keeps progress in browser localStorage, but this schema makes
-- the hosted Supabase project ready for future authenticated sync.

create extension if not exists pgcrypto;

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  class_level int not null default 6 check (class_level = 6),
  board text not null default 'CBSE',
  daily_minutes int not null default 40 check (daily_minutes in (20, 40, 60)),
  goals text[] not null default array['daily-revision', 'school-exam'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id text primary key,
  title text not null,
  book_title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  chapter_number int not null,
  title text not null,
  summary text not null default '',
  created_at timestamptz not null default now(),
  unique (subject_id, chapter_number)
);

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid references public.student_profiles(id) on delete cascade,
  chapter_id text references public.chapters(id) on delete set null,
  paper_id text not null,
  paper_set int not null,
  score int not null default 0,
  total int not null default 0,
  weak_concepts text[] not null default '{}',
  question_results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid references public.student_profiles(id) on delete cascade,
  title text not null default 'Chat Tutor Session',
  subject_id text references public.subjects(id) on delete set null,
  chapter_id text references public.chapters(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('student', 'tutor')),
  content text not null,
  created_at timestamptz not null default now()
);

insert into public.subjects (id, title, book_title)
values
  ('science', 'Science', 'Curiosity'),
  ('maths', 'Mathematics', 'Ganita Prakash'),
  ('sst', 'Social Science', 'Exploring Society: India and Beyond')
on conflict (id) do update set
  title = excluded.title,
  book_title = excluded.book_title;

alter table public.student_profiles enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

alter table public.subjects enable row level security;
alter table public.chapters enable row level security;

drop policy if exists "Public subjects are readable" on public.subjects;
create policy "Public subjects are readable"
on public.subjects for select
to anon, authenticated
using (true);

drop policy if exists "Public chapters are readable" on public.chapters;
create policy "Public chapters are readable"
on public.chapters for select
to anon, authenticated
using (true);

