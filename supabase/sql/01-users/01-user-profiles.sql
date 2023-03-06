/*
    User profiles

    User profiles store public information about each user. Users should be able
    to view everyone's profile, but only edit their own profile. We also set up
    a trigger to automatically create a profile row when a user is registered.
*/
DROP TABLE IF EXISTS public.user_profiles;

CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    preferred_name TEXT NOT NULL,
    avatar_url TEXT,
    avatar_initials TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fullname_length CHECK (char_length(full_name) >= 3),
    CONSTRAINT preferred_name_length CHECK (char_length(preferred_name) >= 3),
    CONSTRAINT initials_length CHECK (avatar_initials ~ '^[a-zA-Z]{2}$')
);

COMMENT ON TABLE public.user_profiles IS 'Public user information';

/*
    Policies

    User profiles are public information, so they are viewable by everyone.
    However, only the owner may update a profile. Profiles can not be deleted
    by users - they area automatically removed if a user is deleted.
*/
ALTER TABLE public.user_profiles enable ROW LEVEL SECURITY;

CREATE POLICY "User profiles are viewable by everyone." ON public.user_profiles FOR
    SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile." ON public.user_profiles FOR
    INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.user_profiles FOR
    UPDATE USING (auth.uid() = id);


/*
    Triggers

    - A profile is created automatically when a user is registered.
    - If the user table is updated, the profile table is updated to stay
      in sync.
    - If a user is deleted, the profile should be automatically removed.
*/

-- Create a profile automatically
CREATE OR REPLACE FUNCTION public.handle_user_created() RETURNS TRIGGER 
AS $$ 
    BEGIN
        INSERT INTO 
            public.user_profiles (id, full_name, preferred_name, avatar_url, avatar_initials, created_at)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'fullName',
            coalesce(NEW.raw_user_meta_data->>'preferredName', split_part(NEW.raw_user_meta_data->>'fullName', ' ', 1)),
            NEW.raw_user_meta_data->>'avatarUrl',
            coalesce(NEW.raw_user_meta_data->>'avatarInitials', public.get_initials(NEW.raw_user_meta_data->>'fullName')),
            NEW.created_at
        );
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_user_created
    AFTER INSERT ON auth.users 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_user_created();

-- Update the profile automatically
CREATE OR REPLACE FUNCTION public.handle_user_updated() RETURNS TRIGGER 
AS $$ 
    BEGIN
        UPDATE 
            public.user_profiles p 
        SET
            full_name = coalesce(NEW.raw_user_meta_data->>'fullName', full_name),
            preferred_name = coalesce(NEW.raw_user_meta_data->>'preferredName', preferred_name),
            avatar_url = coalesce(NEW.raw_user_meta_data->>'avatarUrl', avatar_url),
            avatar_initials = coalesce(NEW.raw_user_meta_data->>'avatarInitials', avatar_initials),
            last_sign_in_at = NEW.last_sign_in_at
        WHERE
            p.id = NEW.id;
        RETURN NEW;
    END 
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE OR REPLACE TRIGGER ON_AUTH_USER_UPDATED
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_user_updated();

-- Delete profiles automatically
create or replace function public.handle_user_deleted() returns trigger
as $$
    begin
        delete from
            public.user_profiles p
        where
            p.id = id;
        return old;
    end;
$$ language PLPGSQL SECURITY DEFINER;

create or replace trigger on_auth_user_deleted
    before delete on auth.users
    for each row execute procedure public.handle_user_deleted();
