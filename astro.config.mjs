import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANTE: cambia esta URL por la de tu web cuando Cloudflare te la dé
// (por ejemplo https://watts-croissants.pages.dev). Se usa para el sitemap,
// las vistas previas de WhatsApp/redes y el calendario.
export default defineConfig({
  site: 'https://watts-croissants.pages.dev',
  integrations: [sitemap()],
});
