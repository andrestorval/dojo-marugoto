/* claves.mjs — asigna la clave estable `k` a frases, huecos y armar.
 *
 * Uso:  node herramientas/claves.mjs [--unidad=8] [--tabla]
 *
 * Regla, y es la que hace que el historial sobreviva a la revisión humana:
 * el script SOLO rellena vacíos. Nunca renumera, nunca toca una `k` que ya
 * existe, nunca reordena. Se puede correr las veces que haga falta después de
 * insertar, borrar o corregir ejercicios; los que ya tenían clave la conservan
 * y los nuevos toman el siguiente número libre.
 *
 * Por eso la clave no se deriva del contenido: un hash de la frase cambiaría
 * cada vez que se corrige una tilde o una partícula, que es justo lo que pasa
 * durante la revisión (plano 1.3).
 *
 * `--tabla` genera además contenido/migracion-t8.json, la tabla que traduce el
 * id posicional antiguo (`h:7`) al id nuevo (`h:8:h8-08`). Solo es correcta si
 * los arreglos están en el orden del archivo congelado, así que se genera una
 * vez, antes de cualquier edición de contenido, y queda versionada (plano 5.3).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1] ?? d;
const tiene = (n) => args.includes('--' + n);

const unidad = Number(flag('unidad', '8'));
const ARREGLOS = [
  { nombre: 'frases', letra: 'f' },
  { nombre: 'huecos', letra: 'h' },
  { nombre: 'armar', letra: 'a' },
];

export const FORMATO_CLAVE = /^[fha]\d+-\d{2,}$/;

/* Recorre el texto contando llaves y respetando cadenas y comentarios, y
   devuelve el tramo [inicio, fin) de cada entrada de primer nivel del arreglo
   `nombre`. Trabajar sobre el texto y no sobre el objeto es lo que permite
   conservar comentarios, comas finales y el formato tal como los escribió
   quien autoró la unidad. */
export function entradasDe(texto, nombre) {
  const abre = texto.indexOf('\n  ' + nombre + ': [');
  if (abre < 0) return null;
  let i = texto.indexOf('[', abre) + 1;

  const entradas = [];
  let prof = 0, inicio = -1;
  let cadena = null, linea = false, bloque = false;

  for (; i < texto.length; i++) {
    const c = texto[i], d = texto[i + 1];

    if (linea) { if (c === '\n') linea = false; continue; }
    if (bloque) { if (c === '*' && d === '/') { bloque = false; i++; } continue; }
    if (cadena) {
      if (c === '\\') i++;
      else if (c === cadena) cadena = null;
      continue;
    }
    if (c === '/' && d === '/') { linea = true; i++; continue; }
    if (c === '/' && d === '*') { bloque = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { cadena = c; continue; }

    if (c === '{') { if (prof === 0) inicio = i; prof++; continue; }
    if (c === '}') {
      prof--;
      if (prof === 0) entradas.push({ inicio, fin: i + 1 });
      continue;
    }
    if (c === ']' && prof === 0) break;      // fin del arreglo
  }
  return entradas;
}

/* Devuelve la `k` de una entrada, o null si no la tiene. Busca la clave al
   principio del objeto, que es donde la escribe este script. */
const claveDe = (txt) => (txt.match(/^\{\s*k\s*:\s*"([^"]*)"/) || [])[1] || null;

export function asignarClaves(texto, unidad) {
  const informe = { asignadas: 0, existentes: 0, claves: {} };

  for (const { nombre, letra } of ARREGLOS) {
    const entradas = entradasDe(texto, nombre);
    if (!entradas) continue;

    const usadas = new Set();
    for (const e of entradas) {
      const k = claveDe(texto.slice(e.inicio, e.fin));
      if (k) usadas.add(k);
    }

    /* El siguiente número libre parte del máximo ya usado, nunca de la
       cantidad de entradas: si se borró un ejercicio, su número no se recicla. */
    let siguiente = 0;
    for (const k of usadas) {
      const n = Number(k.slice(k.indexOf('-') + 1));
      if (Number.isFinite(n) && n > siguiente) siguiente = n;
    }

    const claves = [];
    /* De atrás hacia adelante: insertar texto no mueve los índices anteriores */
    const nuevas = new Map();
    for (const e of entradas) {
      const txt = texto.slice(e.inicio, e.fin);
      let k = claveDe(txt);
      if (k) {
        informe.existentes++;
      } else {
        k = letra + unidad + '-' + String(++siguiente).padStart(2, '0');
        nuevas.set(e.inicio, k);
        informe.asignadas++;
      }
      claves.push(k);
    }
    for (const e of [...entradas].reverse()) {
      const k = nuevas.get(e.inicio);
      if (!k) continue;
      texto = texto.slice(0, e.inicio + 1) + ' k:"' + k + '",' + texto.slice(e.inicio + 1);
    }

    const repes = claves.filter((k, i) => claves.indexOf(k) !== i);
    if (repes.length) throw new Error('claves repetidas en ' + nombre + ': ' + repes.join(', '));
    const malas = claves.filter((k) => !FORMATO_CLAVE.test(k));
    if (malas.length) throw new Error('claves con formato inválido en ' + nombre + ': ' + malas.join(', '));

    informe.claves[letra] = claves;
  }
  return { texto, informe };
}

/* ── ejecución ─────────────────────────────────────────────────── */

if (process.argv[1] && process.argv[1].endsWith('claves.mjs')) {
  const ruta = join(RAIZ, 'contenido', 'u' + unidad + '.js');
  if (!existsSync(ruta)) {
    console.error('no existe ' + ruta);
    process.exit(1);
  }
  const antes = readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n');
  const { texto, informe } = asignarClaves(antes, unidad);

  if (texto !== antes) writeFileSync(ruta, texto, 'utf8');
  console.log(
    'u' + unidad + '.js: ' + informe.asignadas + ' claves asignadas, ' +
    informe.existentes + ' ya existían'
  );

  if (tiene('tabla')) {
    const destino = join(RAIZ, 'contenido', 'migracion-t8.json');
    if (existsSync(destino)) {
      console.error(
        'migracion-t8.json ya existe y no se regenera: la tabla solo es correcta\n' +
        'si se genera sobre el orden congelado (plano 5.3). Bórrala a mano si de\n' +
        'verdad hay que rehacerla, y vuelve a comprobarla contra el archivo congelado.'
      );
      process.exit(1);
    }
    writeFileSync(
      destino,
      JSON.stringify(
        {
          nota: 'indice posicional del archivo congelado -> clave estable. No editar a mano.',
          unidad,
          f: informe.claves.f || [],
          h: informe.claves.h || [],
          a: informe.claves.a || [],
        },
        null,
        1
      ) + '\n',
      'utf8'
    );
    console.log(
      'contenido/migracion-t8.json: ' +
      ['f', 'h', 'a'].map((l) => l + '=' + (informe.claves[l] || []).length).join(' ')
    );
  }
}
