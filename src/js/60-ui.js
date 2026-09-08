/* Dojo Marugoto - interfaz
   modos, estado de sesion, render de pantallas y correccion.
   Contenido literal del archivo congelado. */

const MODOS = [
  { id:'vocabES', nom:'Vocabulario · escribir en japonés', desc:'Te doy la palabra en español y la escribes en japonés.' },
  { id:'vocabJP', nom:'Vocabulario · reconocer', desc:'Te doy la palabra en japonés y eliges qué significa.' },
  { id:'conj',    nom:'Conjugación', desc:'Te doy el verbo y la forma que quiero, y la escribes.' },
  { id:'hueco',   nom:'Frases con hueco', desc:'Completas la parte que falta dentro de una frase del libro.' },
  { id:'armar',   nom:'Armar la frase', desc:'Te doy las piezas desordenadas y las pones en orden.' },
  { id:'frase',   nom:'Frase completa desde español', desc:'Lo más exigente: te doy la frase en español y la escribes entera.' }
];

/* ═══════════ estado de la sesion ═══════════ */
let cola = [], idx = 0, aciertos = 0, fallos = [], respondida = false;

/* ═══════════ utilidades ═══════════ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ═══════════ render ═══════════ */
function pintarInicio(){
  $('#temaLabel').textContent = 'Tema ' + TEMA.n + ' · ' + TEMA.titulo;
  $('#footTema').textContent = TEMA.n + ' ' + TEMA.titulo + ' — ' + TEMA.es;

  $('#modeList').innerHTML = MODOS.map(m => `
    <label class="opt ${sel.modos.includes(m.id)?'on':''}" data-m="${m.id}">
      <input type="checkbox" ${sel.modos.includes(m.id)?'checked':''}>
      <span><b>${esc(m.nom)}</b><small>${esc(m.desc)}</small></span>
    </label>`).join('');
  $('#modeList').querySelectorAll('.opt').forEach(el => {
    el.querySelector('input').onchange = e => {
      const id = el.dataset.m;
      if(e.target.checked){ if(!sel.modos.includes(id)) sel.modos.push(id); }
      else sel.modos = sel.modos.filter(x => x !== id);
      el.classList.toggle('on', e.target.checked); saveCfg(); actualizarStart();
    };
  });

  const clases = [['0','Las dos'],['1','Clase 1 · p96–100'],['2','Clase 2 · p101–105']];
  $('#claseRow').innerHTML = clases.map(([v,t]) =>
    `<button class="chipbtn ${sel.clase===v?'on':''}" data-c="${v}">${esc(t)}</button>`).join('');
  $('#claseRow').querySelectorAll('button').forEach(b => b.onclick = () => {
    sel.clase = b.dataset.c; saveCfg(); pintarInicio();
  });

  const largos = [[10,'10'],[15,'15'],[25,'25'],[40,'40'],[0,'Todas']];
  $('#largoRow').innerHTML = largos.map(([v,t]) =>
    `<button class="chipbtn ${sel.largo===v?'on':''}" data-l="${v}">${esc(t)}</button>`).join('');
  $('#largoRow').querySelectorAll('button').forEach(b => b.onclick = () => {
    sel.largo = +b.dataset.l; saveCfg(); pintarInicio();
  });

  pintarHistorial(); pintarAccionesProgreso(); actualizarStart();
}
function actualizarStart(){ $('#btnStart').disabled = sel.modos.length === 0; }

function pintarHistorial(){
  const ids = Object.keys(prog);
  if(!ids.length){
    $('#histBody').innerHTML = '<p class="sub">Todavía no hay nada. Lo que falles vuelve a salir más seguido.</p>';
    return;
  }
  const vistas = ids.reduce((a,k) => a + prog[k].v, 0);
  const firmes = ids.filter(k => prog[k].b >= 3).length;
  const flojas = ids.filter(k => prog[k].b === 0 && prog[k].f > 0)
                    .sort((a,b) => prog[b].f - prog[a].f).slice(0,8);
  $('#histBody').innerHTML = `
    <p class="sub" style="margin-bottom:12px">
      <b style="color:var(--ink)">${vistas}</b> respuestas · <b style="color:var(--ok)">${firmes}</b> ítems ya firmes
    </p>` + (flojas.length ? `<p class="sub" style="margin-bottom:6px">Lo que más se te resiste:</p>
      <div class="chipsrow">${flojas.map(k => `<span class="piece">${esc(etiqueta(k))}</span>`).join('')}</div>` : '');
}
/* Los ids de frase, hueco y armar son `<t>:<unidad>:<clave>`. Se muestra el
   `es` del ejercicio, que es lo unico que Patricio reconoce de un vistazo en
   el historial; el numero de la clave no le dice nada (plano Anexo A). */
function itemDe(t, n, k){
  const u = UNIDADES.find(x => x.n === +n);
  if(!u) return null;
  const arr = t === 'h' ? u.huecos : t === 'a' ? u.armar : t === 'f' ? u.frases : null;
  return arr ? arr.find(x => x.k === k) : null;
}

function recortar(s, n){
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function etiqueta(id){
  const [t, a, b] = id.split(':');
  if(t === 'c'){ const f = FORMAS.find(x => x.id === b); return a + ' → ' + (f ? f.label : b); }
  if(t === 'v'){ return a; }
  if(t === 'h' || t === 'a' || t === 'f'){
    const it = itemDe(t, a, b);
    const nom = t === 'h' ? 'hueco' : t === 'a' ? 'armar' : 'frase';
    return it ? recortar(it.es, 42) : nom + ' ' + b;
  }
  return id;
}

function enunciado(q){
  if(q.tipo === 'hueco' || q.tipo === 'hueco2')
    return q.pre + '___' + q.post + (q.post2 ? '___' + q.post2 : '') + '  ·  ' + q.hint;
  if(q.tipo === 'opcion') return q.promptJp + ' (' + q.lectura + ')';
  if(q.pide) return q.promptJp + ' → ' + q.pide;
  return q.promptEs || q.promptJp || etiqueta(q.id);
}

function ir(pantalla){
  ['scHome','scPlay','scEnd'].forEach(s => $('#'+s).classList.toggle('hide', s !== pantalla));
  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
}

/* ═══════════ pregunta ═══════════ */
function pintarPregunta(){
  const q = cola[idx];
  respondida = false;
  $('#rail').style.width = (idx / cola.length * 100) + '%';
  $('#mCount').textContent = 'Pregunta ' + (idx+1) + ' de ' + cola.length;
  $('#mScore').textContent = aciertos + ' correctas';
  $('#qTag').textContent = q.tag;
  const t2 = $('#qTag2');
  if(q.tag2){ t2.textContent = q.tag2; t2.classList.remove('hide'); } else t2.classList.add('hide');
  $('#fb').className = 'fb';
  $('#fb').innerHTML = '';

  const B = $('#qBody');

  if(q.tipo === 'escribir'){
    B.innerHTML =
      (q.promptEs ? `<div class="prompt es">${esc(q.promptEs)}</div>` : '') +
      (q.promptJp ? `<div class="prompt">${esc(q.promptJp)}</div>` : '') +
      (q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : '') +
      (q.sub ? `<p class="sub">${esc(q.sub)}</p>` : '') +
      (q.pide ? `<p class="ask">Escribe la <b>${esc(q.pide)}</b>${q.forma?' <span class="sub">('+esc(q.forma)+')</span>':''}</p>`
              : `<p class="ask">Escríbelo en japonés</p>`) +
      `<input type="text" id="inp" lang="ja" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">`;
    acciones(true);
    setTimeout(() => $('#inp') && $('#inp').focus(), 30);
  }

  else if(q.tipo === 'hueco' || q.tipo === 'hueco2'){
    B.innerHTML =
      `<p class="ask">Completa la frase</p>
       <div class="gapline">${esc(q.pre)}<input type="text" id="inp" lang="ja" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${esc(q.post)}` +
      (q.tipo === 'hueco2' ? `<input type="text" id="inp2" lang="ja" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${esc(q.post2)}` : '') +
      `</div>
       <p class="sub" style="margin-top:12px"><b style="color:var(--ai)">${esc(q.hint)}</b></p>
       <p class="sub">${esc(q.sub)}</p>`;
    acciones(true);
    setTimeout(() => $('#inp') && $('#inp').focus(), 30);
  }

  else if(q.tipo === 'opcion'){
    B.innerHTML =
      `<div class="prompt">${esc(q.promptJp)}</div>
       <p class="sub">${esc(q.lectura)}</p>
       <p class="ask">¿Qué significa?</p>
       <div class="mc" id="mc">${q.opciones.map((o,i) => `<button data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    $('#mc').querySelectorAll('button').forEach(b => b.onclick = () => {
      if(respondida) return;
      const elegido = q.opciones[+b.dataset.i];
      const bien = elegido === q.correcta;
      $('#mc').querySelectorAll('button').forEach(x => {
        if(q.opciones[+x.dataset.i] === q.correcta) x.classList.add('pick-ok');
        else if(x === b) x.classList.add('pick-no');
        x.disabled = true;
      });
      resolver(bien, bien ? 'ok' : 'mal', q.correcta, q);
    });
    acciones(false);
  }

  else if(q.tipo === 'armar'){
    B.innerHTML =
      `<div class="prompt es">${esc(q.promptEs)}</div>
       <p class="ask">Toca las piezas en el orden correcto</p>
       <div class="slot" id="slot"></div>
       <div class="pool" id="pool">${baraja(q.chips.map((c,i)=>({c,i}))).map(o =>
          `<button class="piece" data-c="${esc(o.c)}">${esc(o.c)}</button>`).join('')}</div>`;
    const slot = $('#slot'), pool = $('#pool');
    pool.querySelectorAll('.piece').forEach(b => b.onclick = () => {
      if(respondida) return;
      const cp = document.createElement('button');
      cp.className = 'piece'; cp.textContent = b.textContent;
      cp.onclick = () => { if(respondida) return; cp.remove(); b.style.display=''; };
      slot.appendChild(cp); b.style.display = 'none';
    });
    acciones(true);
  }

  $('#fb').classList.remove('show');
}

function acciones(conComprobar){
  const A = $('#qActs');
  A.innerHTML = conComprobar
    ? `<button class="primary" id="btnCheck">Comprobar</button><button class="ghost thin" id="btnSkip">No sé</button>`
    : `<button class="ghost thin" id="btnSkip">No sé</button>`;
  if($('#btnCheck')) $('#btnCheck').onclick = comprobar;
  if($('#btnSkip')) $('#btnSkip').onclick = () => {
    const q = cola[idx];
    if(respondida) return;
    resolver(false, 'mal', q.modelo, q, true);
  };
}

function comprobar(){
  const q = cola[idx];
  if(respondida){ siguiente(); return; }

  if(q.tipo === 'armar'){
    const dado = Array.from($('#slot').querySelectorAll('.piece')).map(x => x.textContent).join('');
    const r = revisar(dado, [q.chips.join('')]);
    resolver(r.estado === 'ok', r.estado, q.modelo, q);
    return;
  }

  const v1 = ($('#inp') && $('#inp').value) || '';
  if(!v1.trim()) return;

  if(q.tipo === 'hueco2'){
    const v2 = ($('#inp2') && $('#inp2').value) || '';
    const r1 = revisar(v1, q.ok), r2 = revisar(v2, q.ok2);
    const orden = e => e === 'ok' ? 2 : e === 'casi' ? 1 : 0;
    const peor = Math.min(orden(r1.estado), orden(r2.estado));
    const est = peor === 2 ? 'ok' : peor === 1 ? 'casi' : 'mal';
    resolver(est !== 'mal', est, q.ok[0] + ' … ' + q.ok2[0], q);
    return;
  }

  const r = revisar(v1, q.ok);
  resolver(r.estado === 'ok' || r.estado === 'casi', r.estado, r.modelo, q);
}

function resolver(bien, estado, modelo, q, rendido){
  respondida = true;
  if(bien) aciertos++;
  marcar(q.id, bien && estado === 'ok');
  if(!bien) fallos.push({ q, modelo });

  const fb = $('#fb');
  fb.className = 'fb show ' + (estado === 'ok' ? 'ok' : estado === 'casi' ? 'casi' : 'no');
  let head = estado === 'ok' ? 'Correcto' : estado === 'casi' ? 'Casi' : (rendido ? 'La respuesta era' : 'No');
  let why = '';
  if(estado === 'casi') why = '<div class="why">Lo tenías, pero falla una vocal larga o un kana pequeño. Fíjate en la forma exacta.</div>';
  if(q.lecturaResp && q.lecturaResp !== modelo) why += '<div class="why">Lectura: <b>' + esc(q.lecturaResp) + '</b></div>';
  if(estado !== 'ok' && q.regla) why += '<div class="why">' + esc(q.regla) + '</div>';
  if(estado !== 'ok' && q.nota) why += '<div class="why"><b>Ojo:</b> ' + esc(q.nota) + '</div>';

  fb.innerHTML = `<div class="head">${head}</div><div class="model">${esc(modelo)}</div>${why}`;

  const A = $('#qActs');
  A.innerHTML = `<button class="primary" id="btnNext">${idx+1 >= cola.length ? 'Ver resumen' : 'Siguiente'}</button>` +
    (estado !== 'ok' && !rendido ? `<button class="ghost thin" id="btnOk">La tenía bien</button>` : '');
  $('#btnNext').onclick = siguiente;
  if($('#btnOk')) $('#btnOk').onclick = () => {
    aciertos++; marcar(q.id, true);
    fallos = fallos.filter(f => f.q !== q);
    $('#btnOk').remove();
    $('#mScore').textContent = aciertos + ' correctas';
    fb.className = 'fb show ok';
    fb.querySelector('.head').textContent = 'Marcada como correcta';
  };
  $('#btnNext').focus();
}

function siguiente(){
  idx++;
  if(idx >= cola.length) return terminar();
  pintarPregunta();
}

function terminar(){
  $('#rail').style.width = '100%';
  const pct = cola.length ? Math.round(aciertos / cola.length * 100) : 0;
  $('#endScore').innerHTML = aciertos + ' <small>de ' + cola.length + ' · ' + pct + '%</small>';
  $('#endLine').textContent = pct >= 85 ? 'Esto ya lo tienes. Sube el número de preguntas o agrega un modo más exigente.'
    : pct >= 55 ? 'Vas bien. Lo que fallaste va a volver a salir más seguido.'
    : 'Todavía cuesta. Repite esta misma configuración un par de veces antes de cambiar de modo.';
  const miss = $('#endMiss');
  if(fallos.length){
    $('#endMissCard').classList.remove('hide');
    miss.innerHTML = '<tr><th>Pregunta</th><th>Respuesta</th></tr>' + fallos.map(f =>
      `<tr><td>${esc(enunciado(f.q))}</td><td class="jp">${esc(f.modelo)}</td></tr>`).join('');
  } else $('#endMissCard').classList.add('hide');
  ir('scEnd');
  pintarHistorial();
}

/* ═══════════ dialogos propios ═══════════ */

/* Reemplaza a alert y confirm, que en una PWA instalada muestran el nombre del
   origen y rompen la ilusion de app. Cuatro usos y no se generaliza mas:
   el aviso de combinacion vacia, el borrado de progreso, la importacion y el
   aviso de migracion (plano 3.3). */
function dialogo({ titulo, texto, campo, botones }){
  return new Promise(resolve => {
    const d = $('#dlg');
    const bs = (botones || [{ t:'Entendido', v:'ok', p:true }]);
    d.innerHTML = `<div class="dlgcaja" role="dialog" aria-modal="true">
      ${titulo ? `<h2 class="sec">${esc(titulo)}</h2>` : ''}
      ${texto ? `<p class="sub" style="color:var(--ink-2)">${esc(texto)}</p>` : ''}
      ${campo !== undefined ? `<textarea id="dlgCampo" spellcheck="false">${esc(campo)}</textarea>` : ''}
      <div class="acts">${bs.map((b,i) =>
        `<button class="${b.p ? 'primary' : 'ghost'}" data-i="${i}">${esc(b.t)}</button>`).join('')}</div>
    </div>`;
    d.classList.remove('hide');
    const cerrar = v => {
      const campoVal = $('#dlgCampo') ? $('#dlgCampo').value : undefined;
      d.classList.add('hide'); d.innerHTML = '';
      document.removeEventListener('keydown', escapar, true);
      resolve({ boton: v, campo: campoVal });
    };
    const escapar = e => {
      if(e.key !== 'Escape') return;
      e.preventDefault(); e.stopPropagation();
      cerrar(bs.find(b => b.cancela) ? bs.find(b => b.cancela).v : null);
    };
    d.querySelectorAll('button').forEach(b => b.onclick = () => cerrar(bs[+b.dataset.i].v));
    document.addEventListener('keydown', escapar, true);
    const primero = d.querySelector('#dlgCampo') || d.querySelector('button.primary') || d.querySelector('button');
    if(primero) primero.focus();
    if($('#dlgCampo')) $('#dlgCampo').select();
  });
}

/* ═══════════ exportar e importar ═══════════ */

async function accionExportar(){
  const { nombre, texto } = exportar();
  const n = Object.keys(prog).length;
  const verTexto = () => dialogo({
    titulo: 'Tu progreso en texto',
    texto: 'Cópialo y guárdalo donde quieras. Sirve igual que el archivo.',
    campo: texto,
    botones: [{ t:'Listo', v:'ok', p:true }]
  });

  /* 1. Compartir el archivo. En Android instalado es la via mas fiable para
        mandarlo a Drive, WhatsApp o correo (plano 4.2). */
  try {
    if(typeof File === 'function' && navigator.canShare){
      const archivo = new File([texto], nombre, { type:'application/json' });
      if(navigator.canShare({ files:[archivo] })){
        await navigator.share({ files:[archivo], title:nombre });
        return;
      }
    }
  } catch(e){ if(e && e.name === 'AbortError') return; }

  /* 2. Descarga directa. */
  let bajo = false;
  try {
    const url = URL.createObjectURL(new Blob([texto], { type:'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    bajo = true;
  } catch(e){}

  if(bajo){
    const r = await dialogo({
      titulo: 'Progreso exportado',
      texto: nombre + ' · ' + n + ' ítems. Si no lo encuentras en Descargas, copia el texto.',
      botones: [{ t:'Listo', v:'ok', p:true }, { t:'Ver el texto', v:'texto' }]
    });
    if(r.boton === 'texto') await verTexto();
    return;
  }

  /* 3. Cuadro de texto. */
  await verTexto();
}

async function aplicarTexto(texto){
  const d = leerExportacion(texto);
  if(d.error){
    await dialogo({ titulo:'No se pudo importar', texto:d.error });
    return false;
  }
  const n = Object.keys(d.prog).length;
  if(!n){
    await dialogo({ titulo:'No se pudo importar', texto:'El archivo no trae ningún ítem con progreso.' });
    return false;
  }

  let aviso = n + ' ítems' + (d.esquema === 1 ? ', traídos de la app del Tema 8' : '') + '.';
  if(d.perdidos && d.perdidos.length) aviso += ' ' + d.perdidos.length + ' no se pudieron traducir y se descartan.';
  const desf = desfase(d.hoy);
  if(desf > 1) aviso += ' Ojo: el archivo se exportó con una fecha que difiere en ' + desf + ' días de la de este dispositivo.';

  const r = await dialogo({
    titulo: 'Importar progreso',
    texto: aviso + ' Fusionar conserva lo mejor de cada lado; reemplazar borra lo que tienes aquí.',
    botones: [
      { t:'Fusionar', v:'fusionar', p:true },
      { t:'Reemplazar todo', v:'reemplazar' },
      { t:'Cancelar', v:null, cancela:true }
    ]
  });
  if(!r.boton) return false;

  aplicarImportacion(d, r.boton === 'reemplazar');
  pintarInicio();
  await dialogo({
    titulo: 'Progreso importado',
    texto: Object.keys(prog).length + ' ítems en total. Si algo salió mal, "Deshacer la importación" lo devuelve como estaba.'
  });
  return true;
}

function accionImportar(){
  const inp = $('#fileImport');
  inp.value = '';
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if(!f) return;
    const fr = new FileReader();
    fr.onload = () => aplicarTexto(String(fr.result || ''));
    fr.onerror = () => dialogo({ titulo:'No se pudo leer el archivo' });
    fr.readAsText(f);
  };
  inp.click();
}

async function accionPegar(){
  const r = await dialogo({
    titulo: 'Pegar el progreso',
    texto: 'Pega aquí el texto que exportaste desde el otro dispositivo o desde el puente.',
    campo: '',
    botones: [{ t:'Importar', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
  });
  if(r.boton && String(r.campo || '').trim()) await aplicarTexto(r.campo);
}

async function accionDeshacer(){
  const r = await dialogo({
    titulo: 'Deshacer la última importación',
    texto: 'Vuelve el progreso al estado anterior a la importación. Lo importado se pierde.',
    botones: [{ t:'Deshacer', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  deshacerImportacion();
  pintarInicio();
}

async function accionBorrar(){
  const r = await dialogo({
    titulo: 'Borrar tu progreso',
    texto: 'Se borra todo lo guardado en este dispositivo. Exporta antes si quieres conservarlo.',
    botones: [{ t:'Borrar', v:'ok' }, { t:'Cancelar', v:null, p:true, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  respaldar();
  prog = {}; save();
  pintarInicio();
}

function pintarAccionesProgreso(){
  $('#btnUndo').classList.toggle('hide', !hayRespaldo());
}
