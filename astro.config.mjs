import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://moneyradar.github.io',
  integrations: [sitemap()],
});
