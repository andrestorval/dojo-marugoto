/* Dojo Marugoto - interfaz
   modos, estado de sesion, render de pantallas y correccion.
   Contenido literal del archivo congelado. */

const MODOS = [
  { id:'vocabES', nom:'Vocabulario · escribir en japonés', desc:'Te doy la palabra en español y la escribes en japonés.' },
  { id:'vocabJP', nom:'Vocabulario · reconocer', desc:'Te doy la palabra en japonés y eliges qué significa.' },
  { id:'conj',    nom:'Conjugación', desc:'Te doy el verbo y la forma que quiero, y la escribes.' },
  { id:'hueco',   nom:'Frases con hueco', desc:'Completas la parte que falta dentro de una frase del libro.' },
  { id:'armar',   nom:'Armar la frase', desc:'Te doy las piezas desordenadas y las pones en orden.' }
];

/* Hubo un séptimo modo, "frase completa desde español": se daba la frase en
   español y había que escribirla entera en japonés. Se quitó a petición de
   Patricio y con razón. Escribir una oración entera en el teclado del celular
   es una tarea de tecleo, no de idioma, y lo que mide —orden de las palabras,
   partículas, forma del verbo— lo mide "armar la frase" sin esa fricción.

   Las frases NO se borraron del contenido: siguen siendo los ejemplos de la
   ficha de cada patrón y de la sección de materia. Lo que se quitó es el
   ejercicio, no el material. */

/* ═══════════ estado de la sesion ═══════════ */
let cola = [], idx = 0, aciertos = 0, fallos = [], recuperadas = [], repasoPuesto = false, respondida = false;

/* ═══════════ utilidades ═══════════ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ═══════════ render ═══════════ */
/* El pie nombra la unidad en la que se está. Lo pintan las dos pantallas que
   pueden estar delante —la de inicio y la de primer uso—, porque el segmento
   entero es de este span: sin unidad no se escribe nada. */
function pintarPie(){
  const u = UNIDADES.find(x => x.n === unidadActual());
  $('#footTema').textContent = u ? ' · Tema ' + u.n + ' ' + u.titulo + ' — ' + u.es : '';
}

function pintarInicio(){
  const u = UNIDADES.find(x => x.n === unidadActual());
  $('#temaLabel').textContent = u ? 'Unidad ' + u.n + ' · ' + u.titulo : '';
  pintarPie();

  /* El subtítulo del botón explica sin texto qué va a pasar al tocarlo. */
  /* sin contenido no hay nada que practicar: el botón principal se convierte
     en el cargador (plano 6.5) */
  $('#btnCargar').classList.toggle('hide', hayContenido());
  $('#btnMateria').classList.toggle('hide', !hayContenido());
  $('#btnMenu').classList.toggle('hide', !hayContenido());

  const pan = panoramaHoy();
  const b = $('#btnStart'), linea = $('#hoyLinea'), aviso = $('#hoyAviso');
  b.disabled = false;
  if(pan.vencidas === 0 && pan.nuevas === 0){
    linea.textContent = pan.total
      ? 'Todo al día. Puedes adelantar trabajo.'
      : 'Todavía no hay contenido. Cárgalo desde el archivo que te pasaron.';
    b.textContent = pan.total ? 'Adelantar' : 'Practicar hoy';
    b.disabled = !pan.total;
  } else {
    b.textContent = 'Practicar hoy';
    linea.textContent = (pan.vencidas ? pan.vencidas + ' vencidas' : 'Nada vencido') +
      ' · ' + pan.nuevas + ' nuevas';
  }

  /* Quien falla mucho vive semanas con el cupo de nuevos bloqueado, y sin esta
     línea lo lee como que la app se quedó pegada (plano 2.4). */
  aviso.classList.toggle('hide', !pan.bloquea);
  if(pan.bloquea) aviso.textContent =
    'Hoy no entran ítems nuevos: primero lo atrasado. Vuelven en cuanto bajes del tope de la sesión.';

  pintarHistorial(); pintarAccionesProgreso();
}

/* ═══════════ menú "Elegir qué practicar" ═══════════ */

function chips(cont, opciones, activo, alElegir){
  $(cont).innerHTML = opciones.map(([v,t]) =>
    `<button class="chipbtn ${activo(v)?'on':''}" data-v="${esc(String(v))}">${esc(t)}</button>`).join('');
  $(cont).querySelectorAll('button').forEach(x => x.onclick = () => { alElegir(x.dataset.v); saveCfg(); });
}

const unidadesListas = () => UNIDADES.filter(u => u.estado === 'lista').map(u => u.n).sort((a,b) => a - b);

function pintarMenu(){
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

  /* Selección múltiple: "todas" es vaciar la lista, no un valor más. */
  const listas = unidadesListas();
  chips('#unidadRow', [['0','Todas']].concat(listas.map(n => [String(n), 'Unidad ' + n])),
    v => v === '0' ? !sel.unidades.length : sel.unidades.includes(+v),
    v => {
      if(v === '0') sel.unidades = [];
      else {
        const n = +v;
        sel.unidades = sel.unidades.includes(n) ? sel.unidades.filter(x => x !== n) : sel.unidades.concat(n);
      }
      pintarMenu();
    });

  chips('#claseRow', [['0','Las dos'],['1','Clase 1'],['2','Clase 2']],
    v => sel.clase === v, v => { sel.clase = v; pintarMenu(); });

  chips('#largoRow', [['10','10'],['15','15'],['20','20'],['25','25'],['40','40'],['0','Todas']],
    v => sel.largo === +v, v => { sel.largo = +v; pintarMenu(); });

  chips('#nuevosRow', [['0','0'],['3','3'],['6','6'],['10','10']],
    v => sel.cupoNuevos === +v, v => { sel.cupoNuevos = +v; pintarMenu(); });

  chips('#cursoRow', listas.map(n => [String(n), 'Unidad ' + n]),
    v => unidadActual() === +v, v => { sel.unidadActual = +v; pintarMenu(); });

  chips('#presRow', [['0','Preguntármelo directo'],['1','Mostrármelo antes']],
    v => (v === '1') === !!sel.presentaciones,
    v => { sel.presentaciones = v === '1'; pintarMenu(); });

  actualizarStart();
}

/* ═══════════ primer uso ═══════════ */

/* Dos preguntas, una sola vez. Sin esto, el usuario que recibe la app por mano
   no sabe en qué unidad está ni cuánto es un rato de práctica (Anexo B). */
function pintarPrimerUso(){
  const listas = unidadesListas();
  if(!sel.unidadActual) sel.unidadActual = unidadPorDefecto();
  chips('#p1Unidad', listas.map(n => [String(n), 'Unidad ' + n]),
    v => sel.unidadActual === +v, v => { sel.unidadActual = +v; pintarPrimerUso(); });
  chips('#p1Largo', [['10','10 preguntas'],['20','20 preguntas'],['40','40 preguntas']],
    v => sel.largo === +v, v => { sel.largo = +v; pintarPrimerUso(); });
  pintarPie();
}

function actualizarStart(){ $('#btnStartManual').disabled = sel.modos.length === 0; }

function pintarHistorial(){
  const ids = Object.keys(prog);
  if(!ids.length){
    $('#histBody').innerHTML = '<p class="sub">Todavía no hay nada. Lo que falles vuelve a salir más seguido.</p>';
    $('#histUnidades').innerHTML = '';
    return;
  }
  const vistas   = ids.reduce((a,k) => a + prog[k].v, 0);
  const firmes   = ids.filter(k => prog[k].b >= 5).length;
  const jubilados = ids.filter(k => prog[k].man).length;
  const flojas = ids.filter(k => prog[k].b === 0 && prog[k].f > 0)
                    .sort((a,b) => prog[b].f - prog[a].f).slice(0,8);

  $('#histBody').innerHTML = `
    <p class="sub" style="margin-bottom:12px">
      <b style="color:var(--ink)">${vistas}</b> respuestas ·
      <b style="color:var(--ok)">${firmes}</b> ítems ya firmes` +
      (jubilados ? ` · <b style="color:var(--gold)">${jubilados}</b> marcados como sabidos` : '') +
    `</p>` +
    (flojas.length ? `<p class="sub" style="margin-bottom:6px">Lo que más se te resiste. Toca uno para marcarlo como sabido:</p>
      <div class="chipsrow">${flojas.map(k =>
        `<button class="piece" data-id="${esc(k)}">${esc(etiqueta(k))}</button>`).join('')}</div>` : '');

  $('#histBody').querySelectorAll('.piece[data-id]').forEach(b =>
    b.onclick = () => accionMarcarSabido(b.dataset.id));

  /* Una barra por unidad: cuánto se ha visto y cuánto está firme sobre el
     total de la unidad. Con nueve unidades es lo único que dice dónde vas. */
  const filas = UNIDADES.filter(u => u.estado === 'lista').map(u => {
    const total = armarPool({ modos: TODOS_LOS_MODOS, clase:'0', unidades:[u.n] }).length;
    if(!total) return '';
    const pool = armarPool({ modos: TODOS_LOS_MODOS, clase:'0', unidades:[u.n] });
    const vistos = pool.filter(q => prog[q.id]).length;
    const fir    = pool.filter(q => prog[q.id] && prog[q.id].b >= 5).length;
    return `<div class="ubar">
      <div class="ubar-t"><span>Unidad ${u.n} · ${esc(u.es)}</span><span>${vistos} de ${total}</span></div>
      <div class="rail"><i style="width:${Math.round(vistos/total*100)}%"></i>
        <u style="width:${Math.round(fir/total*100)}%"></u></div>
    </div>`;
  }).join('');
  $('#histUnidades').innerHTML = filas
    ? '<h2 class="sec" style="margin:18px 0 10px">Por unidad</h2>' + filas
    : '';
}

async function accionMarcarSabido(id){
  const esta = jubilado(id);
  const r = await dialogo({
    titulo: esc(etiqueta(id)),
    texto: esta
      ? 'Está marcado como sabido: vuelve cada 120 días. ¿Lo devuelvo al repaso normal?'
      : 'Deja de preguntártelo por un tiempo largo. No desaparece: vuelve cada 120 días, y si lo fallas regresa al repaso normal.',
    botones: esta
      ? [{ t:'Devolver al repaso', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
      : [{ t:'Ya la sé', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  if(esta) desmarcarAprendido(id); else marcarAprendido(id);
  pintarInicio();
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

const PANTALLAS = ['scPrimero','scHome','scMenu','scMateria','scPlay','scEnd'];
function ir(pantalla){
  PANTALLAS.forEach(s => $('#'+s).classList.toggle('hide', s !== pantalla));
  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
}

/* ═══════════ pregunta ═══════════ */
function pintarPregunta(){
  const q = cola[idx];
  respondida = false;
  q.reintento = false;

  /* Las tarjetas y las fichas no son preguntas: no entran en el contador ni
     en el marcador (plano 3.5). */
  const preguntas = cola.filter(esPregunta).length;
  const voy = cola.slice(0, idx + 1).filter(esPregunta).length;
  $('#rail').style.width = (idx / cola.length * 100) + '%';
  $('#mCount').textContent = esPregunta(q)
    ? 'Pregunta ' + voy + ' de ' + preguntas
    : (q.tipo === 'ficha' ? 'Ficha' : 'Palabra nueva');
  $('#mScore').textContent = aciertos + ' correctas';
  $('#qTag').textContent = q.tag || (q.tipo === 'ficha' ? 'Antes de seguir' : 'Palabra nueva');
  const t2 = $('#qTag2');
  if(q.tag2){ t2.textContent = q.tag2; t2.classList.remove('hide'); } else t2.classList.add('hide');
  $('#fb').className = 'fb';
  $('#fb').innerHTML = '';

  const B = $('#qBody');

  /* ── tarjeta de palabra nueva ── */
  if(q.tipo === 'nuevo'){
    B.innerHTML =
      `<div class="prompt">${esc(q.jp)}</div>
       <p class="sub">${esc(q.lectura)}</p>
       <div class="prompt es" style="font-size:1.15rem; margin-top:10px">${esc(q.es)}</div>
       <p class="ask">Palabra nueva. La vas a ver preguntada en un momento.</p>`;
    $('#qActs').innerHTML = `<button class="primary" id="btnNext">Entendido</button>`;
    $('#btnNext').onclick = siguiente;
    $('#btnNext').focus();
    $('#fb').classList.remove('show');
    return;
  }

  /* ── ficha de forma o de patron ── */
  if(q.tipo === 'ficha'){
    B.innerHTML =
      `<div class="prompt" style="font-size:1.7rem">${esc(q.ficha.titulo)}</div>
       <p class="sub">${esc(q.ficha.desc || '')}</p>
       <p class="ask">Es la primera vez que sale. Míralo y seguimos.</p>`;
    $('#qActs').innerHTML =
      `<button class="primary" id="btnNext">Entendido</button>` +
      `<button class="ghost thin" id="btnVerFicha">Ver la ficha</button>`;
    $('#btnNext').onclick = siguiente;
    $('#btnVerFicha').onclick = () => verFicha(q.ficha);
    verFicha(q.ficha);
    $('#fb').classList.remove('show');
    return;
  }

  if(q.tipo === 'escribir'){
    B.innerHTML =
      (q.promptEs ? `<div class="prompt es">${esc(q.promptEs)}</div>` : '') +
      (q.promptJp ? `<div class="prompt">${esc(q.promptJp)}</div>` : '') +
      (q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : '') +
      (q.sub ? `<p class="sub">${esc(q.sub)}</p>` : '') +
      (q.pide ? `<p class="ask">Escribe la <b>${esc(q.pide)}</b>${q.formaDesc?' <span class="sub">('+esc(q.formaDesc)+')</span>':''}</p>`
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
       ${q.hintOculto ? '' : `<p class="sub" style="margin-top:12px"><b style="color:var(--ai)">${esc(q.hint)}</b></p>`}
       <p class="sub">${esc(q.sub)}</p>`;
    acciones(true);
    setTimeout(() => $('#inp') && $('#inp').focus(), 30);
  }

  else if(q.tipo === 'opcion'){
    /* El hueco pinta solo el blanco, no los parentesis: el contrato del contenido
       (y lo que el validador exige) es que el `pre` termine en （ y el `post`
       empiece por ）. Anadiendo otro par aqui salia （（　　））. */
    const enunciado =
      q.eleccion === 'patron'
        ? `<div class="prompt es">${esc(q.sub)}</div>
           <div class="gapline" style="margin-top:10px">${esc(q.pre)}<b style="color:var(--ai)">　　</b>${esc(q.post)}${q.post2 ? '<b style="color:var(--ai)">　　</b>' + esc(q.post2) : ''}</div>
           <p class="ask">¿Qué patrón pide este hueco?</p>`
      : q.eleccion === 'forma'
        ? `<div class="prompt">${esc(q.promptJp)}</div>
           ${q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : ''}
           <p class="sub">${esc(q.sub)}</p>
           <p class="ask">¿Cuál es la <b>${esc(q.pide)}</b>?</p>`
      : q.modo === 'grupo'
        ? `<div class="prompt">${esc(q.promptJp)}</div>
           ${q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : ''}
           <p class="sub">${esc(q.sub)}</p>
           <p class="ask">¿De qué grupo es este verbo?</p>`
        : `<div class="prompt">${esc(q.promptJp)}</div>
           <p class="sub">${esc(q.lectura)}</p>
           <p class="ask">¿Qué significa?</p>`;

    B.innerHTML = enunciado +
      `<div class="mc" id="mc">${q.opciones.map((o,i) => `<button data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    $('#mc').querySelectorAll('button').forEach(b => b.onclick = () => {
      if(respondida) return;
      if(b.disabled) return;
      const elegido = q.opciones[+b.dataset.i];
      const bien = elegido === q.correcta;
      /* en el primer fallo con pista no se revela nada todavia */
      if(!bien && !q.reintento && q.pista1){
        resolver(false, 'mal', q.correcta, q);
        return;
      }
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

/* Pinta la pista del primer fallo. No revela la respuesta: deja lo escrito en
   el campo y ofrece "Comprobar de nuevo" y "Ver respuesta" (plano 3.1). */
function pintarPista(q){
  const p = q.pista1;
  const fb = $('#fb');
  fb.className = 'fb show casi';
  let cuerpo = '';

  if(p.clase === 'usos'){
    cuerpo = '<div class="why">' + p.usos.map(x =>
      '<b>' + esc(x.pat) + '</b> · ' + esc(x.uso)).join('<br>') + '</div>';
  } else if(p.clase === 'quita'){
    /* se retira una opcion incorrecta del tablero */
    $('#mc') && $('#mc').querySelectorAll('button').forEach(x => {
      if(q.opciones[+x.dataset.i] === p.quitar){ x.disabled = true; x.style.opacity = '.3'; }
    });
    cuerpo = '<div class="why">Esa no era. Quedan menos opciones.</div>';
  } else if(p.clase === 'pieza'){
    /* se fija la primera pieza en su lugar y se bloquea */
    const pool = $('#pool'), slot = $('#slot');
    if(pool && slot){
      slot.innerHTML = '';
      pool.querySelectorAll('.piece').forEach(b => { b.style.display = ''; });
      const b = [...pool.querySelectorAll('.piece')].find(x => x.textContent === p.pieza);
      if(b){
        const cp = document.createElement('button');
        cp.className = 'piece'; cp.textContent = p.pieza; cp.disabled = true;
        slot.appendChild(cp); b.style.display = 'none';
      }
    }
    cuerpo = '<div class="why">' + esc(p.texto) + '</div>';
  } else if(p.clase === 'esqueleto'){
    cuerpo = '<div class="model">' + esc(p.texto) + '</div>';
  } else {
    cuerpo = '<div class="why">' + esc(p.texto) + '</div>';
  }

  fb.innerHTML = '<div class="head">Casi. Prueba otra vez</div>' + cuerpo;

  const A = $('#qActs');
  const puedeReintentar = q.tipo !== 'opcion';
  A.innerHTML =
    (puedeReintentar ? '<button class="primary" id="btnCheck">Comprobar de nuevo</button>' : '') +
    '<button class="ghost thin" id="btnVer">Ver respuesta</button>';
  if($('#btnCheck')) $('#btnCheck').onclick = comprobar;
  $('#btnVer').onclick = () => {
    if(q.tipo === 'opcion' && $('#mc')){
      $('#mc').querySelectorAll('button').forEach(x => {
        if(q.opciones[+x.dataset.i] === q.correcta) x.classList.add('pick-ok');
        x.disabled = true;
      });
    }
    resolver(false, 'mal', q.modelo, q, true);
  };
  const foco = $('#inp') || $('#btnVer');
  if(foco) foco.focus();
}

/* El progreso se registra en el primer fallo, porque el item no se sabia; el
   segundo intento es aprendizaje y no cambia el registro. En el marcador
   cuenta como fallado aunque el segundo intento acierte, y el resumen lo
   lista aparte como recuperada con pista (plano 3.1). */
function resolver(bien, estado, modelo, q, rendido){
  /* ── primer fallo con pista disponible ── */
  if(estado === 'mal' && !rendido && !q.reintento && q.pista1){
    q.reintento = true;
    if(!q.repaso){
      marcar(q.id, 'mal');
      fallos.push({ q, modelo: q.modelo, conPista: true });
    }
    pintarPista(q);
    return;
  }

  respondida = true;
  const segundoIntento = !!q.reintento;

  /* El repaso del final es una segunda exposicion, no una evaluacion: no
     registra progreso ni cuenta en el marcador (plano 3.4). */
  if(bien && !q.repaso) aciertos++;

  if(!segundoIntento && !q.repaso){
    /* la copia se toma antes de tocar el registro: "La tenía bien" la restaura
       en vez de marcar acierto sobre el registro ya penalizado (Anexo A) */
    q.previo = copiaDe(q.id);
    marcar(q.id, estado);
    if(!bien) fallos.push({ q, modelo });
  } else if(segundoIntento && bien){
    /* recuperada con pista: sale de fallos y entra en su propia lista */
    const i = fallos.findIndex(f => f.q === q);
    if(i >= 0){ recuperadas.push(fallos[i]); fallos.splice(i, 1); }
  }

  const fb = $('#fb');
  fb.className = 'fb show ' + (estado === 'ok' ? 'ok' : estado === 'casi' ? 'casi' : 'no');
  let head = estado === 'ok' ? (segundoIntento ? 'Correcto, con la pista' : 'Correcto')
           : estado === 'casi' ? 'Casi'
           : (rendido ? 'La respuesta era' : 'No');
  let why = '';
  if(estado === 'casi') why = '<div class="why">Lo tenías, pero falla una vocal larga o un kana pequeño. Fíjate en la forma exacta.</div>';
  if(q.lecturaResp && q.lecturaResp !== modelo) why += '<div class="why">Lectura: <b>' + esc(q.lecturaResp) + '</b></div>';
  if(estado !== 'ok' && q.regla) why += '<div class="why">' + esc(q.regla) + '</div>';
  if(estado !== 'ok' && q.nota) why += '<div class="why"><b>Ojo:</b> ' + esc(q.nota) + '</div>';
  /* la correccion ensena la regla, no solo la respuesta */
  if(estado !== 'ok' && q.ejemplo2)
    why += '<div class="why">Misma regla: <b>' + esc(q.ejemplo2.verbo) + ' → ' + esc(q.ejemplo2.salida) + '</b></div>';
  if(estado !== 'ok' && q.modo === 'hueco' && q.hint)
    why += '<div class="why">' + esc(q.hint) + '</div>';
  if(estado !== 'ok' && q.eleccion === 'patron')
    why += '<div class="why">' + esc(usoDelPatron(q.unidad, q.correcta)) + '</div>';

  const cuerpo = (q.modo === 'hueco' && estado !== 'ok')
    ? q.pre + q.ok[0] + q.post + (q.ok2 ? q.ok2[0] + (q.post2 || '') : '')
    : modelo;
  fb.innerHTML = `<div class="head">${head}</div><div class="model">${esc(cuerpo)}</div>${why}`;

  const A = $('#qActs');
  const ultima = idx + 1 >= cola.length;
  A.innerHTML = `<button class="primary" id="btnNext">${ultima ? 'Ver resumen' : 'Siguiente'}</button>` +
    (estado !== 'ok' && !rendido && !segundoIntento && !q.repaso ? `<button class="ghost thin" id="btnOk">La tenía bien</button>` : '') +
    (estado === 'ok' && !segundoIntento && !q.repaso && !jubilado(q.id) ? `<button class="ghost thin" id="btnSabida">Ya la sé</button>` : '');
  $('#btnNext').onclick = siguiente;
  if($('#btnOk')) $('#btnOk').onclick = () => {
    aciertos++;
    restaurar(q.id, q.previo);
    marcar(q.id, 'ok');
    fallos = fallos.filter(f => f.q !== q);
    $('#btnOk').remove();
    $('#mScore').textContent = aciertos + ' correctas';
    fb.className = 'fb show ok';
    fb.querySelector('.head').textContent = 'Marcada como correcta';
  };
  if($('#btnSabida')) $('#btnSabida').onclick = () => {
    marcarAprendido(q.id);
    $('#btnSabida').remove();
    fb.insertAdjacentHTML('beforeend',
      '<div class="why">Marcada como sabida. Vuelve dentro de 120 días.</div>');
  };
  $('#btnNext').focus();
}

/* Los fallados se vuelven a preguntar una vez al final, sin registrar
   progreso y sin contar en el marcador. Es la segunda exposicion que convierte
   el fallo en aprendizaje ese mismo dia (plano 3.4). */
function agregarRepaso(){
  if(repasoPuesto) return false;
  repasoPuesto = true;
  const pendientes = fallos.concat(recuperadas)
    .map(f => f.q)
    .filter((q, i, a) => a.indexOf(q) === i && esPregunta(q));
  if(!pendientes.length) return false;
  for(const q of pendientes){
    const copia = Object.assign({}, q, { repaso:true, reintento:false, previo:null });
    cola.push(copia);
  }
  return true;
}

function siguiente(){
  idx++;
  if(idx >= cola.length){
    if(agregarRepaso()) return pintarPregunta();
    return terminar();
  }
  pintarPregunta();
}

function terminar(){
  $('#rail').style.width = '100%';

  /* Tres conteos y nada mas. En repaso espaciado la sesion no es una prueba, y
     una tasa de fallo alta es el estado normal de quien recien empieza una
     unidad: el porcentaje y las frases de juicio del archivo congelado sobran
     (Anexo B). */
  const nPreg = cola.filter(esPregunta).length;
  $('#endScore').innerHTML =
    `<span>${aciertos}</span> <small>${aciertos === 1 ? 'correcta' : 'correctas'}</small>` +
    (recuperadas.length ? ` · <span>${recuperadas.length}</span> <small>con pista</small>` : '') +
    (fallos.length ? ` · <span>${fallos.length}</span> <small>${fallos.length === 1 ? 'fallada' : 'falladas'}</small>` : '');
  $('#endLine').textContent = nPreg + (nPreg === 1 ? ' pregunta' : ' preguntas') + ' en esta sesión.';

  const miss = $('#endMiss');
  const lista = fallos.concat(recuperadas.map(r => Object.assign({}, r, { pista:true })));
  if(lista.length){
    $('#endMissCard').classList.remove('hide');
    miss.innerHTML = '<tr><th>Pregunta</th><th>Respuesta</th></tr>' + lista.map(f =>
      `<tr><td>${esc(enunciado(f.q))}${f.pista ? '<br><small class="sub">recuperada con pista</small>' : ''}</td>` +
      `<td class="jp">${esc(f.modelo)}</td></tr>`).join('');
  } else $('#endMissCard').classList.add('hide');

  /* Cuántas quedan para hoy: sin esto, el tope por atraso es invisible. */
  const pan = panoramaHoy();
  $('#endPend').textContent = pan.vencidas
    ? 'Te quedan ' + pan.vencidas + ' vencidas para hoy.'
    : 'No queda nada vencido para hoy.';
  $('#btnMas').classList.toggle('hide', !pan.vencidas && !pan.nuevas);

  ir('scEnd');
  pintarHistorial();
}

/* "Seguir 10 más": arma otra cola con la misma regla. Es lo que cubre la
   sesión de quince minutos sin agregar una opción de sesión por tiempo. */
function seguirMas(){
  const guardado = sel.largo;
  sel.largo = 10;
  const r = construir(false);
  sel.largo = guardado;
  if(!r.cola.length){
    dialogo({ titulo:'No queda nada por ahora', texto:'Vuelve mañana, o usa "Elegir qué practicar" para repasar lo que quieras.' });
    return;
  }
  idx = 0; aciertos = 0; fallos = []; recuperadas = []; repasoPuesto = false;
  ir('scPlay'); pintarPregunta();
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

/* ═══════════ material de estudio ═══════════ */

/* La ficha se arma como HTML porque tiene tabla y ejemplos; `dialogo` recibe
   texto plano, así que el material usa su propio contenedor sobre el mismo
   velo. Es el único sitio que necesita marcado dentro del diálogo. */
function verFicha(f){
  if(!f) return;
  const d = $('#dlg');
  let cuerpo = '';

  if(f.uso) cuerpo += `<p class="f-uso">${esc(f.uso)}</p>`;

  if(f.tipo === 'forma'){
    cuerpo += `<div class="tblwrap"><table><tr><th>Grupo</th><th>Verbo</th><th>Queda en</th></tr>` +
      f.grupos.map(g => `<tr>
        <td>${g.g}</td>
        <td class="jp">${esc(g.verbo)}<small class="sub" style="display:block">${esc(g.es)}</small></td>
        <td class="jp">${esc(g.salida)}${g.salida !== g.lectura ? `<small class="sub" style="display:block">${esc(g.lectura)}</small>` : ''}</td>
      </tr>`).join('') + `</table></div>`;
    const reglas = f.grupos.filter(g => g.regla);
    if(reglas.length) cuerpo += `<p class="f-nota">${reglas.map(g => esc(g.regla)).join('<br>')}</p>`;
    if(f.exc.length) cuerpo += `<p class="f-nota"><b>Excepciones:</b> ` +
      f.exc.map(e => esc(e.kana) + ' → ' + esc(e.salida)).join(' · ') + `</p>`;
  } else {
    /* Como se construye. "Se pega a la forma simple" no le dice a nadie que
       poner: la formula nombra cada pieza y el orden en que van. */
    if(f.formula) cuerpo +=
      `<h2 class="sec" style="margin:18px 0 8px">Cómo se construye</h2>
       <div class="f-formula">${esc(f.formula)}</div>`;
    if(f.frases.length) cuerpo += `<h2 class="sec" style="margin:18px 0 8px">En el libro</h2>`;
    cuerpo += f.frases.map(x =>
      `<div class="f-ej">${esc(x.jp)}${x.es ? `<small>${esc(x.es)}</small>` : ''}</div>`).join('');
    if(f.huecos) cuerpo += `<p class="f-nota">Lo practicas en ${plural(f.huecos, 'ejercicio')} de hueco.</p>`;
  }

  /* Como se lee y que significa el termino. Sin esto, 他動詞 obliga a salir de
     la app a buscarlo. */
  const pie = [f.lectura, f.significado].filter(Boolean).join(' — ');

  d.innerHTML = `<div class="dlgcaja ficha" role="dialog" aria-modal="true">
    <h2 class="sec">${esc(f.desc || '')}</h2>
    <div class="prompt" style="margin:0; font-size:1.7rem">${esc(f.titulo)}</div>
    ${pie ? `<p class="sub" style="margin:4px 0 14px">${esc(pie)}</p>` : '<div style="height:12px"></div>'}
    ${cuerpo}
    <div class="acts"><button class="primary" id="fCerrar">Cerrar</button></div>
  </div>`;
  d.classList.remove('hide');
  const escapar = e => { if(e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); cerrar(); } };
  const cerrar = () => {
    d.classList.add('hide'); d.innerHTML = '';
    document.removeEventListener('keydown', escapar, true);
  };
  $('#fCerrar').onclick = cerrar;
  document.addEventListener('keydown', escapar, true);
  $('#fCerrar').focus();
}

/* "1 ejercicios" delata que nadie leyó la pantalla */
function plural(n, sing, pl){
  if(!n) return '';
  return n + ' ' + (n === 1 ? sing : (pl || sing + 's'));
}

function filaMaterial(titulo, uso, nota, lectura, significado){
  const pie = [lectura, significado].filter(Boolean).join(' — ');
  return `<button class="ghost">
    <span class="m-t"><span class="m-jp">${esc(titulo)}</span>${nota ? `<span class="m-n">${esc(nota)}</span>` : ''}</span>
    ${pie ? `<span class="m-lec">${esc(pie)}</span>` : ''}
    <span class="m-u">${esc(uso || 'Sin descripción todavía.')}</span>
  </button>`;
}

function pintarMateria(){
  const listas = unidadesListas();
  if(!sel.matUnidad || !listas.includes(sel.matUnidad)) sel.matUnidad = unidadActual() || listas[0];

  chips('#matUnidades', listas.map(n => [String(n), 'Unidad ' + n]),
    v => sel.matUnidad === +v, v => { sel.matUnidad = +v; pintarMateria(); });

  const m = materiaDe(sel.matUnidad);
  const cuerpo = $('#matCuerpo');
  if(!m){ cuerpo.innerHTML = '<div class="card"><p class="sub">Esa unidad todavía no tiene contenido.</p></div>'; return; }

  const paginas = m.paginas
    ? 'Clase 1, páginas ' + m.paginas[1] + ' · Clase 2, páginas ' + m.paginas[2]
    : '';

  const bloque = (titulo, filas, extra) => filas
    ? `<div class="card"><h2 class="sec">${titulo}</h2>${extra || ''}<div class="mat">${filas}</div></div>` : '';

  cuerpo.innerHTML =
    `<div class="card">
       <div class="prompt" style="margin:0; font-size:1.6rem">${esc(m.titulo)}</div>
       <p class="sub">${esc(m.es)}${paginas ? ' · ' + esc(paginas) : ''}</p>
       <p class="sub" style="margin-top:8px">${m.gramatica.length} patrones · ${m.formas.length} formas de conjugación · ${m.vocab.length} palabras · ${m.verbos.length} verbos</p>
     </div>` +

    bloque('Patrones gramaticales',
      /* Las frases dejaron de ser ejercicio al retirarse el modo "frase completa":
         sumarlas aquí prometía una práctica que ya no existe. Un patrón sin ningún
         hueco no miente diciendo "0 ejercicios", dice cuántos ejemplos trae. */
      m.gramatica.map(p => filaMaterial(p.pat, p.uso,
        p.huecos ? plural(p.huecos, 'ejercicio') : plural(p.frases, 'ejemplo'),
        p.lectura, p.es)).join(''),
      '<p class="sub" style="margin:-6px 0 12px">Toca uno para ver el ejemplo y dónde se practica.</p>') +

    bloque('Formas de conjugación',
      m.formas.map(f => filaMaterial(f.label, f.uso, f.clases.length === 2 ? 'las dos clases' : 'clase ' + f.clases[0], f.lectura, f.desc)).join(''),
      '<p class="sub" style="margin:-6px 0 12px">Toca una para ver la regla de cada grupo con un ejemplo.</p>') +

    bloque('Expresiones y fórmulas',
      m.expresiones.map(p => filaMaterial(p.pat, p.uso, '', p.lectura, p.es)).join('')) +

    `<div class="card"><h2 class="sec">Verbos</h2><div class="matlista">` +
      m.verbos.map(v => `<div><span class="w-jp ${prog['c:'+v.kana+':masu'] ? 'visto' : ''}">${esc(v.kanji || v.kana)}${v.kanji && v.kanji !== v.kana ? `<small> ${esc(v.kana)}</small>` : ''}</span><span class="w-es">${esc(v.es)} · G${v.g}</span></div>`).join('') +
    `</div></div>` +

    `<div class="card"><h2 class="sec">Vocabulario</h2><div class="matlista">` +
      m.vocab.map(v => `<div><span class="w-jp ${prog['v:'+v.jp+':jp'] ? 'visto' : ''}">${esc(v.jp)}${v.kana !== v.jp ? `<small> ${esc(v.kana)}</small>` : ''}</span><span class="w-es">${esc(v.es)}</span></div>`).join('') +
    `</div><p class="sub" style="margin-top:10px">En verde, lo que ya has visto en alguna sesión.</p></div>` +

    (m.kanji.length ? `<div class="card"><h2 class="sec">Palabras con kanji</h2><div class="matlista">` +
      m.kanji.map(v => `<div><span class="w-jp">${esc(v.jp)}</span><span class="w-es">${esc(v.kana)}</span></div>`).join('') +
    `</div><p class="sub" style="margin-top:10px">El kanji es de reconocimiento: se lee y se identifica, no se escribe.</p></div>` : '');

  /* cablear las fichas por posición dentro de cada bloque */
  const fuentes = [
    m.gramatica.map(p => () => fichaPatron(m.n, p.pat)),
    m.formas.map(f => () => fichaForma(f.id)),
    m.expresiones.map(p => () => fichaPatron(m.n, p.pat)),
  ].filter(x => x.length);
  [...cuerpo.querySelectorAll('.mat')].forEach((bl, i) => {
    [...bl.querySelectorAll('button')].forEach((b, j) => {
      if(fuentes[i] && fuentes[i][j]) b.onclick = () => verFicha(fuentes[i][j]());
    });
  });
}

/* ═══════════ contenido suelto y versión nueva ═══════════ */

/* Con la build --sin-contenido, la app llega vacía y el contenido se carga una
   vez desde un archivo. Queda en localStorage y no se vuelve a pedir; nueve
   unidades a la densidad del Tema 8 pesan bastante menos que el límite
   habitual de 5 MB (plano 6.5). */
const hayContenido = () => UNIDADES.length > 0;

async function aplicarContenido(texto){
  let d;
  try { d = JSON.parse(texto); } catch(e){
    await dialogo({ titulo:'No se pudo cargar', texto:'El archivo no es JSON válido.' });
    return false;
  }
  if(!d || !Array.isArray(d.unidades) || !d.unidades.length){
    await dialogo({ titulo:'No se pudo cargar', texto:'Ese archivo no trae el contenido de ninguna unidad.' });
    return false;
  }
  if(!escribirLS(LS_CONTENIDO, d)){
    await dialogo({ titulo:'No se pudo guardar', texto:'El navegador no dejó guardar el contenido en este dispositivo.' });
    return false;
  }
  await dialogo({
    titulo:'Contenido cargado',
    texto: d.unidades.length + (d.unidades.length === 1 ? ' unidad' : ' unidades') +
           '. La app se reinicia para usarlo.'
  });
  location.reload();
  return true;
}

function accionCargarContenido(){
  const inp = $('#fileContenido');
  inp.value = '';
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if(!f) return;
    const fr = new FileReader();
    fr.onload = () => aplicarContenido(String(fr.result || ''));
    fr.onerror = () => dialogo({ titulo:'No se pudo leer el archivo' });
    fr.readAsText(f);
  };
  inp.click();
}

/* El aviso de versión es propio, no el del navegador: en una PWA instalada el
   diálogo del sistema muestra el origen y rompe la ilusión de app (plano 6.4). */
async function avisarVersionNueva(nuevo){
  const r = await dialogo({
    titulo: 'Hay una versión nueva',
    texto: 'Se instaló una actualización. Tu progreso no se toca.',
    botones: [{ t:'Actualizar', v:'ok', p:true }, { t:'Más tarde', v:null, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  nuevo.postMessage('skipWaiting');
}

/* El archivo único abierto desde un origen opaco no guarda nada entre
   aperturas, y el usuario lo descubre con el historial vacío. Solo se avisa
   cuando el almacenamiento falla de verdad, no por el hecho de ser un archivo:
   guardado en una carpeta y abierto siempre igual, funciona (sección 10). */
function avisarSiNoGuarda(){
  if(location.protocol === 'http:' || location.protocol === 'https:') return;
  let guarda = false;
  try {
    localStorage.setItem('dojo-prueba', '1');
    guarda = localStorage.getItem('dojo-prueba') === '1';
    localStorage.removeItem('dojo-prueba');
  } catch(e){ guarda = false; }
  if(guarda) return;
  dialogo({
    titulo: 'Aquí no se puede guardar tu progreso',
    texto: 'Estás abriendo el archivo desde un sitio donde el navegador no deja guardar nada. ' +
           'Guárdalo en una carpeta y ábrelo siempre desde ahí, o instala la app desde su dirección.'
  });
}
