/* motor.mjs — carga el motor de src/ en un contexto sin DOM.
 *
 * Los archivos de src/js son JavaScript clásico que el build concatena; aquí
 * se concatenan igual, en el mismo orden, y se corren en un vm. Solo se
 * cargan los archivos que no tocan el DOM ni localStorage, que son los que
 * las pruebas necesitan.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const leer = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

const SIN_DOM = ['00-tablas.js', '05-contenido.js', '10-conjugador.js', '20-normalizador.js'];

export function cargarMotor({ unidades = null, archivos = SIN_DOM } = {}) {
  const cont = join(RAIZ, 'contenido');
  const deContenido = ['catalogo.js'].concat(
    readdirSync(cont)
      .filter((f) => /^u\d+\.js$/.test(f))
      .filter((f) => !unidades || unidades.includes(Number(f.slice(1, -3))))
      .sort((a, b) => Number(a.slice(1, -3)) - Number(b.slice(1, -3)))
  );

  const fuente =
    deContenido.map((f) => leer(join(cont, f))).join('\n') +
    '\n' +
    archivos.map((f) => leer(join(RAIZ, 'src', 'js', f))).join('\n') +
    `\n;({
      CONTENIDO, UNIDADES, FORMAS, CATEGORIAS,
      TEMA, VERBOS, VOCAB, FRASES, HUECOS, ARMAR,
      conjugar, conKanji, aceptadasDeConjugacion, reglaDe,
      romajiAKana, kataAHira, expandirChoon, quitarLargas,
      normEstricta, normSuelta, revisar
    });`;

  return vm.runInContext(fuente, vm.createContext(Object.create(null)), {
    filename: 'motor',
    timeout: 10000,
  });
}

export const vector = () =>
  JSON.parse(leer(join(RAIZ, 'pruebas', 'vector-conjugacion.json')));
