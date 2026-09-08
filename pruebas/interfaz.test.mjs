/* Reglas del CSS que la app necesita para verse. Nacen de un fallo real: el
   velo del diálogo quedó siempre encima porque `.dlg` y `.hide` tienen la
   misma especificidad y `.dlg` va después. Es invisible en cualquier prueba
   que solo mire el DOM. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
    'btnCheck', 'btnSkip', 'btnNext', 'btnOk', 'btnSabida', 'fCerrar']);
  const faltan = [];
  for (const m of js.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)) {
    const id = m[1];
    if (CREADOS.has(id) || faltan.includes(id)) continue;
    if (!html.includes('id="' + id + '"')) faltan.push(id);
  }
  assert.deepEqual(faltan, []);
});
