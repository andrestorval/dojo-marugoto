/* Dojo Marugoto - normalizador
   romaji a kana, katakana a hiragana, choon, vocales largas
   y comparacion. Contenido literal del archivo congelado. */

function romajiAKana(txt) {
  let s = txt.toLowerCase()
    .replace(/ā/g,'aa').replace(/ī/g,'ii').replace(/ū/g,'uu')
    .replace(/ē/g,'ee').replace(/ō/g,'ou')
    .replace(/â/g,'aa').replace(/î/g,'ii').replace(/û/g,'uu')
    .replace(/ê/g,'ee').replace(/ô/g,'ou');
  let out = '', i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (!/[a-z'\-]/.test(ch)) { out += ch; i++; continue; }
    /* ん */
    if (ch === 'n') {
      if (s[i+1] === "'" || s[i+1] === '-') { out += 'ん'; i += 2; continue; }
      if (s[i+1] === 'n') { out += 'ん'; i += 1; continue; }
      if (!s[i+1] || !/[aiueoy]/.test(s[i+1])) { out += 'ん'; i++; continue; }
    }
    /* っ  (consonante doble, salvo n) */
    if (ch === s[i+1] && /[bcdfghjkmpqrstvwxyz]/.test(ch)) { out += 'っ'; i++; continue; }
    let hecho = false;
    for (let len = 3; len >= 1; len--) {
      const trozo = s.substr(i, len);
      if (RK[trozo]) { out += RK[trozo]; i += len; hecho = true; break; }
    }
    if (!hecho) { out += ch; i++; }
  }
  return out;
}

function kataAHira(s) {
  return s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/* ー se convierte en la vocal de la sílaba anterior */
function expandirChoon(s) {
  let out = '';
  for (const c of s) {
    if ((c === 'ー' || c === '－' || c === '—') && out.length) {
      out += FILA[out[out.length - 1]] || '';
    } else out += c;
  }
  return out;
}

/* quita las vocales de alargamiento: すうつけえす → すつけす, そうです → そです */
function quitarLargas(s) {
  let out = '';
  for (const c of s) {
    const prev = out[out.length - 1];
    const fila = prev ? FILA[prev] : null;
    if (fila && /[あいうえお]/.test(c) && (c === fila || c === CHOON[fila])) continue;
    out += c;
  }
  return out;
}

/* nivel estricto: acepta kana, kanji o rōmaji, pero exige la lectura exacta */
function normEstricta(s) {
  if (!s) return '';
  let t = s.trim();
  if (/[a-zA-Zāīūēō]/.test(t) && !/[぀-ヿ一-龯]/.test(t)) t = romajiAKana(t);
  t = kataAHira(t);
  t = expandirChoon(t);
  return t.replace(BASURA, '');
}

/* nivel tolerante: además colapsa vocales largas (すうつけえす = すつけす) */
function normSuelta(s) {
  return quitarLargas(normEstricta(s));
}

/**
 * Compara la respuesta del usuario contra la lista de aceptadas.
 * Devuelve { estado: 'ok' | 'casi' | 'mal', modelo }
 *  - ok   : coincide exactamente (en kana, kanji o rōmaji)
 *  - casi : coincide salvo vocales largas / kana pequeño
 */
function revisar(usuario, aceptadas) {
  const u = normEstricta(usuario);
  if (!u) return { estado: 'mal', modelo: aceptadas[0] };
  for (const a of aceptadas) {
    if (normEstricta(a) === u) return { estado: 'ok', modelo: a };
  }
  const us = normSuelta(usuario);
  for (const a of aceptadas) {
    if (normSuelta(a) === us) return { estado: 'casi', modelo: a };
  }
  return { estado: 'mal', modelo: aceptadas[0] };
}
