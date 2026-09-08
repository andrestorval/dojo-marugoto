/* Dojo Marugoto - arranque
   M1: el almacen se inicia antes del primer render, porque puede migrar desde
   el Tema 8, y los botones de progreso se cablean aqui. */

function empezar(){
  construir();
  if(!cola.length){
    dialogo({
      titulo: 'No hay preguntas con esa combinación',
      texto: 'Prueba con otra clase o marca otro modo.'
    });
    return;
  }
  idx = 0; aciertos = 0; fallos = [];
  ir('scPlay'); pintarPregunta();
}

$('#btnStart').onclick = empezar;
$('#btnAgain').onclick = empezar;
$('#btnHome').onclick = () => { pintarInicio(); ir('scHome'); };
$('#btnQuit').onclick = () => { cola = cola.slice(0, idx); terminar(); };

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
pintarInicio();

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
