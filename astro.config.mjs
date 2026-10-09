import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANTE: cambia esta URL por la de tu web cuando Cloudflare te la dé
// (por ejemplo https://grupociclista.pages.dev). Se usa para el sitemap,
// las vistas previas de WhatsApp/redes y el calendario.
export default defineConfig({
  site: 'https://grupociclista.pages.dev',
  integrations: [sitemap()],
});
