import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.string().email(),
});

export type InviteUser = z.infer<typeof inviteUserSchema>;
