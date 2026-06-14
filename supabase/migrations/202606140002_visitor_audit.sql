-- Visitor audit trail for aggregate visitor count and private access logging.
-- This table is intentionally not readable or writable by anon/authenticated
-- clients. The Next.js server API writes to it with the server-side service key.

create table if not exists public.visitor_audit (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  visitor_name text not null default 'Student' check (char_length(visitor_name) <= 80),
  ip_address inet,
  visited_at timestamptz not null default now()
);

create index if not exists visitor_audit_visited_at_idx
on public.visitor_audit (visited_at desc);

create index if not exists visitor_audit_session_id_idx
on public.visitor_audit (session_id);

alter table public.visitor_audit enable row level security;

revoke all on public.visitor_audit from anon, authenticated;
grant select, insert on public.visitor_audit to service_role;
