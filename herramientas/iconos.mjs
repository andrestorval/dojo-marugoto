/* iconos.mjs — genera los iconos de la PWA sin dependencias.
 *
 * Uso:  node herramientas/iconos.mjs
 *
 * Escribe src/pwa/icons/icono-192.png y icono-512.png, que quedan versionados.
 * Se corre una sola vez; solo hay que repetirlo si cambia el dibujo.
 *
 * Un PNG es una firma, tres bloques y un CRC por bloque, y `zlib` viene con
 * Node: escribirlo a mano cuesta menos que la primera dependencia del
 * proyecto (plano 6.1). El dibujo es un torii sobre el azul de la marca,
 * hecho solo con rectángulos, porque dibujar 道場 exigiría una tipografía y
 * eso sí sería una dependencia.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'src', 'pwa', 'icons');

/* ── CRC32, el que exige el formato PNG ────────────────────────── */
const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloque(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

/* ── PNG de 8 bits con alfa ────────────────────────────────────── */
function png(ancho, alto, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8;        /* bits por canal */
  ihdr[9] = 6;        /* color RGBA */
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  /* cada línea lleva delante su byte de filtro, aquí siempre 0 */
  const crudo = Buffer.alloc(alto * (1 + ancho * 4));
  for (let y = 0; y < alto; y++) {
    crudo[y * (1 + ancho * 4)] = 0;
    rgba.copy(crudo, y * (1 + ancho * 4) + 1, y * ancho * 4, (y + 1) * ancho * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque('IHDR', ihdr),
    bloque('IDAT', deflateSync(crudo, { level: 9 })),
    bloque('IEND', Buffer.alloc(0)),
  ]);
}

/* ── el dibujo ─────────────────────────────────────────────────── */

const FONDO = [0x17, 0x51, 0x6b];   /* --ai del CSS, el azul de la marca */
const TINTA = [0xff, 0xff, 0xff];

function dibujar(n) {
  const px = Buffer.alloc(n * n * 4);
  const poner = (x, y, c) => {
    if (x < 0 || y < 0 || x >= n || y >= n) return;
    const i = (y * n + x) * 4;
    px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255;
  };
  const rect = (x0, y0, w, h, c) => {
    for (let y = Math.round(y0); y < Math.round(y0 + h); y++)
      for (let x = Math.round(x0); x < Math.round(x0 + w); x++) poner(x, y, c);
  };

  rect(0, 0, n, n, FONDO);

  /* Torii: dos postes, el dintel con vuelo a los lados y el travesaño.
     Todas las medidas en fracciones del lado, para que los dos tamaños
     salgan idénticos. */
  const g = n / 32;                       /* grosor base */
  const izq = n * 0.28, der = n * 0.72;   /* eje de cada poste */
  const arriba = n * 0.24, abajo = n * 0.78;

  rect(izq - g, arriba, g * 2, abajo - arriba, TINTA);        /* poste izquierdo */
  rect(der - g, arriba, g * 2, abajo - arriba, TINTA);        /* poste derecho */
  rect(n * 0.14, arriba - g * 2, n * 0.72, g * 2, TINTA);     /* dintel, con vuelo */
  rect(n * 0.20, arriba + g * 3, n * 0.60, g * 1.6, TINTA);   /* travesaño */

  return png(n, n, px);
}

mkdirSync(DESTINO, { recursive: true });
for (const n of [192, 512]) {
  const archivo = join(DESTINO, 'icono-' + n + '.png');
  const datos = dibujar(n);
  writeFileSync(archivo, datos);
  console.log('icono-' + n + '.png  ' + (datos.length / 1024).toFixed(1) + ' KB');
}
