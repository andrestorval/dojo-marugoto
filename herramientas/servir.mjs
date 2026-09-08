/* servir.mjs — servidor estático mínimo para probar dist/pwa/ en local.
 *
 * Uso:  node herramientas/servir.mjs [--puerto=8080] [--base=/dojo]
 *
 * `--base` monta la carpeta bajo una subruta, que es la prueba de que la
 * salida no depende de estar en la raíz de un dominio (plano 6.2, paso 4).
 * No es parte del producto: no se sube a ningún lado.
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(RAIZ, 'dist', 'pwa');

const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1] ?? d;
const puerto = Number(flag('puerto', 8080));
const base = flag('base', '').replace(/\/+$/, '');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

createServer((req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (base && ruta.startsWith(base)) ruta = ruta.slice(base.length) || '/';
  else if (base) {
    res.writeHead(404).end('fuera de ' + base);
    return;
  }
  if (ruta.endsWith('/')) ruta += 'index.html';

  const archivo = join(DIR, normalize(ruta).replace(/^([/\\])+/, ''));
  if (!archivo.startsWith(DIR) || !existsSync(archivo) || !statSync(archivo).isFile()) {
    res.writeHead(404).end('no está ' + ruta);
    return;
  }
  res.writeHead(200, {
    'content-type': TIPOS[extname(archivo)] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  res.end(readFileSync(archivo));
}).listen(puerto, () => {
  console.log('sirviendo dist/pwa/ en http://localhost:' + puerto + (base || '') + '/');
});
