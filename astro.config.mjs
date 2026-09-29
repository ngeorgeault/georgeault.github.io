import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'georgeault.github.io';
const isUserSite = repositoryName === 'ngeorgeault.github.io';
const base = isUserSite ? '/' : '/georgeault.github.io/';
const site = isUserSite
  ? 'https://ngeorgeault.github.io'
  : 'https://ngeorgeault.github.io/georgeault.github.io';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
