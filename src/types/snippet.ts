import { z } from "zod";

// Base snippet schema
export const snippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  code: z.string(),
  language: z.string(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  isSynced: z.boolean(),
  gistId: z.string().optional(),
});

// Infer TypeScript type from schema
export type Snippet = z.infer<typeof snippetSchema>;

// Create snippet input schema (without auto-generated fields)
export const createSnippetSchema = snippetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isSynced: true,
  gistId: true,
});

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>; 