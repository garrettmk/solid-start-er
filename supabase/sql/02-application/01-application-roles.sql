-- Active: 1677982949012@@127.0.0.1@54322@postgres
/*
    Application roles

    Application roles give users permissions at the application level. This is for
    support users, like admins who need to create or suspend a tenant. Not really
    for primary users.
*/


-- Role name and description
create table public.application_roles (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text not null
);

-- Role permissions for various subjects
CREATE TABLE public.application_role_permissions (
    role_id REFERENCES public.application_roles NOT NULL,
    subject TEXT NOT NULL,
    action TEXT NOT NULL,
    PRIMARY KEY (role_id, subject, action)
);

-- Assignments of roles to users
CREATE TABLE public.application_users (
    user_id UUID REFERENCES auth.users NOT NULL,
    role_id BIGINT REFERENCES public.application_roles NOT NULL,
    PRIMARY KEY (user_id, role)
);


/*
  Functions

  These utility functions simplify determining a user's permissions.
*/

create or replace function public.has_application_role(role_id bigint) returns boolean
as $$
  begin
    return exists (
      select
        1
      from 
        public.application_users au
      where
        au.user_id = auth.uid() and
        au.role_id = role_id
    );
  end
$$ language plpgsql security definer;


create or replace function public.has_application_permissions(subject text, action text) returns boolean
as $$
  begin
    return exists (
      select
        1
      from
        public.application_roles ar,
        public.application_users au
      where
        au.user_id = auth.uid() and
        au.role_id = ar.id and
        ar.subject = subject and
        ar.action = action
    );
  end
$$ language plpgsql security definer;


/*

  Policies

*/

alter table public.application_roles enable row level security;
alter table public.application_role_permissions enable row level security;
alter table public.application_users enable row level security;

create or replace policy "Only superusers can create application roles" on public.application_roles
  for insert with check (public.is_super_admin());

create or replace policy "Any user can read the application roles" on public.application_roles
  for select using (true);

create or replace policy "Users with the 'update' permission can update application roles" on public.application_roles
  for update using (
    public.is_super_admin() OR
    public.has_application_permissions('application_roles', 'update')
  );

create or replace policy "Only superusers can delete application roles" on pulic.application_roles
  for delete using (public.is_super_admin());


create or replace policy "Only superusers can add role permissions" on public.application_role_permissions
  for insert with check (public.is_super_admin());

create or replace policy "Role permissions can't be modified" on public.application_role_permissions
  for update using (false);

create or replace policy "Users can only read the permissions of roles they belong to" on public.application_role_permissions
  for select using (
    public.is_super_admin() or
    public.has_application_role(role_id)
  );

create or replace policy "Only superusers can delete role permissions" on public.application_role_permissions
  for delete using (public.is_super_admin());


create or replace policy "Only users with the 'create' permission can assign application roles" on public.application_users
  for insert with check (
    public.is_super_admin() or
    public.has_application_permissions('application_users', 'create')
  );

create or replace policy "Any user can read application role assignments" on public.application_users
  for select using (true);

create or replace policy "Application role assignments can't be modified" on public.application_users
  for update using (false);

create or replace policy "Only users with the 'delete' permission can remove application role assignments" on public.application_users
  for delete using (
    public.is_super_admin() or
    public.has_application_permissions('application_users', 'delete')
  );










ALTER TABLE public.application_roles ENABLE ROW LEVEL SECURITY;

