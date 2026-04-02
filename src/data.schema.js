import { z } from "zod";

export const dataSchema = z.object({
  active_time: z.number().int(),
  hdop: z.number().optional(),
  satellites: z.number().int().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  captured_at: z.number().int().optional(),
  powered_at: z.number().int(),
  status: z.string()
});