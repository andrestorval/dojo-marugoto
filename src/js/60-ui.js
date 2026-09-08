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

  pintarHistorial(); actualizarStart();
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
function etiqueta(id){
  const [t, a, b] = id.split(':');
  if(t === 'c'){ const f = FORMAS.find(x => x.id === b); return a + ' → ' + (f ? f.label : b); }
  if(t === 'v'){ return a; }
  if(t === 'h'){ return 'hueco ' + (+a + 1); }
  if(t === 'a'){ return 'armar ' + (+a + 1); }
  if(t === 'f'){ return 'frase ' + (+a + 1); }
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
