/*
    Tenants

    Tenants can be added or removed by application users with the correct permissions.
    They can be viewed by anyone, but only modified by application users or tenant users
    who have the needed permissions.
*/

CREATE TABLE public.tenants (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL CHECK(CHAR_LENGTH(name) >= 3),
    status TEXT NOT NULL CHECK (status in ('active', 'suspended'))
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.tenant_roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants NOT NULL,
    role TEXT,
    subject TEXT,
    action TEXT NOT NULL,
    UNIQUE(tenant_id, role, subject, action)
);

ALTER TABLE public.tenant_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.tenant_users (
    tenant_id UUID REFERENCES public.tenants NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    role_id BIGINT REFERENCES public.tenant_roles NOT NULL,
    PRIMARY KEY (tenant_id, user_id, role)
);

ALTER TABLE public.tenant_users ENABLED ROW LEVEL SECURITY;

-- Returns TRUE if a user has a role with the given permissions
CREATE FUNCTION has_tenant_permissions(tenant UUID, subject TEXT, action TEXT) RETURNS BOOLEAN
    AS $$ BEGIN
        RETURN EXISTS (
            SELECT
                1
            FROM
                public.tenant_roles tr,
                public.tenant_users tu
            WHERE
                tr.action = action AND
                tr.subject = subject AND
                tr.tenant_id = tenant AND
                tu.role_id = tr.id AND
                tu.user_id = auth.uid()
        )
    END $$ LANGUAGE PLPGSQL SECURITY DEFINER;

-- Tenant policies
CREATE POLICY "Only application admins can create tenants" ON public.tenants
    FOR INSERT WITH CHECK (public.has_application_permissions('tenants', 'create'));

CREATE POLICY "Tenants can be viewed by anyone" ON public.tenants
    FOR SELECT USING (true);

CREATE POLICY "Tenants can be updated by application admins or tenant admins" ON public.tenants
    FOR UPDATE USING (
        public.has_application_permissions('tenants', 'update') OR 
        public.has_tenant_permissions(id, 'tenants', 'update')
    );

CREATE POLICY "Tenants can only be deleted by application admins" ON public.tenants
    FOR DELETE USING (public.has_application_permissions('tenants', 'delete'));

-- Tenant role policies
CREATE POLICY "Tenant roles can be created by application and tenant admins" ON public.tenant_roles
    FOR INSERT WITH CHECK (
        public.has_application_permissions('tenant_roles', 'create') OR
        public.has_tenant_permissions(tenant_id, 'tenant_roles', 'create')
    );

CREATE POLICY "Tenant roles can be viewed be application/tenant admins, and by their users" ON public.tenant_roles
    FOR SELECT USING (
        user_id = auth.uid() OR
        public.has_application_permissions('tenant_roles', 'read') OR
        public.has_tenant_permissions(tenant_id, 'tenant_roles', 'read')
    );

CREATE POLICY "Tenant roles can be deleted by application/tenant admins" ON public.tenant_roles
    FOR DELETE USING (
        public.has_application_permissions('tenant_roles', 'delete') OR
        public.has_tenant_permissions(tenant_id, 'tenant_roles', 'delete')
    );
