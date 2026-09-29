import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ngeorgeault.github.io',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
});
