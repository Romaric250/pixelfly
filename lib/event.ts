import { z } from "zod";

const eventSchema = z.object({
  name: z.enum([
    "copy_npm_command",
    "copy_touch_command",
    "copy_usage_code",
    "copy_source_code",
  ]),
  properties: z
    .record(z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export type Event = z.infer<typeof eventSchema>;
