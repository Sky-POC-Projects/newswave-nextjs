import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(150, "Title must be at most 150 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long.").max(10000, "Content is too long (max 10,000 characters)."),
  imageUrl: z.string().url("Invalid image URL (must be a valid https:// URL).").startsWith("https://", "Image URL must start with https://").optional().or(z.literal('')),
});

export type ArticleFormData = z.infer<typeof ArticleSchema>;
