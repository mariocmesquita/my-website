import { z } from "zod";

export const LogEntrySchema = z.object({
  id: z.uuid(),
  level: z.string(),
  eventType: z.string(),
  message: z.string(),
  ip: z.string().nullable(),
  method: z.string().nullable(),
  path: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.string(),
});

export const LogListResponseSchema = z.object({
  items: z.array(LogEntrySchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;
export type LogListResponse = z.infer<typeof LogListResponseSchema>;
