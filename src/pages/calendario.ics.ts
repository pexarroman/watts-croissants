import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { DEPORTES, GRUPO } from '../config';

// Genera un archivo de calendario (.ics) con todas las salidas.
// Se puede descargar o suscribirse desde Google Calendar, Apple Calendar, Outlook...
// Las salidas con `repetir: semanal` se repiten cada semana.

const pad = (n: number) => String(n).padStart(2, '0');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

function local(fecha: Date, hora: string, sumarHoras = 0) {
  const [h, m] = hora.split(':').map(Number);
  const minutos = (h ?? 0) * 60 + (m ?? 0) + Math.round(sumarHoras * 60);
  const base = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), 0, minutos));
  return `${base.getUTCFullYear()}${pad(base.getUTCMonth() + 1)}${pad(base.getUTCDate())}T${pad(base.getUTCHours())}${pad(base.getUTCMinutes())}00`;
}

export const GET: APIRoute = async ({ site }) => {
  const salidas = (await getCollection('salidas')).sort((a, b) => a.data.fecha.getTime() - b.data.fecha.getTime());
  const ahora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const dominio = site ? site.hostname : 'localhost';

  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${GRUPO.nombre}//Salidas//ES`,
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${esc(GRUPO.nombre)} · Salidas`,
    'X-WR-TIMEZONE:Europe/Madrid',
  ];

  for (const s of salidas) {
    const d = s.data;
    const dep = DEPORTES[d.deporte];
    const url = site ? new URL(`/salidas/${s.id}/`, site).href : '';
    lineas.push(
      'BEGIN:VEVENT',
      `UID:${s.id}@${dominio}`,
      `DTSTAMP:${ahora}`,
      `DTSTART;TZID=Europe/Madrid:${local(d.fecha, d.hora)}`,
      // Si no se indica la duración, se deja sin hora de fin
      ...(d.duracionH !== undefined ? [`DTEND;TZID=Europe/Madrid:${local(d.fecha, d.hora, d.duracionH)}`] : []),
      ...(d.repetir === 'semanal' ? ['RRULE:FREQ=WEEKLY'] : []),
      `SUMMARY:${esc(`${dep.emoji} ${d.titulo}`)}`,
      `LOCATION:${esc(d.puntoEncuentro)}`,
      `DESCRIPTION:${esc(d.resumen + (url ? `\n${url}` : ''))}`,
      ...(url ? [`URL:${url}`] : []),
      'END:VEVENT'
    );
  }

  lineas.push('END:VCALENDAR');

  return new Response(lineas.join('\r\n'), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
