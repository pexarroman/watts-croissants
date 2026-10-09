# Watts & Croissants · propuesta de web (bici y running)

Web estática hecha con [Astro](https://astro.build), pensada para publicarse gratis en Cloudflare Pages.
**Es una propuesta no oficial**: muestra un aviso en todas las páginas y no se indexa en buscadores.
Los datos de los tres eventos de ejemplo salen del club en Strava; revísalos antes de enseñarla.

## Qué cambiar primero

1. `astro.config.mjs` → línea `site:` con la dirección real de Cloudflare (ahora pone `https://grupociclista.pages.dev`).
2. `public/robots.txt` → la misma dirección en la línea `Sitemap:`.
3. `src/config.ts` → email o Instagram de contacto, y `oficial: true` solo si los creadores del club la aprueban
   (así desaparece el aviso). El logo del club NO está puesto: si te dan permiso, copia el archivo a `public/`
   y escribe su ruta en `logo:`.

## Cada semana

### Añadir una salida
1. Copia `plantillas/salida.md` a `src/content/salidas/` con un nombre tipo `2026-11-01-nombre.md`.
2. Rellena los datos (`deporte: bici` o `deporte: correr`) y haz commit.
   Los eventos que se repiten cada semana llevan `repetir: semanal` y se actualizan solos.

### Añadir una ruta
1. Copia `plantillas/ruta.md` a `src/content/rutas/nombre-de-la-ruta.md`.
2. Opcional: sube el GPX a `public/gpx/` (exportado de Strava, Komoot o Wikiloc) y pon `gpx: "nombre.gpx"` en la ruta.
   Con GPX la ficha muestra mapa y perfil de desnivel. Sin GPX sale solo la ficha.

### Añadir las fotos de una salida
1. Crea la carpeta `src/assets/salidas/<mismo-nombre-que-el-archivo-de-la-salida-sin-.md>/`
   (ejemplo: `src/assets/salidas/2026-10-10-aranjuez-ida-y-vuelta/`).
2. Sube dentro las fotos `.jpg`, `.png` o `.webp` (los `.heic` del iPhone hay que convertirlos antes).
3. Salen solas en la galería de esa salida, ordenadas por nombre (`01.jpg`, `02.jpg`...).

Cada commit en GitHub publica la web sola en 1-2 minutos.

> Qué es "próxima" y qué es "anterior" se calcula al publicar. Una salida que ya pasó seguirá apareciendo
> como próxima hasta la siguiente publicación (las semanales avanzan solas).

## Reglas de los archivos (si no, la publicación falla)

- Cada archivo empieza y termina el bloque de datos con una línea `---`, y la primera línea del archivo es esa.
- `deporte`: solo `bici` o `correr`.
- `tipo`: bici → `carretera`, `gravel`, `mtb`, `paseo` · correr → `urbano`, `trail`, `pista`.
- `dificultad` (opcional): `fácil`, `media` o `difícil`.
- Kilómetros y desnivel, solo números (`100`, `12.5`), sin "km" ni "m".
- Textos entre comillas rectas `"..."`, no comillas curvas.
- Los enlaces se escriben como texto plano `"https://..."`, no como enlaces de Markdown.

## Probar en tu ordenador (opcional)

Necesitas Node 22.12 o superior.

    npm install
    npm run dev       # web en http://localhost:4321
    npm run build     # genera la carpeta dist/

## Publicar en Cloudflare Pages

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Variable de entorno: `NODE_VERSION` = `22`
