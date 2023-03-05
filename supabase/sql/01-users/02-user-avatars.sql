/*
    User avatars

    Set up a bucket for storing avatar images. Users can view any avatar, but
    can only update or delete their own avatar. Old avatars are automatically
    deleted when a new one is uploaded.
*/

INSERT INTO storage.buckets (id, name)
    VALUES ('avatars', 'avatars');

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar." ON storage.objects
    FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can delete their own avatar." ON storage.objects
    FOR DELETE USING (auth.uid() = owner AND bucket_id = 'avatars');

-- Delete the old avatar when a new one is uploaded
CREATE FUNCTION storage.handle_avatar_uploaded() RETURNS TRIGGER
AS $$ 
    BEGIN
        DELETE FROM
            storage.objects 
        WHERE
            owner = auth.uid() AND
            id != NEW.id;
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE TRIGGER on_avatar_uploaded
    AFTER INSERT ON storage.objects
    FOR EACH ROW EXECUTE PROCEDURE storage.handle_avatar_uploaded();
