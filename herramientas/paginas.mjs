/* paginas.mjs — saca páginas sueltas del libro escaneado como imagen.
 *
 * Uso:  node herramientas/paginas.mjs --pdf="..\App\Marugoto A2B1.pdf" --de=100 --a=110
 *       node herramientas/paginas.mjs --lista           (cuántas páginas hay)
 *
 * El libro es un escaneo: 167 páginas, 167 imágenes, cero fuentes. `pdftotext`
 * no saca nada y `pdftoppm` no viene con Git para Windows. Pero cada página es
 * una sola imagen incrustada, así que se pueden extraer sin renderizar nada y
 * sin instalar nada.
 *
 * Dos formatos y ninguno necesita descodificar la imagen:
 *   DCTDecode   el stream ya es un JPEG: se escribe tal cual.
 *   FlateDecode con Predictor 15 los datos inflados son exactamente
 *               scanlines con byte de filtro, que es lo que un PNG lleva
 *               dentro. Se vuelven a desinflar y se envuelven en PNG.
 *
 * Las páginas salen a dist/paginas/, que no se versiona: son del libro.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync, deflateSync } from 'node:zlib';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1] ?? d;
const tiene = (n) => args.includes('--' + n);

const PDF = flag('pdf', join(RAIZ, '..', 'App', 'Marugoto A2B1.pdf'));
const DESTINO = join(RAIZ, 'dist', 'paginas');

const datos = readFileSync(PDF);

/* ── localizar las imágenes en el orden en que aparecen ────────── */

/* Cada página del escaneo es un único XObject de imagen. Se recorren en orden
   de archivo, que en un escaneo coincide con el orden de las páginas; la
   comprobación es leer una y ver si el número impreso cuadra. */
function imagenes() {
  const out = [];
  const marca = Buffer.from('/Subtype');
  const OBJ = Buffer.from(' obj');
  const STREAM = Buffer.from('stream');
  let i = 0;

  while ((i = datos.indexOf(marca, i)) !== -1) {
    if (!/^\/Subtype\s*\/Image/.test(datos.toString('latin1', i, i + 20))) { i += 8; continue; }

    /* El diccionario es el del objeto que contiene este /Subtype, no lo que
       haya cerca: se acota entre el " obj" anterior y el "stream" siguiente.
       Sin acotarlo, el /Filter que se lee puede ser el del objeto vecino. */
    const abre = datos.lastIndexOf(OBJ, i);
    const cierra = datos.indexOf(STREAM, i);
    if (abre < 0 || cierra < 0) { i += 8; continue; }
    const dic = datos.toString('latin1', abre, cierra);

    const num = (re) => { const m = dic.match(re); return m ? +m[1] : null; };
    /* /Filter puede ser un nombre suelto o un arreglo; interesa el último,
       que es el que se aplica al salir */
    const filtros = [...dic.matchAll(/\/(DCTDecode|FlateDecode|JPXDecode|CCITTFaxDecode|JBIG2Decode|RunLengthDecode|ASCII85Decode)/g)]
      .map((m) => m[1]);
    const filtro = filtros[filtros.length - 1];
    const largo = num(/\/Length\s+(\d+)/);
    if (!filtro || !largo) { i = cierra + 6; continue; }

    let ini = cierra + 6;
    if (datos[ini] === 0x0d) ini++;
    if (datos[ini] === 0x0a) ini++;

    out.push({
      filtro, filtros, largo, ini,
      ancho: num(/\/Width\s+(\d+)/),
      alto: num(/\/Height\s+(\d+)/),
      color: (dic.match(/\/ColorSpace\s*\/(\w+)/) || [])[1],
      predictor: num(/\/Predictor\s+(\d+)/),
    });
    i = ini + largo;
  }
  return out;
}

/* ── PNG, el mismo escritor de iconos.mjs ──────────────────────── */

const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (b) => {
  let c = 0xffffffff;
  for (const x of b) c = TABLA_CRC[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const bloque = (tipo, d) => {
  const l = Buffer.alloc(4); l.writeUInt32BE(d.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), d]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([l, cuerpo, c]);
};

/* `crudo` ya viene como scanlines con byte de filtro: es lo que PNG guarda */
function pngDesdeScanlines(ancho, alto, canales, crudo) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0); ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8; ihdr[9] = canales === 1 ? 0 : 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque('IHDR', ihdr),
    bloque('IDAT', deflateSync(crudo, { level: 6 })),
    bloque('IEND', Buffer.alloc(0)),
  ]);
}

/* ── ejecución ─────────────────────────────────────────────────── */

const lista = imagenes();

if (tiene('lista')) {
  const porFiltro = {};
  for (const im of lista) porFiltro[im.filtro] = (porFiltro[im.filtro] || 0) + 1;
  console.log(lista.length + ' imágenes en ' + PDF);
  console.log('  por filtro: ' + Object.entries(porFiltro).map(([k, v]) => k + '=' + v).join(' '));
  console.log('  primera: ' + lista[0].ancho + '×' + lista[0].alto + ' ' + lista[0].color);
  process.exit(0);
}

const de = Number(flag('de', '1'));
const a = Number(flag('a', String(de)));
mkdirSync(DESTINO, { recursive: true });

for (let p = de; p <= a && p <= lista.length; p++) {
  const im = lista[p - 1];
  const bruto = datos.subarray(im.ini, im.ini + im.largo);
  let nombre, salida;

  if (im.filtro === 'DCTDecode') {
    nombre = 'p' + String(p).padStart(3, '0') + '.jpg';
    salida = bruto;
  } else if (im.filtro === 'FlateDecode' && im.predictor >= 10) {
    const canales = im.color === 'DeviceGray' ? 1 : 3;
    nombre = 'p' + String(p).padStart(3, '0') + '.png';
    salida = pngDesdeScanlines(im.ancho, im.alto, canales, inflateSync(bruto));
  } else {
    console.log('  página ' + p + ': filtro ' + im.filtro + ' sin predictor, se salta');
    continue;
  }

  writeFileSync(join(DESTINO, nombre), salida);
  console.log('  ' + nombre + '  ' + im.ancho + '×' + im.alto + '  ' +
    (salida.length / 1024).toFixed(0) + ' KB');
}
