
import * as z from "zod";

export const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  battingHand: z.enum(["Right", "Left", "None"]),
  bowlingHand: z.enum(["Right", "Left", "None"]),
  bowlingType: z.enum([
    "Off Spin",
    "Leg Spin",
    "Left-arm Orthodox",
    "Left-arm Chinaman",
    "Medium Fast",
    "Fast",
    "None"
  ]),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
