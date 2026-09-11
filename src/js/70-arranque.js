/* Dojo Marugoto - arranque
   El almacen se inicia antes del primer render, porque puede migrar desde el
   Tema 8, y de ahi sale si toca la pantalla de primer uso o el inicio. */

/* `manual` distingue la sesion del menu de la de "Practicar hoy". Las dos
   pasan por el mismo programador; lo unico que cambia es el pool (plano 2.4). */
function empezar(manual){
  const r = construir(!!manual);
  if(!cola.length){
    dialogo({
      titulo: 'No hay preguntas con esa combinación',
      texto: manual
        ? 'Prueba con otra unidad, otra clase, o marca otro modo.'
        : 'Todavía no hay contenido para practicar.'
    });
    return;
  }
  idx = 0; aciertos = 0; fallos = []; recuperadas = []; repasoPuesto = false;
  ir('scPlay'); pintarPregunta();
  return r;
}

$('#btnStart').onclick       = () => empezar(false);
$('#btnStartManual').onclick = () => empezar(true);
$('#btnMas').onclick         = seguirMas;
$('#btnMenu').onclick        = () => { pintarMenu(); ir('scMenu'); };
$('#btnVolver').onclick      = () => { pintarInicio(); ir('scHome'); };
$('#btnMateria').onclick     = () => { pintarMateria(); ir('scMateria'); };
$('#btnFormas').onclick      = () => { pintarFormas(); ir('scFormas'); };
/* El ← se limita a retroceder en el historial y deja que popstate haga el
   trabajo: así la tecla del celular y el botón siguen exactamente el mismo
   camino. Si por lo que sea no hay entrada a la que volver, vuelve a mano. */
$('#btnAtras').onclick       = () => {
  if(history.state && history.state.p && history.state.p !== 'scHome') history.back();
  else atras(false);
};
window.addEventListener('popstate', () => atras(true));
$('#btnMatVolver').onclick   = () => { pintarInicio(); ir('scHome'); };
$('#btnHome').onclick        = () => { pintarInicio(); ir('scHome'); };
$('#btnQuit').onclick        = () => { cola = cola.slice(0, idx); terminar(); };

$('#btnPrimero').onclick = () => {
  sel.primerUso = false; saveCfg();
  pintarInicio(); ir('scHome');
};

$('#btnCargar').onclick  = accionCargarContenido;
$('#btnExport').onclick = accionExportar;
$('#btnImport').onclick = accionImportar;
$('#btnPaste').onclick  = accionPegar;
$('#btnUndo').onclick   = accionDeshacer;
$('#btnReset').onclick  = accionBorrar;

document.addEventListener('keydown', e => {
  if(!$('#dlg').classList.contains('hide')) return;   /* el dialogo maneja el suyo */
  if($('#scPlay').classList.contains('hide')) return;
  if(e.key === 'Enter'){
    e.preventDefault();
    if(respondida){ siguiente(); }
    else if($('#btnCheck')) comprobar();
  }
});

iniciarProgreso();

/* Las dos preguntas del primer uso solo aparecen con el almacen vacio y sin
   migracion: quien ya tenia historial no pasa por ahi (Anexo B). */
if(sel.primerUso && !Object.keys(prog).length && unidadesListas().length){
  pintarPrimerUso();
  ir('scPrimero');
} else {
  if(sel.primerUso){ sel.primerUso = false; saveCfg(); }
  pintarInicio();
  ir('scHome');
}

/* El aviso de migracion se muestra una sola vez, en el arranque en que ocurre.
   Si algun id no se pudo traducir se dice cuantos: con la tabla bien generada
   debe estar vacio, y la prueba de M1 lo exige (plano 5.2). */
if(avisoMigracion){
  dialogo({
    titulo: 'Tu historial del Tema 8 se trajo a la versión nueva',
    texto: avisoMigracion.items + ' ítems' +
      (avisoMigracion.perdidos.length
        ? '. ' + avisoMigracion.perdidos.length + ' no se pudieron traducir y se descartaron.'
        : '. Nada se perdió.') +
      ' Tu progreso antiguo queda intacto por si acaso.'
  });
}

/* ═══════════ service worker ═══════════ */

/* Solo en la salida PWA: el archivo único no lleva manifest, y desde file://
   el service worker no existe. La detección es el propio manifest, así que no
   hace falta ninguna bandera del build. */
if('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]')){
  navigator.serviceWorker.register('./sw.js').then(reg => {
    reg.update();
    reg.addEventListener('updatefound', () => {
      const nuevo = reg.installing;
      if(!nuevo) return;
      nuevo.addEventListener('statechange', () => {
        /* hay controlador previo: es una actualizacion, no la primera visita */
        if(nuevo.state === 'installed' && navigator.serviceWorker.controller){
          avisarVersionNueva(nuevo);
        }
      });
    });
  }).catch(() => {});

  let recargando = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(recargando) return;
    recargando = true;
    location.reload();
  });
}

avisarSiNoGuarda();
