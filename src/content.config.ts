import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const deporte = z.enum(['bici', 'correr']);

// Una salida = un archivo .md en src/content/salidas/
// Cada salida lleva su ruta dentro (distancia, desnivel, GPX...), así solo hay un sitio donde escribir.
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
    enlace: z.string().url().optional(), // evento en Strava, WhatsApp...
    resumen: z.string(),

    // ---- La ruta de la salida (todo opcional salvo que lo sepas) ----
    // bici: carretera, gravel, mtb, paseo · correr: urbano, trail, pista
    tipo: z.enum(['carretera', 'gravel', 'mtb', 'paseo', 'urbano', 'trail', 'pista']).optional(),
    distanciaKm: z.number().optional(),
    desnivelM: z.number().optional(), // si no se sabe, se omite la línea
    dificultad: z.enum(['fácil', 'media', 'difícil']).optional(),
    ritmo: z.string().optional(), // por ejemplo "social" o "suave"
    gpx: z.string().optional(), // nombre del archivo dentro de public/gpx/
    enlaceRuta: z.string().url().optional(), // la ruta en Strava, Komoot, Wikiloc...
  }),
});

export const collections = { salidas };
