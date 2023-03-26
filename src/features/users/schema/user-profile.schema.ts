import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  preferredName: z.string(),
  avatarUrl: z.string().optional(),
  avatarInitials: z.string().optional(),
  createdAt: z.string(),
  lastSignInAt: z.string().optional(),
});

export type UserProfile = z.input<typeof userProfileSchema>;
