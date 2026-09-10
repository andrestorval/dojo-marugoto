/* zip.mjs — lector mínimo de zip, para leer los xlsx sin instalar nada.
 *
 * Un xlsx es un zip con XML dentro. Node trae `zlib`, así que leer el
 * directorio central y descomprimir con `inflateRawSync` cuesta menos que la
 * primera dependencia del proyecto (plano 6.1 y 7.1).
 *
 * Solo entiende lo que estos cuatro archivos usan: entradas guardadas (método
 * 0) o desinfladas (método 8), sin cifrado y sin zip64. Si algún día un
 * archivo no encaja, la vía de respaldo documentada es exportar esa hoja a CSV
 * desde Excel una sola vez.
 */

import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const FIRMA_FIN = 0x06054b50;   /* end of central directory */
const FIRMA_CEN = 0x02014b50;   /* central directory header */

export function abrirZip(ruta) {
  const buf = readFileSync(ruta);

  /* El final del directorio central está al final del archivo, después de un
     comentario de largo variable: se busca su firma hacia atrás. */
  let fin = -1;
  for (let i = buf.length - 22; i >= 0 && i >= buf.length - 22 - 65535; i--) {
    if (buf.readUInt32LE(i) === FIRMA_FIN) { fin = i; break; }
  }
  if (fin < 0) throw new Error('no es un zip: falta el fin del directorio central');

  const total = buf.readUInt16LE(fin + 10);
  let p = buf.readUInt32LE(fin + 16);

  const entradas = new Map();
  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(p) !== FIRMA_CEN) throw new Error('directorio central corrupto');
    const metodo   = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nombreL  = buf.readUInt16LE(p + 28);
    const extraL   = buf.readUInt16LE(p + 30);
    const comentL  = buf.readUInt16LE(p + 32);
    const offset   = buf.readUInt32LE(p + 42);
    const nombre   = buf.toString('utf8', p + 46, p + 46 + nombreL);
    entradas.set(nombre, { metodo, compSize, offset });
    p += 46 + nombreL + extraL + comentL;
  }

  /* El largo real de la cabecera local solo se sabe leyéndola: los campos de
     nombre y extra pueden diferir de los del directorio central. */
  const leer = (nombre) => {
    const e = entradas.get(nombre);
    if (!e) throw new Error('no está en el zip: ' + nombre);
    const nL = buf.readUInt16LE(e.offset + 26);
    const xL = buf.readUInt16LE(e.offset + 28);
    const ini = e.offset + 30 + nL + xL;
    const datos = buf.subarray(ini, ini + e.compSize);
    if (e.metodo === 0) return datos;
    if (e.metodo === 8) return inflateRawSync(datos);
    throw new Error('método de compresión no soportado (' + e.metodo + ') en ' + nombre);
  };

  return {
    nombres: () => [...entradas.keys()],
    tiene: (n) => entradas.has(n),
    buffer: leer,
    texto: (n) => leer(n).toString('utf8'),
  };
}
