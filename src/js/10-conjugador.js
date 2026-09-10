/* Dojo Marugoto - conjugador
   conjugar, conKanji, aceptadasDeConjugacion, reglaDe.
   Contenido literal del archivo congelado. */

function conjugar(v, forma) {
  const k = v.kana;

  if (v.g === 3) {
    if (k.endsWith('する')) return k.slice(0, -2) + SURU[forma];
    if (k.endsWith('くる')) return k.slice(0, -2) + KURU[forma];
    return k;
  }

  let out;

  if (v.g === 2) {
    const st = k.slice(0, -1);              // quita る
    switch (forma) {
      case 'masu':    out = st + 'ます'; break;
      case 'masen':   out = st + 'ません'; break;
      case 'nai':     out = st + 'ない'; break;
      case 'nakatta': out = st + 'なかった'; break;
      case 'ta':      out = st + 'た'; break;
      case 'te':      out = st + 'て'; break;
      case 'nagara':  out = st + 'ながら'; break;
      case 'tari':    out = st + 'たり'; break;
      case 'pot':     out = st + 'られる'; break;
      case 'imp':     out = st + 'ろ'; break;
      case 'sou':     out = k + 'そうです'; break;
      case 'atode':   out = st + 'た後で'; break;
      case 'tara':    out = st + 'たら'; break;
      case 'tai':     out = st + 'たいです'; break;
      case 'yasui':   out = st + 'やすいです'; break;
      case 'koto':    out = k + 'ことができます'; break;
      case 'nara':    out = k + 'なら'; break;
      case 'tte':     out = k + 'って言ってました'; break;
      case 'na':      out = k + 'な'; break;
      case 'meishi':  out = st; break;
      case 'nakereba': out = st + 'なければなりません'; break;
      case 'nakya':    out = st + 'なきゃいけません'; break;
    }
  } else {                                   // grupo 1
    const last = k.slice(-1);
    const st = k.slice(0, -1);
    const te = st + TE1[last];
    const ta = te.replace(/て$/, 'た').replace(/で$/, 'だ');
    switch (forma) {
      case 'masu':    out = st + U2I[last] + 'ます'; break;
      case 'masen':   out = st + U2I[last] + 'ません'; break;
      case 'nai':     out = st + U2A[last] + 'ない'; break;
      case 'nakatta': out = st + U2A[last] + 'なかった'; break;
      case 'ta':      out = ta; break;
      case 'te':      out = te; break;
      case 'nagara':  out = st + U2I[last] + 'ながら'; break;
      case 'tari':    out = ta + 'り'; break;
      case 'pot':     out = st + U2E[last] + 'る'; break;
      case 'imp':     out = st + U2E[last]; break;
      case 'sou':     out = k + 'そうです'; break;
      case 'atode':   out = ta + '後で'; break;
      case 'tara':    out = ta + 'ら'; break;
      case 'tai':     out = st + U2I[last] + 'たいです'; break;
      case 'yasui':   out = st + U2I[last] + 'やすいです'; break;
      case 'koto':    out = k + 'ことができます'; break;
      case 'nara':    out = k + 'なら'; break;
      case 'tte':     out = k + 'って言ってました'; break;
      case 'na':      out = k + 'な'; break;
      case 'meishi':  out = st + U2I[last]; break;
      case 'nakereba': out = st + U2A[last] + 'なければなりません'; break;
      case 'nakya':    out = st + U2A[last] + 'なきゃいけません'; break;
    }
  }

  const e = EXC[k];
  if (e && e[forma] !== undefined) out = e[forma];
  return out;
}

/* proyecta la forma en kana sobre la escritura con kanji */
function conKanji(v, kanaConj) {
  if (!v.kanji || v.kanji === v.kana) return null;
  let i = 0;
  while (i < v.kanji.length && i < v.kana.length &&
         v.kanji[v.kanji.length - 1 - i] === v.kana[v.kana.length - 1 - i]) i++;
  const cabezaKanji = v.kanji.slice(0, v.kanji.length - i);
  const cabezaKana  = v.kana.slice(0, v.kana.length - i);
  if (!kanaConj.startsWith(cabezaKana)) return null;
  return cabezaKanji + kanaConj.slice(cabezaKana.length);
}

/* respuestas aceptadas para una conjugación: kana + kanji */
function aceptadasDeConjugacion(v, forma) {
  const kana = conjugar(v, forma);
  const kanji = conKanji(v, kana);
  const set = [kana];
  if (kanji && kanji !== kana) set.unshift(kanji);
  /* 後で también se escribe あとで */
  set.slice().forEach(x => {
    if (x.includes('後で')) set.push(x.replace('後で', 'あとで'));
  });
  return set;
}

/* explica el movimiento de sílaba, que es lo que de verdad cuesta */
function reglaDe(v, forma){
  if(v.g === 3) return 'Grupo 3: する y くる van de memoria.';
  if(v.g === 2){
    const mapa = { masu:'ます', masen:'ません', nai:'ない', nakatta:'なかった', ta:'た', te:'て',
                   nagara:'ながら', tari:'たり', pot:'られる', imp:'ろ', atode:'た後で',
                   tara:'たら', tai:'たいです', yasui:'やすいです',
                   nakereba:'なければなりません', nakya:'なきゃいけません' };
    /* na y meishi no siguen el molde "quita る y pon X": el prohibitivo se pega
       a la forma de diccionario entera (忘れるな, no 忘れな) y la raiz
       sustantivada no anade nada detras. Con el mapa mentian. */
    if(forma === 'na') return 'Grupo 2: forma diccionario + な. El る no se quita.';
    if(forma === 'meishi') return 'Grupo 2: quita る y ahí se queda: la raíz sola ya es el sustantivo.';
    if(forma === 'sou') return 'Grupo 2: forma diccionario + そうです.';
    if(forma === 'koto') return 'Grupo 2: forma diccionario + ことができます.';
    if(forma === 'nara') return 'Grupo 2: forma diccionario + なら.';
    if(forma === 'tte') return 'Grupo 2: forma diccionario + って言ってました.';
    return 'Grupo 2: quita る y pon ' + (mapa[forma] || '') + '.';
  }
  const u = v.kana.slice(-1);
  if(forma === 'sou') return 'Grupo 1: forma diccionario + そうです.';
  if(forma === 'koto') return 'Grupo 1: forma diccionario + ことができます.';
  if(forma === 'nara') return 'Grupo 1: forma diccionario + なら.';
  if(forma === 'tte') return 'Grupo 1: forma diccionario + って言ってました.';
  if(forma === 'na')  return 'Grupo 1: forma diccionario + な. No cambia el verbo.';
  if(forma === 'nai' || forma === 'nakatta' || forma === 'nakereba' || forma === 'nakya')
    return 'Grupo 1: ' + u + ' → ' + U2A[u] + (u === 'う' ? ' (う nunca pasa a あ)' : '') + ' + ' +
      ({ nai:'ない', nakatta:'なかった', nakereba:'なければなりません', nakya:'なきゃいけません' })[forma] + '.';
  if(forma === 'meishi')
    return 'Grupo 1: ' + u + ' → ' + U2I[u] + ', y ahí se queda: la raíz sola ya es el sustantivo.';
  if(forma === 'masu' || forma === 'masen' || forma === 'nagara' || forma === 'tai' || forma === 'yasui')
    return 'Grupo 1: ' + u + ' → ' + U2I[u] + ' + ' +
      ({ nagara:'ながら', masu:'ます', masen:'ません', tai:'たいです', yasui:'やすいです' })[forma] + '.';
  if(forma === 'pot') return 'Grupo 1: ' + u + ' → ' + U2E[u] + ' + る.';
  if(forma === 'imp') return 'Grupo 1: ' + u + ' → ' + U2E[u] + '.';
  if(forma === 'te' || forma === 'ta' || forma === 'tari' || forma === 'atode' || forma === 'tara'){
    const te = TE1[u], ta = te.replace(/て$/,'た').replace(/で$/,'だ');
    return 'Grupo 1: ' + u + ' → ' + (forma === 'te' ? te : ta) + (forma === 'tara' ? ' + ら' : '') + '.';
  }
  return '';
}
