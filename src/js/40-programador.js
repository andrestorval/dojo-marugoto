/* Dojo Marugoto - programador de repaso espaciado
   Escalera de intervalos, transiciones por resultado, marcado manual y
   seleccion de la sesion (plano 2.2 a 2.5). */

/* paso 0 -> hoy, 1 -> 1 dia, 2 -> 3, 3 -> 7, 4 -> 14, 5 -> 30, 6 -> 60, 7 -> 120.
   Desde el paso 7 el intervalo se duplica en cada acierto con tope de 365.
   Escalera fija y no factor de facilidad por item: el factor solo aporta con
   historiales largos y con sesiones de veinte respuestas la diferencia
   practica es nula (plano 2.2). */
const ESCALERA = [0, 1, 3, 7, 14, 30, 60, 120];
const TOPE_INTERVALO = 365;
const PASO_MAX = 7;

/* Marcado manual: el item no desaparece, se va al intervalo mas largo de la
   escalera y sigue en el calendario. Un fallo lo devuelve al programador
   normal (plano 2.3 y 8.4). */
const MAN_PASO = 7, MAN_INT = 120;
const DESMAN_PASO = 4, DESMAN_INT = 14;

/* Muta el registro segun el resultado. Es la unica funcion que decide cuando
   vuelve un item. */
function transicion(r, resultado, dia){
  r.v++; r.last = dia;
  if(resultado === 'ok'){
    if(r.b < PASO_MAX){ r.b++; r.int = ESCALERA[r.b]; }
    else { r.int = Math.min(r.int * 2, TOPE_INTERVALO); }
    r.due = dia + r.int;
  } else if(resultado === 'casi'){
    /* no promueve y no castiga, pero reprograma: si no, el item queda
       vencido de forma permanente */
    r.int = Math.max(1, r.int);
    r.due = dia + r.int;
  } else {
    /* Un fallo tras 60 dias merece reconstruirse desde el principio, y
       suavizarlo exigiria un campo de lapsos para no premiar el olvido.
       due = hoy hace que vuelva al final de la misma sesion y que aparezca
       vencido en la siguiente. */
    r.f++; r.b = 0; r.int = 0; r.due = dia; r.man = 0;
  }
  return r;
}

function transicionManual(r, dia){
  r.man = dia; r.b = MAN_PASO; r.int = MAN_INT; r.due = dia + MAN_INT;
  return r;
}
function transicionDesmarcar(r, dia){
  r.man = 0; r.b = DESMAN_PASO; r.int = DESMAN_INT; r.due = dia + DESMAN_INT;
  return r;
}

const esJubilado = (r) => !!(r && r.man);

/* ═══════════ orden de entrada de items nuevos ═══════════ */

/* Reparto por defecto de un cupo de 6. Un orden estricto por tipo produce
   semanas de solo vocabulario antes de la primera conjugacion (Anexo C), asi
   que el cupo se reparte y lo que un tipo no usa pasa al siguiente. */
const REPARTO = [
  { tipos:['vocabJP', 'vocabES'], parte: 2 },
  { tipos:['grupo', 'conj'],      parte: 2 },
  { tipos:['hueco'],              parte: 1 },
  { tipos:['armar'],              parte: 1 }
];

/* Unidades ordenadas desde la que se cursa hacia abajo y despues hacia
   arriba: lo util para la clase en curso es la unidad en curso y, despues, lo
   recien visto (plano 2.5). */
function ordenUnidades(unidadActual){
  const ns = UNIDADES.map(u => u.n);
  const abajo = ns.filter(n => n <= unidadActual).sort((a,b) => b - a);
  const arriba = ns.filter(n => n > unidadActual).sort((a,b) => a - b);
  return abajo.concat(arriba);
}

/* Un item nuevo solo entra si lo que lo precede ya se vio: sin esto la app
   pide producir antes de reconocer.

   La condicion se exige solo cuando el requisito esta en el pool de esta
   sesion. Un porton que no puede abrirse no es un porton, es un muro: si el
   usuario pidio en el menu solo "vocabulario escribir", o si los huecos de la
   unidad todavia no llevan `pat` (lo agrega M3), la regla no debe dejar la
   sesion vacia. */
function dependenciaCumplida(q, idsPool){
  const enPool = (id) => !idsPool || idsPool.has(id);

  if(q.modo === 'vocabES'){
    /* una palabra entra a escribir cuando ya se vio en reconocer */
    const req = 'v:' + q.jp + ':jp';
    return !enPool(req) || !!prog[req];
  }
  /* Hubo aquí una regla más: conjugar esperaba a que el ítem de grupo del
     verbo se hubiera visto (plano 3.6, "conjugar sin saber el grupo es
     adivinar"). En el celular se traducía en sesiones enteras de "¿de qué
     grupo es?" sin una sola conjugación, porque cada verbo nuevo gastaba su
     turno en el grupo y la forma llegaba otro día. Patricio la retiró: quiere
     el verbo y la forma desde la primera vez. El ítem de grupo sigue
     existiendo, pero entra después de las formas, como remate. */
  return true;
}

/* Ordena los candidatos nuevos y reparte el cupo entre tipos. Dentro de una
   unidad, primero clase 1; dentro de una clase, el orden de autoria. No hay
   azar aqui: el azar entra en el barajado final de la cola. */
function ordenEntrada(nuevos, cupo, unidadActual, idsPool){
  const orden = ordenUnidades(unidadActual);
  const pos = (q) => {
    const iu = orden.indexOf(q.unidad);
    return (iu < 0 ? 99 : iu) * 1000 + (q.clase === 2 ? 500 : 0) + Math.min(q.orden || 0, 499);
  };

  const candidatos = nuevos.filter(q => dependenciaCumplida(q, idsPool)).sort((a,b) => pos(a) - pos(b));
  const elegidos = [];
  const verbosUsados = new Set();
  const palabrasUsadas = new Set();

  const tomar = (tipos, cuantos) => {
    let n = 0;
    for(const q of candidatos){
      if(n >= cuantos) break;
      if(elegidos.includes(q)) continue;
      if(!tipos.includes(q.modo)) continue;
      /* una sola forma por verbo por sesion: un verbo nuevo no entra con sus
         nueve formas de golpe */
      if(q.modo === 'conj' || q.modo === 'grupo'){
        if(verbosUsados.has(q.kana)) continue;
        verbosUsados.add(q.kana);
      }
      /* y una sola cara por palabra: reconocer y escribir no entran juntas */
      if(q.modo === 'vocabES' || q.modo === 'vocabJP'){
        if(palabrasUsadas.has(q.jp)) continue;
        palabrasUsadas.add(q.jp);
      }
      elegidos.push(q); n++;
    }
    return n;
  };

  /* primera vuelta con el reparto; lo que sobra se reparte en una segunda */
  let libre = cupo;
  for(const r of REPARTO){
    const pedir = Math.min(r.parte, libre);
    if(pedir > 0) libre -= tomar(r.tipos, pedir);
  }
  if(libre > 0) tomar(REPARTO.flatMap(r => r.tipos), libre);
  return elegidos;
}

/* ═══════════ seleccion de la sesion ═══════════ */

function baraja(a){ const r = a.slice(); for(let i=r.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }

/* Devuelve { cola, vencidas, nuevas, atrasados, bloqueaNuevos }.
   El tope por atraso evita que una semana sin practicar produzca una sesion
   de doscientas preguntas: la sesion sigue midiendo `largo`, el inicio informa
   cuantas quedan y el atraso se absorbe en varios dias (plano 2.4). */
function seleccionar(pool, largo, cupoNuevos, unidadActual, dia){
  const conRegistro = pool.filter(q => prog[q.id]);
  const vencidos = conRegistro
    .filter(q => prog[q.id].due <= dia)
    .sort((a,b) => (prog[a.id].due - prog[b.id].due) || (prog[a.id].b - prog[b.id].b));
  const adelantados = conRegistro
    .filter(q => prog[q.id].due > dia && prog[q.id].due <= dia + 3)
    .sort((a,b) => prog[a.id].due - prog[b.id].due);
  const nuevos = pool.filter(q => !prog[q.id]);
  const idsPool = new Set(pool.map(q => q.id));

  const tope = largo > 0 ? largo : pool.length;
  let cola = [], bloqueaNuevos = false, nuevasEnCola = 0;

  if(vencidos.length >= tope){
    cola = vencidos.slice(0, tope);
    bloqueaNuevos = true;
  } else {
    cola = vencidos.slice();
    const cupo = Math.min(cupoNuevos, tope - cola.length);
    const entran = cupo > 0 ? ordenEntrada(nuevos, cupo, unidadActual, idsPool) : [];
    cola = cola.concat(entran);
    nuevasEnCola = entran.length;
    if(cola.length < tope) cola = cola.concat(adelantados.slice(0, tope - cola.length));
    if(cola.length < tope){
      const mas = ordenEntrada(nuevos.filter(q => !entran.includes(q)), tope - cola.length, unidadActual, idsPool);
      cola = cola.concat(mas);
      nuevasEnCola += mas.length;
    }
  }

  return {
    cola: baraja(cola),
    vencidas: vencidos.length,
    nuevas: nuevasEnCola,
    atrasados: Math.max(0, vencidos.length - cola.length),
    bloqueaNuevos
  };
}

/* Cuenta lo que habria en una sesion de hoy, sin armarla. Lo usa el inicio
   para el subtitulo del boton principal. */
function panorama(pool, largo, cupoNuevos, unidadActual, dia){
  const vencidas = pool.filter(q => prog[q.id] && prog[q.id].due <= dia).length;
  const tope = largo > 0 ? largo : pool.length;
  const bloquea = vencidas >= tope;
  const nuevas = bloquea
    ? 0
    : ordenEntrada(pool.filter(q => !prog[q.id]), Math.min(cupoNuevos, tope - vencidas),
                   unidadActual, new Set(pool.map(q => q.id))).length;
  return { vencidas, nuevas, bloquea, total: pool.length };
}
