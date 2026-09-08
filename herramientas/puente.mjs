/* puente.mjs — genera puente-t8.html desde el archivo congelado.
 *
 * Uso:  node herramientas/puente.mjs
 *
 * El puente es la vía B de la migración (plano 5.1): el archivo congelado del
 * Tema 8, sin una línea cambiada, más un bloque al final que exporta el
 * almacén `dojo-marugoto-t8` como JSON de esquema 1. Patricio lo abre desde el
 * mismo lugar desde el que abre hoy la app —eso es lo que hace que compartan
 * origen y que el puente vea su historial—, exporta, e importa el archivo en la
 * app nueva.
 *
 * El agregado va después del último </script> y no toca el marcado: arma su
 * propia tarjeta y la inserta en la pantalla de inicio. Así el motor congelado
 * sigue siendo byte a byte el mismo, y la prueba de M1 lo comprueba.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const congelado = readFileSync(join(RAIZ, 'fuentes-oficiales', 'congelado-t8.html'), 'utf8')
  .replace(/\r\n/g, '\n');

const marca = congelado.lastIndexOf('</body>');
if (marca < 0) {
  console.error('no se encontró </body> en el archivo congelado');
  process.exit(1);
}

const AGREGADO = `
<script>
/* ══════════ puente hacia la versión nueva ══════════
   Único agregado sobre el archivo congelado del Tema 8. No toca el motor ni
   el marcado: vuelca el almacén de esta app como JSON de esquema 1, que la
   app nueva reconoce al importar. */

function volcadoT8(){
  var prog = {}, cfg = null;
  try { prog = JSON.parse(localStorage.getItem('dojo-marugoto-t8') || '{}'); } catch(e){ prog = {}; }
  try { cfg = JSON.parse(localStorage.getItem('dojo-marugoto-t8-cfg') || 'null'); } catch(e){ cfg = null; }
  var ms = Date.now();
  return JSON.stringify({
    app: 'dojo-marugoto-t8',
    esquema: 1,
    exportado: new Date(ms).toISOString(),
    hoy: Math.floor((ms - new Date(ms).getTimezoneOffset() * 60000) / 86400000),
    prog: prog,
    cfg: cfg
  }, null, 1);
}

(function(){
  var texto = volcadoT8();
  var cuantos = Object.keys(JSON.parse(texto).prog).length;
  var nombre = 'dojo-marugoto-t8-' + new Date().toISOString().slice(0, 10) + '.json';

  var card = document.createElement('div');
  card.className = 'card';
  card.innerHTML =
    '<h2 class="sec">Llevar este progreso a la versión nueva</h2>' +
    '<p class="sub" style="margin-bottom:14px">Tienes <b style="color:var(--ink)">' + cuantos +
    '</b> ítems guardados aquí. Expórtalos y luego impórtalos en la app nueva, ' +
    'que los traduce sola.</p>' +
    '<div class="acts"><button class="primary" id="btnPuente">Exportar progreso</button>' +
    '<button class="ghost" id="btnPuenteTexto">Ver el texto</button></div>' +
    '<div id="puenteCaja" style="display:none;margin-top:12px"></div>';

  var home = document.getElementById('scHome');
  if(home) home.appendChild(card);

  function verTexto(){
    var caja = document.getElementById('puenteCaja');
    caja.style.display = 'block';
    caja.innerHTML = '<p class="sub" style="margin-bottom:6px">Cópialo entero y pégalo en la app nueva.</p>';
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('spellcheck', 'false');
    ta.style.cssText = 'width:100%;height:180px;font-family:ui-monospace,monospace;font-size:.75rem;' +
      'border:2px solid var(--line-strong);border-radius:10px;padding:10px;' +
      'background:var(--surface-2);color:var(--ink)';
    caja.appendChild(ta);
    ta.focus(); ta.select();
  }

  document.getElementById('btnPuenteTexto').onclick = verTexto;

  document.getElementById('btnPuente').onclick = function(){
    /* 1. compartir el archivo, que en Android es la vía más fiable */
    try {
      if(typeof File === 'function' && navigator.canShare){
        var archivo = new File([texto], nombre, { type: 'application/json' });
        if(navigator.canShare({ files: [archivo] })){
          navigator.share({ files: [archivo], title: nombre })['catch'](function(){ verTexto(); });
          return;
        }
      }
    } catch(e){}
    /* 2. descarga directa */
    try {
      var url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
      var a = document.createElement('a');
      a.href = url; a.download = nombre;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
      return;
    } catch(e){}
    /* 3. cuadro de texto */
    verTexto();
  };
})();
</script>

`;

const salida = congelado.slice(0, marca) + AGREGADO + congelado.slice(marca);
writeFileSync(join(RAIZ, 'puente-t8.html'), salida, 'utf8');

console.log(
  'puente-t8.html: archivo congelado intacto + ' +
  AGREGADO.split('\n').length + ' líneas de agregado'
);
