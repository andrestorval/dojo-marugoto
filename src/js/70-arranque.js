/* Dojo Marugoto - arranque
   empezar, cableado de botones y primer render.
   Contenido literal del archivo congelado. */

function empezar(){
  construir();
  if(!cola.length){ alert('No hay preguntas con esa combinación. Prueba con otra clase u otro modo.'); return; }
  idx = 0; aciertos = 0; fallos = [];
  ir('scPlay'); pintarPregunta();
}

$('#btnStart').onclick = empezar;
$('#btnAgain').onclick = empezar;
$('#btnHome').onclick = () => { pintarInicio(); ir('scHome'); };
$('#btnQuit').onclick = () => { cola = cola.slice(0, idx); terminar(); };
$('#btnReset').onclick = () => {
  if(confirm('¿Borrar todo tu progreso guardado en este dispositivo?')){
    prog = {}; save(); pintarHistorial();
  }
};

document.addEventListener('keydown', e => {
  if($('#scPlay').classList.contains('hide')) return;
  if(e.key === 'Enter'){
    e.preventDefault();
    if(respondida){ siguiente(); }
    else if($('#btnCheck')) comprobar();
  }
});

pintarInicio();
