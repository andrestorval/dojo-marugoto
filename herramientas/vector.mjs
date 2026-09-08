/* vector.mjs — genera el vector de conjugación desde el archivo congelado.
 *
 * Uso:  node herramientas/vector.mjs
 *
 * Se corre una sola vez, contra fuentes-oficiales/congelado-t8.html, y su
 * salida (pruebas/vector-conjugacion.json) queda versionada. Es la red que
 * permite tocar `conjugar` en los módulos de unidad sin romper lo vigente:
 * cualquier cambio que altere una de estas salidas lo detecta node --test.
 *
 * Nunca se regenera contra src/. Si el motor nuevo no reproduce el vector,
 * el que está mal es el motor nuevo.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const congelado = readFileSync(
  join(RAIZ, 'fuentes-oficiales', 'congelado-t8.html'),
  'utf8'
).replace(/\r\n/g, '\n');

const bloques = [...congelado.matchAll(/<script>\n([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (bloques.length !== 2) {
  console.error('se esperaban 2 bloques <script> en el archivo congelado, hay ' + bloques.length);
  process.exit(1);
}

/* El bloque 1 es datos + motor y no toca el DOM. Del bloque 2 se toma solo
   el tramo anterior a MODOS, que trae reglaDe; lo que sigue sí toca el DOM. */
const corte = bloques[1].indexOf('const MODOS');
if (corte < 0) {
  console.error('no se encontró `const MODOS` en el segundo bloque');
  process.exit(1);
}

const fuente =
  bloques[0] +
  '\n' +
  bloques[1].slice(0, corte) +
  '\n;({ VERBOS, FORMAS, conjugar, conKanji, aceptadasDeConjugacion, reglaDe });';

const m = vm.runInContext(fuente, vm.createContext(Object.create(null)), {
  filename: 'congelado-t8',
  timeout: 10000,
});

const casos = [];
for (const v of m.VERBOS) {
  for (const f of m.FORMAS) {
    if (!f.c.includes(v.c)) continue;
    const salida = m.conjugar(v, f.id);
    casos.push({
      kana: v.kana,
      g: v.g,
      forma: f.id,
      salida,
      kanji: m.conKanji(v, salida),
      aceptadas: m.aceptadasDeConjugacion(v, f.id),
      regla: m.reglaDe(v, f.id),
    });
  }
}

const destino = join(RAIZ, 'pruebas', 'vector-conjugacion.json');
writeFileSync(
  destino,
  JSON.stringify(
    {
      origen: 'fuentes-oficiales/congelado-t8.html',
      verbos: m.VERBOS.length,
      formas: m.FORMAS.length,
      casos,
    },
    null,
    1
  ) + '\n',
  'utf8'
);

console.log(
  m.VERBOS.length + ' verbos × formas de su clase = ' + casos.length + ' casos → pruebas/vector-conjugacion.json'
);
