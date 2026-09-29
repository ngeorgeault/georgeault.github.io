import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    author: z.string().default('Nicolas Georgeault'),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    legacyUrl: z.string(),
    sourceUrl: z.string().url(),
    okfSource: z.string().startsWith('knowledge/okf/'),
    migrationStatus: z.enum(['sample', 'full']).default('sample'),
  }),
});

export const collections = { articles };
