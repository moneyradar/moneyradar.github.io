import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['특징주', '공모주', '시황', '주간']),
    tags: z.array(z.string()).default([]),
    youtube: z.string().optional(),
    image: z.object({ src: z.string(), alt: z.string() }).optional(),
  }),
});

export const collections = { posts };
