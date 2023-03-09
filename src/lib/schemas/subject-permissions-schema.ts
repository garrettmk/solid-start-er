import { z } from "zod";

export const subjectPermissionSchema = z.object({
  subject: z.string().min(3),
  action: z.string().min(3),
});

export type SubjectPermissionData = z.input<typeof subjectPermissionSchema>;
