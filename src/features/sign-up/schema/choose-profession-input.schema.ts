import { z } from "zod";

export const chooseProfessionInputSchema = z.object({
  profession: z.enum(["human", "robot"], {
    required_error: "Please choose a profession",
  }),
});

export type ChooseProfessionInput = z.input<typeof chooseProfessionInputSchema>;
