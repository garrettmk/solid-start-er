-- Active: 1677444531824@@db.advnufdjixikalfrkzmu.supabase.co@5432@postgres@public

/*
    User profiles

    User profiles store public information about each user. Users should be able
    to view everyone's profile, but only edit their own profile. We also set up
    a trigger to automatically create a profile row when a user is registered.
*/

CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    casual_name TEXT NOT NULL,
    avatar_url TEXT,
    wants_marketing BOOLEAN NOT NULL,
    agrees_to_terms BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fullname_length CHECK (char_length(full_name) >= 3),
    CONSTRAINT casual_name CHECK (char_length(casual_name) >= 3)
);

ALTER TABLE public.user_profiles enable ROW LEVEL SECURITY;

CREATE policy "User profiles are viewable by everyone." ON public.user_profiles FOR
    SELECT USING (TRUE);

CREATE policy "Users can insert their own profile." ON public.user_profiles FOR
    INSERT WITH CHECK (auth.uid() = id);

CREATE policy "Users can update own profile." ON public.user_profiles FOR
    UPDATE USING (auth.uid() = id);

-- Create a profile when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS 
$$ BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, casual_name, avatar_url, wants_marketing, agrees_to_terms, created_at)
    VALUES (
            new.id,
            new.email,
            new.raw_user_meta_data->>'fullName',
            coalesce(new.raw_user_meta_data->>'casualName', split_part(new.raw_user_meta_data->>'fullName', ' ', 1)),
            new.raw_user_meta_data->>'avatarUrl',
            CAST(new.raw_user_meta_data->>'wantsMarketing' AS BOOLEAN),
            CAST(new.raw_user_meta_data->>'agreesToTerms' AS BOOLEAN),
            new.created_at
        );
    RETURN new;
END $$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update the profile automatically
CREATE OR REPLACE FUNCTION public.handle_update_user() RETURNS TRIGGER AS
$$ BEGIN
    UPDATE public.user_profiles SET
        email = new.email,
        full_name = coalesce(new.raw_user_meta_data->>'fullName', full_name),
        casual_name = coalesce(new.raw_user_meta_data->>'casualName', casual_name),
        avatar_url = coalesce(new.raw_user_meta_data->>'avatarUrl', avatar_url),
        wants_marketing = CAST(new.raw_user_meta_data->'wantsMarketing' AS BOOLEAN),
        agrees_to_terms = CAST(new.raw_user_meta_data->'agreesToTerms' AS BOOLEAN)
    WHERE id = new.id;
    RETURN new;
END $$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE OR REPLACE TRIGGER ON_AUTH_USER_UPDATED
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_update_user();

/*
    Avatar storage

    Set up a bucket for storing avatar images. Users can view any avatar, but
    can only update or delete their own avatar. Old avatars are automatically
    deleted when a new one is uploaded.
*/

INSERT INTO storage.buckets (id, name)
    VALUES ('avatars', 'avatars');

CREATE policy "Avatar images are publicly accessible." ON storage.objects FOR
    SELECT USING (bucket_id = 'avatars');

CREATE policy "Anyone can upload an avatar." ON storage.objects FOR
    INSERT WITH CHECK (bucket_id = 'avatars');

CREATE policy "Anyone can update their own avatar." ON storage.objects FOR
    UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

CREATE policy "Anyone can delete their own avatar." ON storage.objects FOR
    DELETE USING (auth.uid() = owner AND bucket_id = 'avatars');

-- Delete the old avatar when a new one is uploaded
CREATE OR REPLACE FUNCTION storage.handle_upload_avatar() RETURNS TRIGGER AS 
$$ BEGIN
    DELETE FROM
        storage.objects 
    WHERE
        owner = auth.uid() AND
        id != NEW.id;
    RETURN NEW;
END $$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_upload_avatar
    AFTER INSERT ON storage.objects
    FOR EACH ROW EXECUTE PROCEDURE storage.handle_upload_avatar();


/*
    Application roles

    Application roles give users permissions at the application level. This is for
    support users, like admins who need to create or suspend a tenant. Not really
    for primary users.
*/

-- Create a table for holding role permissions
CREATE TABLE public.application_roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role TEXT,
    subject TEXT NOT NULL,
    action TEXT NOT NULL,
    UNIQUE(role, subject, action)
);

ALTER TABLE public.application_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN
    AS $$ BEGIN
        RETURN (
            SELECT
                u.is_super_admin
            FROM
                auth.users u
            WHERE
                u.id = auth.uid()
        );
    END $$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE POLICY "Only super admins can create application roles" ON public.application_roles
    FOR INSERT WITH CHECK (public.is_super_admin());

CREATE POLICY "Any user can read application roles" ON public.application_roles
    FOR SELECT USING (true);

CREATE POLICY "Only super admins can modify application roles" ON public.application_roles
    FOR UPDATE USING (public.is_super_admin());

CREATE POLICY "Only super admins can delete application roles" ON public.application_roles
    FOR DELETE USING (public.is_super_admin());


-- Create a table for role assignments
CREATE TABLE public.application_users (
    user_id UUID REFERENCES auth.users NOT NULL,
    role_id BIGINT REFERENCES public.application_roles NOT NULL,
    PRIMARY KEY (user_id, role)
);

ALTER TABLE public.application_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can assign application roles" ON public.application_users 
    FOR INSERT WITH CHECK (public.is_super_admin());

CREATE POLICY "Any user can read application roles assignments" ON public.application_users
    FOR SELECT USING (true);

CREATE POLICY "Only super admins can delete application role assignments" ON public.application_users
    FOR DELETE USING (public.is_super_admin());


-- Returns TRUE if the user has role with the given permissions
CREATE FUNCTION public.has_application_permissions(subject TEXT, action TEXT) RETURN BOOLEAN AS
    $$ BEGIN
        RETURN EXISTS (
            SELECT
                1
            FROM
                public.application_roles ar,
                public.application_users au
            WHERE
                au.user_id = auth.uid() AND
                au.role_id = ar.id AND
                ar.subject = subject AND
                ar.action = action
        );
    END $$ LANGUAGE PLPGSQL SECURITY DEFINER;


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


/*
    Documents


*/
CREATE TABLE public.documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    data TEXT
);

ALTER TABLE public.documents ENABLED ROW LEVEL SECURITY;

CREATE TABLE public.document_permissions (
    document_id BIGINT REFERENCES public.documents NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    action TEXT NOT NULL,
    PRIMARY KEY (document_id, user_id, action)
);

CREATE POLICY "Users can view documents for which they have read permissions" ON public.documents
    FOR SELECT USING (
        (
            SELECT
                d.action = 'read'
            FROM
                public.document_permissions d
            WHERE
                d.document_id = id AND
                d.user_id = auth.uid() AND
                d.user_id = user_id
        )
    );


CREATE POLICY "Users can view documents for which they have read permissions" ON public.documents
    FOR SELECT USING (
        user_id = auth.uid() OR
        (
            SELECT 
                r.action = 'read'
            FROM
                public.tenant_roles r
            WHERE
                r.user_id = auth.uid() AND
                r.tenant_id = tenant_id AND
                r.subject = 'documents'
        )
    );

CREATE POLICY "Users can create documents for tenants where they have create permissions" ON public.documents
    FOR INSERT WITH (
        (
            SELECT
                r.action = 'create'
            FROM
                public.tenant_roles r
            WHERE
                r.user_id = auth.uid() AND
                r.tenant_id = tenant_id AND
                r.subject = 'documents'
        )
    )