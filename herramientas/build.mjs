/* build.mjs — una fuente, dos salidas.
 *
 * Uso:  node herramientas/build.mjs [--unidades=1,8] [--forzar]
 *
 * Solo biblioteca estándar de Node 18+. No hay package.json, no hay
 * node_modules y el repositorio no admite dependencias: si un paso parece
 * necesitar un paquete, se hace una vez a mano y se documenta (plano 6.1).
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');
const SRC = join(RAIZ, 'src');
const CONT = join(RAIZ, 'contenido');
const DIST = join(RAIZ, 'dist');

const args = process.argv.slice(2);
const flag = (n) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1];
const tiene = (n) => args.includes('--' + n);

const leer = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const nl = (t) => (t.endsWith('\n') ? t : t + '\n');

/* ── 1. lectura de fuentes ─────────────────────────────────────── */

const plantilla = leer(join(SRC, 'index.html'));
const css = leer(join(SRC, 'css', 'app.css'));

const archivosJs = readdirSync(join(SRC, 'js'))
  .filter((f) => f.endsWith('.js'))
  .sort();                                   // el prefijo numérico fija el orden
const js = archivosJs
  .map((f) => '/* ══ ' + f + ' ══ */\n' + nl(leer(join(SRC, 'js', f))))
  .join('\n');

const pedidas = flag('unidades')
  ? flag('unidades').split(',').map((n) => n.trim())
  : null;
const archivosCont = ['catalogo.js'].concat(
  readdirSync(CONT)
    .filter((f) => /^u\d+\.js$/.test(f))
    .filter((f) => !pedidas || pedidas.includes(f.slice(1, -3)))
    .sort((a, b) => Number(a.slice(1, -3)) - Number(b.slice(1, -3)))
);
for (const f of archivosCont) {
  if (!existsSync(join(CONT, f))) {
    console.error('falta el archivo de contenido ' + f);
    process.exit(1);
  }
}

/* ── 2. evaluación del contenido en un contexto aislado ────────── */
/* El contenido se autorea como JS (admite comentarios y comas finales)
   pero el runtime siempre consume JSON. */

let CONTENIDO;
try {
  const ctx = vm.createContext(Object.create(null));
  const fuente =
    archivosCont.map((f) => nl(leer(join(CONT, f)))).join('\n') + '\n;CONTENIDO;';
  CONTENIDO = vm.runInContext(fuente, ctx, { filename: 'contenido', timeout: 5000 });
} catch (e) {
  console.error('el contenido no evalúa: ' + e.message);
  process.exit(1);
}

if (!CONTENIDO || !Array.isArray(CONTENIDO.unidades)) {
  console.error('el contenido no expone CONTENIDO.unidades');
  process.exit(1);
}

/* La tabla de migración viaja dentro del contenido porque el runtime la
   necesita para traducir los ids posicionales del Tema 8 (plano 5.2). Es un
   JSON generado por claves.mjs, no un archivo de autoría: se lee tal cual. */
const rutaTabla = join(CONT, 'migracion-t8.json');
if (existsSync(rutaTabla)) CONTENIDO.migracion = JSON.parse(leer(rutaTabla));

/* El validador de contenido entra en M5 (plano 7). Hasta entonces el build
   solo aplica las comprobaciones mecánicas del paso 3 de 6.2. */

const contenidoJson = JSON.stringify(CONTENIDO).replace(/</g, '\\u003c');

/* `--sin-contenido` deja el contenido fuera de la salida y lo reparte como
   archivo suelto. La app lo carga una vez y lo guarda en localStorage
   (plano 6.5). El JSON se emite igual, porque es lo que hay que repartir. */
const sinContenido = tiene('sin-contenido');
const contenidoJs = sinContenido
  ? 'const CONTENIDO = { unidades: [], formas: [], categorias: [] };\n'
  : 'const CONTENIDO = ' + contenidoJson + ';\n';

/* ── 3. comprobaciones mecánicas ───────────────────────────────── */

const errores = [];
const revisar = (nombre, texto) => {
  if (/<\/script/i.test(texto)) errores.push(nombre + ' contiene </script');
  if (/<!--/.test(texto)) errores.push(nombre + ' contiene <!--');
};
revisar('el motor', js);
revisar('el contenido', contenidoJson);

const buscarUrls = (nombre, texto) => {
  const m = texto.match(/https?:\/\/[^\s"'`)]*/g);
  if (m) errores.push(nombre + ' trae URLs externas: ' + [...new Set(m)].join(' '));
};

/* U+FFFD delata una secuencia multibyte cortada en algún paso del pipeline */
for (const [n, t] of [['el motor', js], ['el CSS', css], ['el contenido', contenidoJson]]) {
  if (t.includes('�')) errores.push(n + ' contiene U+FFFD');
}

/* ── 4. sello ──────────────────────────────────────────────────── */

const sello = createHash('sha256')
  .update(css + js + contenidoJs, 'utf8')
  .digest('hex')
  .slice(0, 8);

/* ── 5. armado de las dos salidas ──────────────────────────────── */

const componer = (marcas) =>
  plantilla
    .replaceAll('{{SELLO}}', sello)   // aparece en el meta y en el pie
    .replace('{{PWA_HEAD}}', marcas.head)
    .replace('{{CSS}}', marcas.css)
    .replace('{{CONTENIDO}}', marcas.contenido)
    .replace('{{JS}}', marcas.js);

/* PWA: rutas relativas con ./ para que sirva en la raíz o bajo /sub/ */
const htmlPwa = componer({
  head: '<link rel="manifest" href="./manifest.webmanifest">\n' +
        '<link rel="apple-touch-icon" href="./icons/icono-192.png">',
  css: '<link rel="stylesheet" href="./app.css">',
  contenido: '<script src="./contenido.js"></script>',
  js: '<script src="./app.js"></script>',
});

/* Archivo único: sin manifest ni service worker, que no funcionan en file:// */
const htmlUnico = componer({
  head: '',
  css: '<style>\n' + css + '</style>',
  contenido: '<script>\n' + contenidoJs + '</script>',
  js: '<script>\n' + js + '</script>',
});

buscarUrls('la salida PWA', htmlPwa);
buscarUrls('la salida de archivo único', htmlUnico);

if (errores.length && !tiene('forzar')) {
  console.error('\nel build no pasa:');
  for (const e of errores) console.error('  · ' + e);
  process.exit(1);
}
if (errores.length) {
  console.warn('\n--forzar: se ignoran ' + errores.length + ' problemas');
}

/* ── 6. escritura ──────────────────────────────────────────────── */

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'pwa'), { recursive: true });

const poner = (rel, texto) => {
  const ruta = join(DIST, rel);
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, texto, 'utf8');
  const kb = (Buffer.byteLength(texto, 'utf8') / 1024).toFixed(1);
  console.log('  ' + rel.padEnd(28) + kb.padStart(8) + ' KB');
};

console.log('sello ' + sello + '  ·  unidades ' +
  (sinContenido ? 'fuera de la salida' : CONTENIDO.unidades.map((u) => u.n).join(', ')));
poner(join('pwa', 'index.html'), htmlPwa);
poner(join('pwa', 'app.css'), css);
poner(join('pwa', 'app.js'), js);
poner(join('pwa', 'contenido.js'), contenidoJs);
poner(join('pwa', 'manifest.webmanifest'), leer(join(SRC, 'pwa', 'manifest.webmanifest')));

/* Los iconos se copian tal cual; los genera herramientas/iconos.mjs una vez */
const ICONOS = ['icono-192.png', 'icono-512.png'];
mkdirSync(join(DIST, 'pwa', 'icons'), { recursive: true });
for (const i of ICONOS) {
  const origen = join(SRC, 'pwa', 'icons', i);
  if (!existsSync(origen)) {
    console.error('falta ' + origen + '. Corre: node herramientas/iconos.mjs');
    process.exit(1);
  }
  copyFileSync(origen, join(DIST, 'pwa', 'icons', i));
}
console.log('  ' + join('pwa', 'icons').padEnd(28) + String(ICONOS.length).padStart(8) + ' archivos');

/* El service worker precarga esta lista exacta y la caché lleva el sello */
const ARCHIVOS = ['./', './index.html', './app.css', './app.js', './contenido.js',
  './manifest.webmanifest'].concat(ICONOS.map((i) => './icons/' + i));
/* replaceAll y no replace: los marcadores aparecen tambien en el comentario de
   cabecera de la plantilla, y con `replace` se sustituia ese y la cache se
   quedaba llamandose `dojo-{{SELLO}}` literal, sin invalidarse nunca. */
poner(join('pwa', 'sw.js'),
  leer(join(SRC, 'pwa', 'sw.js'))
    .replaceAll('{{SELLO}}', sello)
    .replaceAll('{{ARCHIVOS}}', JSON.stringify(ARCHIVOS, null, 2)));

poner('dojo-marugoto.html', htmlUnico);
poner('contenido.json', contenidoJson + '\n');   // producto suelto para --sin-contenido
