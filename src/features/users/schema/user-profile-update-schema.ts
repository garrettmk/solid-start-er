import { z } from "zod";

export const MAX_FILE_SIZE = 1e6; // 1MB
export const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const userProfileUpdateSchemaBase = z.object({
  fullName: z
    .string()
    .min(3, "Please enter at least 3 characters")
    .max(30, "Please, no more than 30 characters")
    .regex(
      /^[a-zA-Z' \p{L}-]+$/,
      "Names can include any Unicode letter, hyphen, or apostrophe"
    )
    .optional(),

  casualName: z
    .string()
    .min(3, "Please enter at least 3 characters")
    .max(30, "Please, no more than 30 characters")
    .regex(
      /^[a-zA-Z' \p{L}-]+$/,
      "Names can include any Unicode letter, hyphen, or apostrophe"
    )
    .optional(),

  avatarImage: z
    .object({
      name: z.string(),
      size: z.number().max(MAX_FILE_SIZE, "The maximum file size is 1MB"),
      type: z.enum(IMAGE_TYPES, {
        description: "Allowed file types are JPEG/JPG, PNG or WEBP",
      }),
    })
    .optional(),

  avatarImageData: z.string().optional(),

  wantsMarketing: z.boolean().optional(),
});

export const userProfileUpdateSchema = userProfileUpdateSchemaBase.refine(
  ({ avatarImage, avatarImageData }) =>
    avatarImage || avatarImageData ? avatarImage && avatarImageData : true
);

export type UserProfileUpdate = z.input<typeof userProfileUpdateSchema>;
