import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const deporte = z.enum(['bici', 'correr']);

// Una ruta = un archivo .md en src/content/rutas/
const rutas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rutas' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    deporte,
    // bici: carretera, gravel, mtb, paseo · correr: urbano, trail, pista
    tipo: z.enum(['carretera', 'gravel', 'mtb', 'paseo', 'urbano', 'trail', 'pista']),
    distanciaKm: z.number(),
    desnivelM: z.number().optional(), // si no se sabe, se omite la línea
    dificultad: z.enum(['fácil', 'media', 'difícil']).optional(),
    ritmo: z.string().optional(), // por ejemplo "social" o "suave"
    inicio: z.string(), // dónde empieza
    gpx: z.string().optional(), // nombre del archivo dentro de public/gpx/
    enlace: z.string().url().optional(), // Strava, Komoot, Wikiloc...
    publicada: z.coerce.date(),
  }),
});

// Una salida = un archivo .md en src/content/salidas/
// Las fotos NO se ponen aquí: basta con meterlas en src/assets/salidas/<nombre-del-archivo>/
const salidas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/salidas' }),
  schema: z.object({
    titulo: z.string(),
    deporte,
    fecha: z.coerce.date(), // en las que se repiten, la fecha de la primera
    hora: z.string(), // "09:00"
    repetir: z.enum(['semanal']).optional(), // para eventos que se repiten cada semana
    duracionH: z.number().optional(),
    puntoEncuentro: z.string(),
    mapsUrl: z.string().url().optional(), // enlace de Google Maps al punto de encuentro
    ruta: z.string().optional(), // nombre del archivo de la ruta, sin .md
    enlace: z.string().url().optional(), // evento en Strava, WhatsApp...
    resumen: z.string(),
  }),
});

export const collections = { rutas, salidas };
