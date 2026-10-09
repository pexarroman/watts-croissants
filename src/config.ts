// Datos generales de la web. Cambia aquí el nombre, los enlaces y los textos
// y se actualizarán en toda la web.

export const GRUPO = {
  nombre: 'Watts & Croissants',
  lema: 'Bici y running en un solo sitio',
  descripcion:
    'Calendario de salidas en bici y de running, rutas con mapa y GPX, y fotos de cada salida. Propuesta de web no oficial para el club Watts & Croissants.',

  // Mientras esto sea false se muestra un aviso en todas las páginas diciendo que
  // es una propuesta NO oficial. Cámbialo a true solo cuando los creadores del club
  // den su visto bueno.
  oficial: false,

  // Página del club en Strava
  enlaceClub: 'https://www.strava.com/clubs/2330406',
  textoBotonClub: 'Ver el club en Strava',

  // Grupo de WhatsApp: pega aquí el enlace de invitación (https://chat.whatsapp.com/...). Vacío = se oculta.
  whatsapp: '',

  // Contacto (déjalos vacíos para ocultarlos)
  email: '', // por ejemplo 'hola@midominio.com'
  instagram: '', // por ejemplo 'https://instagram.com/...'

  // Logo del club. Está vacío a propósito: es una marca del club y hasta que no den permiso
  // no se usa. Cuando lo tengas, copia el archivo a /public/ y pon aquí, por ejemplo, '/logo.png'
  logo: '',
};

// Los dos deportes de la web: emoji, nombre y página propia
export const DEPORTES = {
  bici: { emoji: '🚴', nombre: 'Bici', pagina: '/bici/' },
  correr: { emoji: '🏃', nombre: 'Correr', pagina: '/correr/' },
} as const;

export type Deporte = keyof typeof DEPORTES;

// Menú de navegación
export const MENU = [
  { href: '/', texto: 'Inicio' },
  { href: '/bici/', texto: '🚴 Bici' },
  { href: '/correr/', texto: '🏃 Correr' },
  { href: '/salidas/', texto: 'Salidas' },
  { href: '/propuesta/', texto: 'Propuesta' },
];
