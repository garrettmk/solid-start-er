import { z } from "zod";
import {
  updateProfileSchemaBase,
  MAX_FILE_SIZE,
  IMAGE_TYPES,
} from "~/lib/schemas/update-profile";

export const updateProfileFormSchema = updateProfileSchemaBase
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

export type UpdateProfileFormData = z.input<typeof updateProfileFormSchema>;
