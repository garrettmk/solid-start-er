import { z } from "zod";
import {
  userProfileUpdateSchemaBase,
  MAX_FILE_SIZE,
  IMAGE_TYPES,
} from "@/features/users/schema/user-profile-update-schema";

export const userUpdateFormSchema = userProfileUpdateSchemaBase
  .pick({
    fullName: true,
    casualName: true,
    wantsMarketing: true,
  })
  .extend({
    avatarImage: z
      .any()
      .refine((file) => file.size < MAX_FILE_SIZE, "File must be less than 1MB")
      .refine((file) => IMAGE_TYPES.includes(file.type)),
  });

export type UserUpdateForm = z.input<typeof userUpdateFormSchema>;
