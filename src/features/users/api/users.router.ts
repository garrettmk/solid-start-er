import { UserAndRoles } from "@/features/roles/schema/user-and-roles-schema";
import { makeResponseSchema } from "@/lib/schemas/postgrest-response.schema";
import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/trpc";
import {
  recursively,
  camelizeObject,
  shakeNullValues,
} from "@/lib/util/objects.util";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import b64toBlob from "b64-to-blob";
import jimp from "jimp";
import { shake } from "radash";
import { z } from "zod";
import { userProfileUpdateSchema } from "../schema/user-profile-update-schema";
import { UserProfile, userProfileSchema } from "../schema/user-profile.schema";

const transformData: <T = object>(value: any) => T = recursively(
  shakeNullValues,
  camelizeObject
);

export const usersRouter = router({
  inviteUsers: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input, ctx }) => {
      const { supabase, user } = ctx;

      const results = await Promise.all(
        input.map((email) => supabase.auth.admin.inviteUserByEmail(email))
      );

      return results;
    }),

  getUser: protectedProcedure
    .input(z.string())
    .output(makeResponseSchema(userProfileSchema))
    .query(async ({ input, ctx }) => {
      const { supabase, user } = ctx;

      const result = (await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", input)
        .single()
        .then((result) => ({
          ...result,
          data: transformData<UserProfile | null>(result.data),
        }))) as PostgrestSingleResponse<UserProfile>;

      return result;
    }),

  findUsers: protectedProcedure
    .output(makeResponseSchema(z.array(userProfileSchema)))
    .query(async ({ ctx }) => {
      const { supabase, user } = ctx;

      return (await supabase
        .from("user_profiles")
        .select("*")
        .then((result) => ({
          ...result,
          data: transformData<UserProfile[] | null>(result.data),
        }))) as PostgrestSingleResponse<UserProfile[]>;
    }),

  findUsersWithRoles: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    return supabase
      .from("user_profiles")
      .select(
        `
          id,
          full_name,
          roles:application_roles!application_users(
            id,
            name,
            description
          )
        `
      )
      .then((result) => ({
        ...result,
        data: transformData<UserAndRoles[] | null>(result.data),
      }));
  }),

  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;
    return supabase.from("profiles").select("*").eq("id", user!.id).single();
  }),

  updateCurrentProfile: protectedProcedure
    .input(userProfileUpdateSchema)
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
