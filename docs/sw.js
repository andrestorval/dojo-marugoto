/* Service worker de Dojo Marugoto.
   Es una plantilla: el build sustituye los dos marcadores de abajo por el
   sello de la compilacion y por la lista de archivos a precargar.

   Estrategia de precarga completa. Con seis archivos y sin dependencias, la
   app queda utilizable sin conexion desde la primera visita, y es la
   estrategia mas simple que existe (plano 6.4). El progreso vive en
   localStorage y nada de esto lo toca. */

const CACHE = 'dojo-88f6b217';
const ARCHIVOS = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./contenido.js",
  "./manifest.webmanifest",
  "./icons/icono-192.png",
  "./icons/icono-512.png"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)));
});

self.addEventListener('activate', (e) => {
  /* se borra toda cache cuyo nombre no sea el sello vigente */
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let mismoOrigen = false;
  try { mismoOrigen = new URL(req.url).origin === self.location.origin; } catch (err) { return; }
  if (!mismoOrigen) return;   /* cualquier otra peticion pasa directa, sin cachear */
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});

/* La app avisa de la version nueva con su propio dialogo y, si el usuario
   acepta, manda este mensaje (plano 6.4). */
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
