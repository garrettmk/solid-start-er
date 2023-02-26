import { z } from "zod";

export const selectProfessionSchema = z.object({
  profession: z.enum(["human", "robot"], {
    required_error: "Please choose a profession",
  }),
});

export type SelectProfessionData = z.input<typeof selectProfessionSchema>;
