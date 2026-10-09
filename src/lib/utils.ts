import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

// ---------- Fechas ----------
// Las fechas del frontmatter (2026-10-18) se leen como UTC; las mostramos en UTC
// para que nunca se desplacen un día por la zona horaria.

export function formatoFecha(d: Date, opciones: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    ...opciones,
  }).format(d);
}

export const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// 1400 -> "1.400"
export const miles = (n: number) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(n);

const DIA = 86_400_000;
const inicioHoy = () => new Date(new Date().toISOString().slice(0, 10)); // hoy a las 00:00 UTC

// ---------- Salidas ----------
type Salida = CollectionEntry<'salidas'>;

// Fecha de la próxima vez que ocurre la salida (las semanales avanzan solas de semana en semana)
export function fechaEfectiva(s: Salida): Date {
  let d = new Date(s.data.fecha);
  if (s.data.repetir === 'semanal') {
    const hoy = inicioHoy().getTime();
    while (d.getTime() < hoy) d = new Date(d.getTime() + 7 * DIA);
  }
  return d;
}

export const esProxima = (s: Salida) => fechaEfectiva(s).getTime() >= inicioHoy().getTime();

export function proximas(todas: Salida[]) {
  return todas.filter(esProxima).sort((a, b) => fechaEfectiva(a).getTime() - fechaEfectiva(b).getTime());
}

export function pasadas(todas: Salida[]) {
  return todas.filter((s) => !esProxima(s)).sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
}

// "Todos los lunes" para las salidas semanales
export function textoRepeticion(s: Salida) {
  if (s.data.repetir !== 'semanal') return null;
  const dia = new Intl.DateTimeFormat('es-ES', { weekday: 'long', timeZone: 'UTC' }).format(s.data.fecha);
  return `Todos los ${dia}`;
}

// ---------- Fotos ----------
// Las fotos se descubren solas a partir de las carpetas:
//   src/assets/salidas/<id-de-la-salida>/*.jpg
//   src/assets/rutas/<id-de-la-ruta>.jpg

const fotosSalidas = import.meta.glob<ImageMetadata>('/src/assets/salidas/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
});
const fotosRutas = import.meta.glob<ImageMetadata>('/src/assets/rutas/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
});

export function fotosDeSalida(id: string): ImageMetadata[] {
  return Object.entries(fotosSalidas)
    .filter(([ruta]) => ruta.split('/').at(-2) === id)
    .sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true }))
    .map(([, img]) => img);
}

export function portadaDeRuta(id: string): ImageMetadata | undefined {
  const hit = Object.entries(fotosRutas).find(([ruta]) => path.parse(ruta).name === id);
  return hit?.[1];
}

// ---------- GPX ----------
export type Punto = { lat: number; lon: number; ele: number | null };

export function leerGpx(nombre?: string): Punto[] {
  if (!nombre) return [];
  try {
    const ruta = path.join(process.cwd(), 'public', 'gpx', nombre);
    const xml = fs.readFileSync(ruta, 'utf-8');
    const puntos: Punto[] = [];
    const re = /<trkpt\b([^>]*)>([\s\S]*?)<\/trkpt>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml))) {
      const lat = /lat="([^"]+)"/.exec(m[1]!)?.[1];
      const lon = /lon="([^"]+)"/.exec(m[1]!)?.[1];
      const ele = /<ele>([^<]+)<\/ele>/.exec(m[2]!)?.[1];
      if (lat && lon) puntos.push({ lat: +lat, lon: +lon, ele: ele ? +ele : null });
    }
    return puntos;
  } catch {
    console.warn(`[gpx] No se pudo leer public/gpx/${nombre}`);
    return [];
  }
}

// Reduce el número de puntos para que la página pese poco
export function simplificar<T>(puntos: T[], max = 600): T[] {
  if (puntos.length <= max) return puntos;
  const paso = puntos.length / max;
  const res: T[] = [];
  for (let i = 0; i < max; i++) res.push(puntos[Math.floor(i * paso)]!);
  res.push(puntos[puntos.length - 1]!);
  return res;
}

// Perfil de elevación como trazado SVG
export function perfilElevacion(puntos: Punto[], w = 640, h = 140) {
  const conEle = puntos.filter((p) => p.ele !== null);
  if (conEle.length < 2) return null;
  const s = simplificar(conEle, 300);
  const eles = s.map((p) => p.ele as number);
  const min = Math.min(...eles);
  const max = Math.max(...eles);
  const rango = Math.max(max - min, 1);
  const x = (i: number) => (i / (s.length - 1)) * w;
  const y = (e: number) => h - 8 - ((e - min) / rango) * (h - 24);
  const linea = s.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.ele as number).toFixed(1)}`).join(' ');
  return { linea, area: `${linea} L${w},${h} L0,${h} Z`, min: Math.round(min), max: Math.round(max), w, h };
}
