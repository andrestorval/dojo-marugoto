/* publicar.mjs — copia dist/pwa/ a docs/, que es lo que sirve GitHub Pages.
 *
 * Uso:  node herramientas/build.mjs && node herramientas/publicar.mjs
 *       git add docs && git commit -m "publica <sello>" && git push
 *
 * Por qué `docs/` en la rama principal y no una rama `gh-pages`: es una
 * carpeta más en el mismo commit, se ve en el diff, y no hay que mantener dos
 * ramas sincronizadas a mano. GitHub Pages lo sirve eligiendo "main /docs" en
 * los ajustes del repositorio, una vez.
 *
 * `dist/` sigue fuera del control de versiones; `docs/` entra, porque es el
 * artefacto que se publica y tiene que viajar en el repositorio.
 */

import { readdirSync, statSync, mkdirSync, copyFileSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(RAIZ, 'dist', 'pwa');
const DESTINO = join(RAIZ, 'docs');

if (!existsSync(ORIGEN)) {
  console.error('no existe dist/pwa/. Corre antes: node herramientas/build.mjs');
  process.exit(1);
}

function copiar(desde, hacia) {
  mkdirSync(hacia, { recursive: true });
  let n = 0;
  for (const e of readdirSync(desde)) {
    const a = join(desde, e), b = join(hacia, e);
    if (statSync(a).isDirectory()) n += copiar(a, b);
    else { copyFileSync(a, b); n++; }
  }
  return n;
}

rmSync(DESTINO, { recursive: true, force: true });
const n = copiar(ORIGEN, DESTINO);

/* Sin este archivo, GitHub Pages pasa el sitio por Jekyll y se come todo lo
   que empiece por guion bajo. Aquí no hay nada así, pero cuesta cero. */
writeFileSync(join(DESTINO, '.nojekyll'), '');

const sello = (existsSync(join(DESTINO, 'sw.js'))
  ? (readdirSync(DESTINO), (await import('node:fs')).readFileSync(join(DESTINO, 'sw.js'), 'utf8').match(/dojo-([0-9a-f]{8})/) || [])[1]
  : null) || 'desconocido';

console.log('docs/ actualizado: ' + n + ' archivos · sello ' + sello);
console.log('En GitHub: Settings → Pages → Source "Deploy from a branch" → main /docs');
