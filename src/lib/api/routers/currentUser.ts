import b64toBlob from "b64-to-blob";
import jimp from "jimp";
import { shake } from "radash";
import { updateProfileSchema } from "~/lib/schemas/update-profile";
import { protectedProcedure, router } from "../trpc";

export const currentUserRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;
    return supabase.from("profiles").select("*").eq("id", user!.id).single();
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const { supabase, user } = ctx;
      const {
        avatarImage,
        avatarImageData,
        fullName,
        casualName,
        wantsMarketing,
      } = input;
      let avatarUrl;

      if (avatarImage && avatarImageData) {
        // Resize the image
        const image = await jimp.read(Buffer.from(avatarImageData, "base64"));
        const resizedData = await image
          .cover(128, 128)
          .getBase64Async(avatarImage.type);

        const resizedBlob = b64toBlob(
          resizedData.split(",")[1],
          avatarImage.type
        );

        // Generate a random filename
        const filename = Math.random() * 10e16;
        const ext = avatarImage.name.split(".")[1];
        const path = `${filename}.${ext}`;

        // Save the resized image to storage
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(path, resizedBlob, {
            contentType: avatarImage.type,
            upsert: true,
          });

        if (error) {
          console.log(error);
          throw error;
        }

        // The avatar is public, so we can just save the public URL
        avatarUrl = supabase.storage.from("avatars").getPublicUrl(data.path)
          .data.publicUrl;
      }

      // Get rid of undefined values
      const updatedValues = shake({
        full_name: fullName,
        casual_name: casualName,
        wants_marketing: wantsMarketing,
        avatar_url: avatarUrl,
      });

      // Update the database
      const result = await supabase
        .from("profiles")
        .update(updatedValues)
        .eq("id", user!.id)
        .single();

      if (result.error) throw result.error;

      return result;
    }),
});
