/* Reglas del CSS que la app necesita para verse. Nacen de un fallo real: el
   velo del diálogo quedó siempre encima porque `.dlg` y `.hide` tienen la
   misma especificidad y `.dlg` va después. Es invisible en cualquier prueba
   que solo mire el DOM. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './motor.mjs';

const css = readFileSync(join(RAIZ, 'src', 'css', 'app.css'), 'utf8').replace(/\r\n/g, '\n');
const html = readFileSync(join(RAIZ, 'src', 'index.html'), 'utf8').replace(/\r\n/g, '\n');

/* Clases con las que el HTML combina `hide` de entrada o en tiempo de uso */
const CON_HIDE = ['dlg', 'acts', 'card', 'chipsrow', 'piece', 'ghost', 'primary'];

test('ninguna clase que se oculte con `hide` le gana en display', () => {
  const lineaHide = css.split('\n').findIndex((l) => /^\.hide\s*\{/.test(l));
  assert.ok(lineaHide >= 0, 'no está la regla .hide');

  const fallos = [];
  css.split('\n').forEach((linea, i) => {
    if (i <= lineaHide) return;                 /* antes de .hide no hay conflicto */
    if (!/display\s*:/.test(linea)) return;
    for (const c of CON_HIDE) {
      /* selector de una sola clase, sin nada que suba la especificidad */
      const re = new RegExp('(^|,)\s*\.' + c + '\s*\{');
      if (!re.test(linea)) continue;
      const pareja = new RegExp('\.' + c + '\.hide\s*\{[^}]*display\s*:\s*none');
      if (!pareja.test(css)) {
        fallos.push('línea ' + (i + 1) + ': .' + c + ' fija display después de .hide y no tiene .' + c + '.hide');
      }
    }
  });
  assert.deepEqual(fallos, []);
});

test('el diálogo arranca oculto y su regla de ocultar existe', () => {
  assert.match(html, /<div class="dlg hide" id="dlg">/);
  assert.match(css, /\.dlg\.hide\s*\{\s*display\s*:\s*none\s*\}/);
});

test('todas las secciones de pantalla existen en el marcado', () => {
  for (const s of ['scPrimero', 'scHome', 'scMenu', 'scPlay', 'scEnd']) {
    assert.ok(html.includes('id="' + s + '"'), 'falta la sección ' + s);
  }
});

test('cada id que el motor busca existe en el marcado', () => {
  const js = ['30-progreso', '40-programador', '50-preguntas', '60-ui', '70-arranque']
    .map((f) => readFileSync(join(RAIZ, 'src', 'js', f + '.js'), 'utf8'))
    .join('\n');
  /* los que se crean en tiempo de ejecución no están en la plantilla */
  const CREADOS = new Set(['dlgCampo', 'inp', 'inp2', 'slot', 'mc', 'pool',
    'btnCheck', 'btnSkip', 'btnNext', 'btnOk', 'btnSabida', 'fCerrar',
    'btnVer', 'btnVerFicha']);
  const faltan = [];
  for (const m of js.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)) {
    const id = m[1];
    if (CREADOS.has(id) || faltan.includes(id)) continue;
    if (!html.includes('id="' + id + '"')) faltan.push(id);
  }
  assert.deepEqual(faltan, []);
});

/* ── la salida PWA (M4) ────────────────────────────────────────── */

const dist = (...p) => join(RAIZ, 'dist', ...p);
const hayDist = existsSync(dist('pwa', 'sw.js'));

test('el service worker sale sin marcadores y es JavaScript válido', { skip: !hayDist }, () => {
  const sw = readFileSync(dist('pwa', 'sw.js'), 'utf8');
  /* `replace` sustituye solo la primera aparición, y los marcadores salían
     también en el comentario de cabecera: la caché se quedaba llamándose
     `dojo-{{SELLO}}` y el archivo ni siquiera parseaba. */
  assert.equal(/\{\{[A-Z_]+\}\}/.test(sw), false, 'quedaron marcadores sin sustituir');
  assert.match(sw, /const CACHE = 'dojo-[0-9a-f]{8}';/, 'la caché tiene que llevar el sello');
  new Function(sw.replace(/self\./g, 'globalThis.'));   // lanza si no parsea
});

test('el service worker precarga exactamente lo que el build escribe', { skip: !hayDist }, () => {
  const sw = readFileSync(dist('pwa', 'sw.js'), 'utf8');
  const lista = JSON.parse(sw.match(/const ARCHIVOS = (\[[\s\S]*?\]);/)[1]);
  for (const rel of lista) {
    if (rel === './') continue;
    assert.ok(existsSync(dist('pwa', rel.replace('./', ''))), 'precarga algo que no existe: ' + rel);
  }
  for (const nombre of ['index.html', 'app.css', 'app.js', 'contenido.js', 'manifest.webmanifest']) {
    assert.ok(lista.includes('./' + nombre), 'falta ' + nombre + ' en la precarga');
  }
});

test('el manifest no supone dominio y trae los dos iconos', { skip: !hayDist }, () => {
  const mf = JSON.parse(readFileSync(dist('pwa', 'manifest.webmanifest'), 'utf8'));
  assert.equal(mf.start_url, './');
  assert.equal(mf.scope, './');
  assert.equal(mf.display, 'standalone');
  assert.equal(mf.theme_color, '#17516B');
  assert.equal(mf.icons.length, 2);
  for (const i of mf.icons) {
    assert.ok(i.src.startsWith('./'), 'ruta absoluta en el manifest: ' + i.src);
    assert.ok(existsSync(dist('pwa', i.src.replace('./', ''))), 'falta el icono ' + i.src);
  }
});

test('el archivo único es autocontenido y no registra el service worker', { skip: !hayDist }, () => {
  const html = readFileSync(dist('dojo-marugoto.html'), 'utf8');

  /* nada externo: ni manifest, ni hojas de estilo, ni scripts por src */
  assert.equal(/<link[^>]+rel="manifest"/.test(html), false, 'lleva manifest');
  assert.equal(/<link[^>]+rel="stylesheet"/.test(html), false, 'lleva CSS externo');
  assert.equal(/<script[^>]+src=/.test(html), false, 'lleva JS externo');

  /* El código de registro sí está —es el mismo motor en las dos salidas— pero
     queda inerte: la condición es que exista el manifest, y aquí no existe. */
  assert.match(html, /document\.querySelector\('link\[rel="manifest"\]'\)/);

  const pwa = readFileSync(dist('pwa', 'index.html'), 'utf8');
  assert.match(pwa, /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
  assert.match(pwa, /<script src="\.\/app\.js"><\/script>/);
});
