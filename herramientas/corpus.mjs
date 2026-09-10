/* corpus.mjs — arma el corpus de oraciones del libro contra el que se
 * confirman las frases de los ejercicios.
 *
 * Uso:  node herramientas/corpus.mjs [--pdf="..\App\A2-B1-ES_rev.pdf"]
 *
 * Escribe fuentes-oficiales/libro.txt, ya normalizado con las mismas funciones
 * del motor, más un índice por tema. Se corre una vez.
 *
 * QUÉ ES Y QUÉ NO ES, porque la diferencia importa:
 *
 * El libro de texto no está entre los archivos disponibles y no lo estará: la
 * Fundación Japón publica gratis los índices, no el libro. Lo que sí hay es
 * `A2-B1-ES_rev.pdf`, la guía de gramática en español, que cita una selección
 * de las oraciones del libro, y los ejemplos del índice de gramática.
 *
 * Medido sobre la unidad 8, entre las dos fuentes se confirma el 26% de las
 * oraciones de los ejercicios. El plano esperaba mucho más y por eso ponía el
 * umbral de alarma en 40% de no encontradas (sección 10). Con el corpus real
 * ese umbral no significa nada.
 *
 * Consecuencia para el validador: encontrar una oración es prueba de que está
 * en el libro; NO encontrarla no es prueba de nada. Por eso el validador lo
 * cuenta como informe y nunca como advertencia (plano 7.1: "el corpus sirve
 * para confirmar presencia, nunca para afirmar ausencia").
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1] ?? d;

const PDF = flag('pdf', join(RAIZ, '..', 'App', 'A2-B1-ES_rev.pdf'));
const TXT = join(RAIZ, 'fuentes-oficiales', 'libro.txt');
const CRUDO = join(RAIZ, 'fuentes-oficiales', 'libro-crudo.txt');

/* pdftotext viene con Git para Windows; si no está, se puede extraer el texto
   con cualquier herramienta y dejarlo en libro-crudo.txt a mano. */
function extraer() {
  if (existsSync(CRUDO)) {
    console.log('reutilizando ' + CRUDO);
    return readFileSync(CRUDO, 'utf8');
  }
  if (!existsSync(PDF)) {
    console.error('falta ' + PDF + '\nPásalo con --pdf="ruta" o deja el texto en ' + CRUDO);
    process.exit(1);
  }
  const candidatos = ['pdftotext', 'C:\\Program Files\\Git\\mingw64\\bin\\pdftotext.exe'];
  for (const exe of candidatos) {
    try {
      execFileSync(exe, ['-enc', 'UTF-8', '-nopgbrk', PDF, CRUDO], { stdio: 'ignore' });
      return readFileSync(CRUDO, 'utf8');
    } catch (e) { /* siguiente candidato */ }
  }
  console.error('no encontré pdftotext. Extrae el texto del PDF a mano y déjalo en ' + CRUDO);
  process.exit(1);
}

/* Las mismas funciones del motor, para que el corpus y las respuestas se
   comparen con el mismo criterio. Se cargan del propio src. */
const src = (f) => readFileSync(join(RAIZ, 'src', 'js', f), 'utf8');
const motor = new Function(
  src('00-tablas.js') + src('20-normalizador.js') +
  '\nreturn { normEstricta };'
)();

const crudo = extraer();

/* El PDF trae el material agrupado por "トピック N". Se corta ahí para poder
   confirmar por tema y no solo en bloque. */
const marcas = [...crudo.matchAll(/トピック\s*(\d+)/g)];
const porTema = {};
for (let i = 0; i < marcas.length; i++) {
  const n = +marcas[i][1];
  if (n < 1 || n > 9) continue;
  const ini = marcas[i].index;
  const fin = i + 1 < marcas.length ? marcas[i + 1].index : crudo.length;
  const trozo = motor.normEstricta(crudo.slice(ini, fin).replace(/\s+/g, ''));
  porTema[n] = (porTema[n] || '') + trozo;
}

const todo = motor.normEstricta(crudo.replace(/\s+/g, ''));

mkdirSync(join(RAIZ, 'fuentes-oficiales'), { recursive: true });
writeFileSync(TXT, JSON.stringify({
  generado: new Date().toISOString(),
  origen: 'A2-B1-ES_rev.pdf, la guía de gramática en español',
  aviso: 'Confirma presencia, no prueba ausencia. Cobertura medida: 26% de las oraciones de la unidad 8.',
  todo,
  porTema,
}, null, 1) + '\n', 'utf8');

const jp = (s) => (s.match(/[\u3040-\u30ff\u4e00-\u9faf]/g) || []).length;
console.log('fuentes-oficiales/libro.txt');
console.log('  corpus completo : ' + todo.length + ' caracteres (' + jp(todo) + ' japoneses)');
for (const n of Object.keys(porTema).sort((a, b) => a - b)) {
  console.log('  tema ' + n + '          : ' + jp(porTema[n]) + ' caracteres japoneses');
}
