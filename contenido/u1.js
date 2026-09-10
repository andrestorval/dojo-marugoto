/* Dojo Marugoto - unidad 1, スポーツの試合
   Marugoto A2/B1 Parte 2 - clase 1 = libro p24-29 - clase 2 = p30-33

   Escrita leyendo las paginas del libro escaneado (`Marugoto A2B1.pdf`,
   herramientas/paginas.mjs) y cruzandolas con los indices oficiales, igual
   que la unidad 9.

   Es el tema mas grande del libro: 207 palabras en el indice y 52 verbos,
   contra las 79 y 22 del Tema 9. La razon es que es el primero y el indice
   lista tambien lo basico (あります, みます, かいます...). Aqui entra lo que
   estas diez paginas usan de verdad, mas el recuadro de kanji de p25.

   De donde salen los huecos:
     h1-01 a h1-06  p25, ejercicio 2   (vocabulario del partido)
     h1-07 a h1-12  p26, ejercicio 2   (なら y って言ってました)
     h1-13 a h1-19  p27 y p28          (los dialogos de invitar y cancelar)
     h1-20 a h1-23  p31, ejercicio 2   (なければなりません)
     h1-24 a h1-28  p32, ejercicio 3   (nominalizacion con さ)
     h1-29 a h1-32  p32, ejercicio 4   (と／で／へ／から／まで + の)
     h1-33 a h1-38  p29, p30 y p33     (animar, la disculpa y el correo)

   El corte entre clases es el del libro: la mitad de hablar (p24-29, invitar,
   rechazar, cancelar y animar) y la de leer (p30-33, los correos y los tres
   ultimos cuadros de gramatica). */

CONTENIDO.unidades.push({
  n: 1,
  titulo: "スポーツの試合",
  es: "Partidos y deporte",
  paginas: { 1: "24-29", 2: "30-33" },
  estado: "lista",

  /* Seis formas se estrenan aqui. El imperativo ya existia desde la unidad 8
     y vuelve porque las palabras de animo lo piden entero (がんばれ, 走れ,
     行け, 勝て, しっかりしろ), con 〜な como su pareja negativa. */
  formas: {
    1: ["masu", "masen", "nai", "ta", "te", "nara", "tte", "imp", "na"],
    2: ["masu", "nai", "ta", "te", "pot", "nakereba", "nakya", "meishi"]
  },

  /* --- PATRONES DE LA UNIDAD ------------------------------------
     El indice oficial marca siete patrones 初中級 para el Tema 1, mas que
     ningun otro tema del libro. Los siete estan aqui, con su campo `oficial`
     cuando el nombre del indice y el de la unidad no coinciden letra a letra.
     Los demas salen de los dialogos y de los dos correos.

     Las lineas `uso` y `formula` las redacte yo y las revisa Patricio con el
     libro al lado, igual que en las unidades 8 y 9.
  --------------------------------------------------------------- */
  patrones: [
    { pat:"〜なら", tipo:"gramatica",
      oficial:"～なら",
      lectura:"nara",
      es:"si es que…, en ese caso",
      formula:"forma simple + なら. Sustantivo y adjetivo な van pelados: 日曜日なら",
      uso:"Retoma algo que el otro acaba de decir y pone la condición encima: si es ese el caso, entonces sí. No sirve para una condición que uno mismo introduce.",
      ejemplo:"試合が日曜日なら、だいじょうぶなんですが。" },

    { pat:"〜って言ってました", tipo:"gramatica",
      oficial:"～って言って（い）ました",
      lectura:"〜っていってました · tte itte mashita",
      es:"dijo que…",
      formula:"forma simple + って言ってました. En la boca casi siempre se come el い: 言ってました",
      uso:"Repetir lo que otro dijo, en conversación. Es la versión hablada y llana de 〜と言っていました, y lo que va antes de って siempre va en forma simple.",
      ejemplo:"テレビで、おもしろい試合になるって言ってましたよ。" },

    { pat:"じつは、〜んです", tipo:"gramatica",
      oficial:"実は、～んです",
      lectura:"じつは、〜んです · jitsu wa, ~ n desu",
      es:"la verdad es que…",
      formula:"じつは、+ forma simple + んです. Sustantivo y adjetivo な llevan な: 〜なんです",
      uso:"Anuncia que viene una confesión o una mala noticia. En japonés se avisa antes de soltarla: じつは prepara al otro.",
      ejemplo:"じつは、明日の試合、行けなくなったんです。" },

    { pat:"応援の表現", tipo:"gramatica",
      oficial:"応援の表現",
      lectura:"おうえんのひょうげん · ōen no hyōgen",
      es:"las palabras de ánimo",
      formula:"imperativo (がんばれ) para pedirlo, forma diccionario + な (負けるな) para prohibirlo",
      uso:"Lo que se grita en la grada. Las dos formas son secas, sin cortesía, y en la vida real solo salen aquí, en emergencias y en los letreros.",
      ejemplo:"がんばれ！　もっと走れ！　負けるな！" },

    { pat:"〜なければなりません", tipo:"gramatica",
      oficial:"～なければならない",
      lectura:"〜なければなりません · nakereba narimasen",
      es:"hay que…, no queda otra que…",
      formula:"forma ない, quitando la い, + ければなりません",
      uso:"La obligación: algo que no se puede dejar de hacer. Literalmente «si no lo hago, no vale», que es como el japonés dice «tengo que».",
      ejemplo:"土曜日に父の知り合いを迎えに行かなければなりません。" },

    { pat:"〜なきゃいけません", tipo:"gramatica",
      lectura:"〜なきゃいけません · nakya ikemasen",
      es:"hay que… (hablando)",
      formula:"forma ない, quitando la い, + きゃいけません. なきゃ es なければ comido al hablar",
      uso:"La misma obligación que 〜なければなりません, pero en la boca y no en el papel. Es la que sale al poner una excusa por teléfono.",
      ejemplo:"土曜日に父の知りあいをむかえに行かなきゃいけないんです。" },

    { pat:"〜さ", tipo:"gramatica",
      oficial:"～さ",
      lectura:"sa",
      es:"el hecho de ser…, lo … que es",
      formula:"adjetivo い sin la い + さ (すばらしい → すばらしさ); adjetivo な sin el な + さ (かんたんな → かんたんさ)",
      uso:"Convierte una cualidad en un sustantivo, para poder ponerla de sujeto o de objeto. En español suele salir como «lo maravilloso que es» o «su sencillez».",
      ejemplo:"長友選手のプレーのすばらしさに感動しました。" },

    { pat:"raíz de ます como sustantivo", tipo:"gramatica",
      lectura:"めいしか · meishika",
      es:"el verbo hecho nombre",
      formula:"raíz de ます, sin el ます, y ahí se queda: さそいます → さそい, つかれます → つかれ",
      uso:"El otro camino para fabricar un sustantivo: se corta el verbo en la raíz. さそい es «la invitación»; ひきわけ, «el empate».",
      ejemplo:"勉強が忙しいから、友だちのさそいをことわりました。" },

    { pat:"と／で／へ／から／まで＋の", tipo:"gramatica",
      oficial:"【助詞】のN",
      lectura:"じょし＋の · joshi + no",
      es:"la partícula pegada a un sustantivo",
      formula:"partícula + の + sustantivo. Las cinco que lo admiten: と, で, へ, から, まで. を y が no",
      uso:"Cuando lo que modifica a un sustantivo es un complemento entero: «el partido contra los Mariners» es マリナーズとの試合, no マリナーズの試合.",
      ejemplo:"来月のマリナーズとの試合、一緒に行きましょう。" },

    { pat:"〜んですが、いっしょに〜ませんか", tipo:"expresion",
      lectura:"〜んですが、いっしょに〜ませんか · ~ n desu ga, issho ni ~ masen ka",
      es:"resulta que…, ¿vamos juntos?",
      formula:"forma simple + んですが、いっしょに + raíz de ます + ませんか",
      uso:"La invitación completa: primero el plan que uno ya tiene, luego la propuesta. El が deja la frase abierta para que el otro pueda decir que no.",
      ejemplo:"来週の土曜日、サッカーの試合、見に行くんですが、いっしょに行きませんか。" },

    { pat:"〜たいんですが、だめなんです", tipo:"expresion",
      lectura:"〜たいんですが、だめなんです · ~tai n desu ga, dame nan desu",
      es:"me gustaría, pero no puedo",
      formula:"raíz de ます + たいんですが、だめなんです。+ la razón + から",
      uso:"El rechazo educado. Nunca se dice que no a secas: primero las ganas, después el «no puede ser», y al final el motivo.",
      ejemplo:"行きたいんですが、だめなんです。土曜日はアルバイトがあるから。" },

    { pat:"えんりょします", tipo:"expresion",
      lectura:"えんりょします · enryo shimasu",
      es:"paso, prefiero no",
      formula:"（やっぱり、）えんりょします",
      uso:"Declinar sin dar explicaciones y sin ofender. Literalmente es «me contengo», y es de lo más japonés que hay en esta unidad.",
      ejemplo:"私は、えんりょします。サッカーは、よくわからないから。" },

    { pat:"気にしないで", tipo:"expresion",
      lectura:"きにしないで · ki ni shinaide",
      es:"no te preocupes",
      formula:"気にしないで（ください）. De 気にします, «darle importancia»",
      uso:"Lo que se responde a una disculpa para quitarle peso. Va con だいじょうぶですよ delante casi siempre.",
      ejemplo:"だいじょうぶですよ。気にしないで。" },

    { pat:"〜てすみませんでした", tipo:"expresion",
      lectura:"〜てすみませんでした · te sumimasen deshita",
      es:"perdón por haber…",
      formula:"forma て + すみませんでした",
      uso:"La disculpa por algo ya hecho. El verbo va en forma て y el すみません en pasado, porque el daño ya está.",
      ejemplo:"先日はサッカーの試合、急にキャンセルしてすみませんでした。" },

    { pat:"〜なくなりました", tipo:"gramatica",
      lectura:"〜なくなりました · naku narimashita",
      es:"ya no…, he dejado de poder…",
      formula:"forma ない, quitando la い, + くなりました. Con la potencial: 行ける → 行けなくなりました",
      uso:"Un cambio: antes sí, ahora ya no. Es la manera normal de cancelar algo sin echarle la culpa a nadie.",
      ejemplo:"じつは、明日の試合、行けなくなったんです。" },

    { pat:"〜そうでした", tipo:"gramatica",
      lectura:"〜そうでした · sō deshita",
      es:"parecía…, se le veía…",
      formula:"adjetivo い sin la い + そう; raíz de ます + そう. No confundir con el 〜そうです de «dicen que»",
      uso:"Lo que se ve por fuera: la cara que ponía. くやしそう es «se le veía la rabia», y no que alguien lo contara.",
      ejemplo:"ベアーズが負けたので、ベアーズのファンはくやしそうでした。" },

    { pat:"〜んじゃないか", tipo:"gramatica",
      lectura:"〜んじゃないか · ~ n ja nai ka",
      es:"me temo que…, ¿y si…?",
      formula:"forma simple + んじゃないか（と）+ verbo de sentimiento",
      uso:"Un temor, no una afirmación: uno se teme que pase. Casi siempre va seguido de と思う o de un verbo de emoción.",
      ejemplo:"ベアーズも強いので、負けるんじゃないかとはらはらしました。" },

    { pat:"〜ので", tipo:"gramatica",
      lectura:"node",
      es:"como…, porque…",
      formula:"forma simple + ので. Sustantivo y adjetivo な llevan な: 〜なので",
      uso:"Da la causa de manera neutra, sin insistir. Frente a から, que suena más personal, ので presenta el motivo como un hecho.",
      ejemplo:"有名な選手が試合に出たので、試合がもりあがりました。" },

    { pat:"〜から（りゆう）", tipo:"gramatica",
      lectura:"kara",
      es:"porque…",
      formula:"forma simple o cortés + から. Puede ir al final, después del punto: 〜です。〜から。",
      uso:"La causa dicha en primera persona, y la que se usa al poner una excusa. En el diálogo de p27 va al final, como remate.",
      ejemplo:"土曜日はアルバイトがあるから。" },

    { pat:"〜たら", tipo:"gramatica",
      lectura:"tara",
      es:"cuando…, si…",
      formula:"forma た + ら",
      uso:"Marca el momento o la condición: una vez que eso pase. Aquí sirve para convencer: prueba una vez y verás.",
      ejemplo:"一度、試合を見たら、ファンになりますよ。" },

    { pat:"〜対〜", tipo:"expresion",
      lectura:"〜たい〜 · tai",
      es:"…a… (el marcador)",
      formula:"número + 対 + número. Se lee たい, no つい ni ついて",
      uso:"Cómo se canta un resultado: 2対1 es «dos a uno». Es la palabra del recuadro de kanji de p25 y sale en todo el tema.",
      ejemplo:"2対1で、イーグルズが勝ちました。" },

    { pat:"それなら", tipo:"expresion",
      lectura:"それなら · sore nara",
      es:"en ese caso",
      formula:"それなら、+ lo que uno hará. Es el 〜なら con それ delante",
      uso:"Cambiar de idea a la vista de lo que el otro acaba de decir. Es lo que responde quien se deja convencer.",
      ejemplo:"そうですか。それなら、行ってみます。" }
  ],

  /* --- VERBOS ---------------------------------------------------
     Los del indice del Tema 1 que estas paginas usan. Se dejan fuera los
     que ya estan en las unidades 8 y 9, porque el id de un verbo no lleva
     numero de unidad y seria la misma tarjeta dos veces. Las excepciones
     son がんばる y あきらめる: las palabras de animo de p29 no se sostienen
     sin ellas, y el pool deduplica por id, asi que no hay tarjeta repetida.
  --------------------------------------------------------------- */
  verbos: [
    /* grupo 1 — clase 1 */
    { kana:"さそう", kanji:"さそう", g:1, es:"invitar", c:1 },
    { kana:"ことわる", kanji:"ことわる", g:1, es:"rechazar, declinar", c:1 },
    { kana:"かつ", kanji:"勝つ", g:1, es:"ganar, vencer", c:1 },
    { kana:"はしる", kanji:"走る", g:1, es:"correr", c:1, nota:"Grupo 1, aunque termine en 〜しる" },
    { kana:"もりあがる", kanji:"もりあがる", g:1, es:"animarse (un ambiente)", c:1 },
    { kana:"いう", kanji:"言う", g:1, es:"decir", c:1 },
    { kana:"おもう", kanji:"思う", g:1, es:"pensar, creer", c:1 },
    { kana:"とる", kanji:"とる", g:1, es:"conseguir (una entrada)", c:1 },
    { kana:"やる", kanji:"やる", g:1, es:"hacer, practicar", c:1 },
    { kana:"がんばる", kanji:"がんばる", g:1, es:"esforzarse, aguantar", c:1 },
    /* grupo 1 — clase 2 */
    { kana:"かう", kanji:"買う", g:1, es:"comprar", c:2 },
    { kana:"よむ", kanji:"読む", g:1, es:"leer", c:2 },
    { kana:"わかる", kanji:"わかる", g:1, es:"entender", c:2 },
    { kana:"おこる", kanji:"おこる", g:1, es:"enfadarse", c:2 },
    { kana:"もらう", kanji:"もらう", g:1, es:"recibir", c:2 },

    /* grupo 2 — clase 1 */
    { kana:"まける", kanji:"負ける", g:2, es:"perder, ser derrotado", c:1 },
    { kana:"ひきわける", kanji:"ひきわける", g:2, es:"empatar", c:1 },
    { kana:"みる", kanji:"見る", g:2, es:"ver, mirar", c:1 },
    { kana:"あきらめる", kanji:"あきらめる", g:2, es:"rendirse, desistir", c:1 },
    /* grupo 2 — clase 2 */
    { kana:"むかえる", kanji:"迎える", g:2, es:"ir a buscar a alguien", c:2 },
    { kana:"つかれる", kanji:"つかれる", g:2, es:"cansarse", c:2 },
    { kana:"こたえる", kanji:"答える", g:2, es:"contestar", c:2 },
    { kana:"いる", kanji:"いる", g:2, es:"estar (personas y animales)", c:2 },

    /* grupo 3 — clase 1 */
    { kana:"おうえんする", kanji:"応援する", g:3, es:"animar, apoyar", c:1 },
    { kana:"えんりょする", kanji:"えんりょする", g:3, es:"declinar, contenerse", c:1 },
    { kana:"ゆうしょうする", kanji:"優勝する", g:3, es:"quedar campeón", c:1 },
    { kana:"しっかりする", kanji:"しっかりする", g:3, es:"aguantar, ir en serio", c:1 },
    { kana:"やくそくする", kanji:"やくそくする", g:3, es:"prometer, quedar", c:1 },
    /* grupo 3 — clase 2 */
    { kana:"キャンセルする", kanji:"キャンセルする", g:3, es:"cancelar", c:2 },
    { kana:"しつれいする", kanji:"しつれいする", g:3, es:"despedirse, ser descortés", c:2 },
    { kana:"かんどうする", kanji:"感動する", g:3, es:"emocionarse", c:2 },
    { kana:"わくわくする", kanji:"わくわくする", g:3, es:"estar emocionado, con ilusión", c:2 },
    { kana:"はらはらする", kanji:"はらはらする", g:3, es:"estar en vilo", c:2 },
    { kana:"しゅっちょうする", kanji:"出張する", g:3, es:"viajar por trabajo", c:2 },
    { kana:"べんきょうする", kanji:"勉強する", g:3, es:"estudiar", c:2 }
  ],

  /* --- VOCABULARIO ---------------------------------------------- */
  vocab: [
    /* los deportes y el partido (p24, p25) */
    { jp:"スポーツ", kana:"スポーツ", es:"deporte", c:1, cat:"deporte" },
    { jp:"試合", kana:"しあい", es:"partido, encuentro", c:1, cat:"deporte" },
    { jp:"サッカー", kana:"サッカー", es:"fútbol", c:1, cat:"deporte" },
    { jp:"サッカー場", kana:"サッカーじょう", es:"campo de fútbol", c:1, cat:"deporte" },
    { jp:"やきゅう", kana:"やきゅう", es:"béisbol", c:1, cat:"deporte" },
    { jp:"ラグビー", kana:"ラグビー", es:"rugby", c:1, cat:"deporte" },
    { jp:"テニス", kana:"テニス", es:"tenis", c:1, cat:"deporte" },
    { jp:"アイスホッケー", kana:"アイスホッケー", es:"hockey sobre hielo", c:1, cat:"deporte" },
    { jp:"クリケット", kana:"クリケット", es:"críquet", c:1, cat:"deporte" },
    { jp:"チーム", kana:"チーム", es:"equipo", c:1, cat:"deporte" },
    { jp:"選手", kana:"せんしゅ", es:"jugador, deportista", c:1, cat:"deporte" },
    { jp:"ファン", kana:"ファン", es:"aficionado, fan", c:1, cat:"deporte" },
    { jp:"プレー", kana:"プレー", es:"juego, jugada", c:1, cat:"deporte" },
    { jp:"ルール", kana:"ルール", es:"reglas", c:1, cat:"deporte" },
    { jp:"チケット", kana:"チケット", es:"entrada", c:1, cat:"objetos" },
    { jp:"〜対〜", kana:"〜たい〜", es:"a (2 a 1, en un marcador)", c:1, cat:"deporte" },
    { jp:"ひきわけ", kana:"ひきわけ", es:"empate", c:1, cat:"deporte" },
    { jp:"人気", kana:"にんき", es:"popularidad", c:1, cat:"abstracto" },
    { jp:"マナー", kana:"マナー", es:"modales", c:1, cat:"abstracto" },
    { jp:"強い", kana:"つよい", es:"fuerte", c:1, cat:"deporte" },
    { jp:"弱い", kana:"よわい", es:"débil", c:1, cat:"deporte" },
    { jp:"若い", kana:"わかい", es:"joven", c:1, cat:"persona" },
    { jp:"有名", kana:"ゆうめい", es:"famoso", c:1, cat:"persona" },

    /* invitar, quedar y rechazar (p26, p27, p28) */
    { jp:"さそい", kana:"さそい", es:"invitación", c:1, cat:"abstracto" },
    { jp:"やくそく", kana:"やくそく", es:"cita, compromiso", c:1, cat:"abstracto" },
    { jp:"りゆう", kana:"りゆう", es:"razón, motivo", c:1, cat:"abstracto" },
    { jp:"きょうみ", kana:"きょうみ", es:"interés", c:1, cat:"abstracto" },
    { jp:"外出", kana:"がいしゅつ", es:"salida, salir a la calle", c:1, cat:"abstracto" },
    { jp:"グループ", kana:"グループ", es:"grupo", c:1, cat:"persona" },
    { jp:"友だち", kana:"ともだち", es:"amigo", c:1, cat:"persona" },
    { jp:"知りあい", kana:"しりあい", es:"conocido", c:2, cat:"persona" },
    { jp:"じつは", kana:"じつは", es:"la verdad es que", c:1, cat:"conector" },
    { jp:"それなら", kana:"それなら", es:"en ese caso", c:1, cat:"conector" },
    { jp:"それじゃあ", kana:"それじゃあ", es:"pues nada, quedamos así", c:1, cat:"conector" },
    { jp:"やっぱり", kana:"やっぱり", es:"al final, como pensaba", c:1, cat:"conector" },
    { jp:"ぜひ", kana:"ぜひ", es:"sin falta, de veras", c:1, cat:"conector" },
    { jp:"よかったら", kana:"よかったら", es:"si te parece bien", c:1, cat:"reaccion" },
    { jp:"だいじょうぶ", kana:"だいじょうぶ", es:"no pasa nada, está bien", c:1, cat:"reaccion" },
    { jp:"ざんねん", kana:"ざんねん", es:"qué lástima", c:1, cat:"reaccion" },
    { jp:"だめ", kana:"だめ", es:"no puede ser, no vale", c:1, cat:"reaccion" },
    { jp:"もしもし", kana:"もしもし", es:"¿diga? (al teléfono)", c:1, cat:"reaccion" },
    { jp:"あのう", kana:"あのう", es:"esto…, oiga…", c:1, cat:"reaccion" },
    { jp:"ごめんなさい", kana:"ごめんなさい", es:"lo siento", c:1, cat:"reaccion" },

    /* los sentimientos del partido (p25, p29, p33) */
    { jp:"うれしい", kana:"うれしい", es:"contento", c:1, cat:"sentimiento" },
    { jp:"くやしい", kana:"くやしい", es:"con rabia, dolido", c:1, cat:"sentimiento" },
    { jp:"すばらしい", kana:"すばらしい", es:"magnífico", c:2, cat:"sentimiento" },
    { jp:"大喜び", kana:"おおよろこび", es:"alegría enorme", c:2, cat:"sentimiento" },
    { jp:"つかれ", kana:"つかれ", es:"cansancio", c:2, cat:"sentimiento" },
    { jp:"かんたん", kana:"かんたん", es:"sencillo", c:2, cat:"abstracto" },
    { jp:"ゆたか", kana:"ゆたか", es:"rico, abundante", c:2, cat:"abstracto" },
    { jp:"文化的", kana:"ぶんかてき", es:"cultural", c:2, cat:"abstracto" },
    { jp:"文化", kana:"ぶんか", es:"cultura", c:2, cat:"abstracto" },
    { jp:"ひみつ", kana:"ひみつ", es:"secreto", c:2, cat:"abstracto" },

    /* el correo y la disculpa (p30, p33) */
    { jp:"メール", kana:"メール", es:"correo electrónico", c:2, cat:"correo" },
    { jp:"件名", kana:"けんめい", es:"asunto (de un correo)", c:2, cat:"correo" },
    { jp:"おわび", kana:"おわび", es:"disculpa", c:2, cat:"correo" },
    { jp:"メッセージ", kana:"メッセージ", es:"mensaje", c:2, cat:"correo" },
    { jp:"サイト", kana:"サイト", es:"sitio web", c:2, cat:"correo" },
    { jp:"レポート", kana:"レポート", es:"informe", c:2, cat:"correo" },
    { jp:"しょるい", kana:"しょるい", es:"documentos, papeles", c:2, cat:"objetos" },
    { jp:"先日", kana:"せんじつ", es:"el otro día", c:2, cat:"tiempo" },
    { jp:"急", kana:"きゅう", es:"de repente", c:2, cat:"tiempo" },
    { jp:"さいしょ", kana:"さいしょ", es:"al principio", c:2, cat:"tiempo" },
    { jp:"さいご", kana:"さいご", es:"el final", c:2, cat:"tiempo" },
    { jp:"一度", kana:"いちど", es:"una vez", c:1, cat:"tiempo" },
    { jp:"つぎ", kana:"つぎ", es:"el siguiente", c:1, cat:"tiempo" },
    { jp:"こんど", kana:"こんど", es:"esta vez, la próxima", c:1, cat:"tiempo" },
    { jp:"来週", kana:"らいしゅう", es:"la semana que viene", c:1, cat:"tiempo" },
    { jp:"来月", kana:"らいげつ", es:"el mes que viene", c:1, cat:"tiempo" },
    { jp:"週末", kana:"しゅうまつ", es:"fin de semana", c:1, cat:"tiempo" },
    { jp:"土曜日", kana:"どようび", es:"sábado", c:1, cat:"tiempo" },
    { jp:"日曜日", kana:"にちようび", es:"domingo", c:1, cat:"tiempo" },
    { jp:"あさって", kana:"あさって", es:"pasado mañana", c:2, cat:"tiempo" },
    { jp:"大使館", kana:"たいしかん", es:"embajada", c:2, cat:"objetos" },
    { jp:"通り", kana:"とおり", es:"calle", c:2, cat:"objetos" },
    { jp:"弟", kana:"おとうと", es:"hermano menor", c:2, cat:"persona" },
    { jp:"父", kana:"ちち", es:"mi padre", c:2, cat:"persona" }
  ],

  /* --- FRASES DEL LIBRO -----------------------------------------
     No son un ejercicio: son los ejemplos que la ficha de cada patrón
     muestra bajo "En el libro". Todas salen del libro tal cual.
  --------------------------------------------------------------- */
  frases: [
    { k:"f1-01", es:"Si el partido es el domingo, no hay problema…", c:1, pat:"〜なら",
      ok:["試合が日曜日なら、だいじょうぶなんですが。","しあいがにちようびなら、だいじょうぶなんですが。"] },
    { k:"f1-02", es:"Si va Yamada, yo también voy.", c:1, pat:"〜なら",
      ok:["山田さんが行くなら、私も行きます。","やまださんがいくなら、わたしもいきます。"] },
    { k:"f1-03", es:"Si juega Nagatomo, creo que va a ser un buen partido.", c:1, pat:"〜なら",
      ok:["長友選手が出るなら、おもしろい試合になると思います。","ながともせんしゅがでるなら、おもしろいしあいになるとおもいます。"] },
    { k:"f1-04", es:"En la tele dijeron que va a ser un partido interesante.", c:1, pat:"〜って言ってました",
      ok:["テレビで、おもしろい試合になるって言ってましたよ。","テレビで、おもしろいしあいになるっていってましたよ。"] },
    { k:"f1-05", es:"Yamada dijo que él también va.", c:1, pat:"〜って言ってました",
      ok:["山田さんも行くって、言ってました。","やまださんもいくって、いってました。"] },
    { k:"f1-06", es:"Nakamura dijo que la entrada ya la había comprado.", c:1, pat:"〜って言ってました",
      ok:["試合のチケットは、もう買ったって、言ってました。","しあいのチケットは、もうかったって、いってました。"] },
    { k:"f1-07", es:"El sábado que viene voy a ver el fútbol. ¿Te vienes?", c:1, pat:"〜んですが、いっしょに〜ませんか",
      ok:["来週の土曜日、サッカーの試合、見に行くんですが、いっしょに行きませんか。","らいしゅうのどようび、サッカーのしあい、みにいくんですが、いっしょにいきませんか。"] },
    { k:"f1-08", es:"Me gustaría ir, pero no puedo. El sábado tengo el trabajo.", c:1, pat:"〜たいんですが、だめなんです",
      ok:["行きたいんですが、だめなんです。土曜日はアルバイトがあるから。","いきたいんですが、だめなんです。どようびはアルバイトがあるから。"] },
    { k:"f1-09", es:"El sábado tengo el trabajo, por eso.", c:1, pat:"〜から（りゆう）",
      ok:["土曜日はアルバイトがあるから。","どようびはアルバイトがあるから。"] },
    { k:"f1-10", es:"Yo paso. Es que de fútbol no entiendo mucho.", c:1, pat:"えんりょします",
      ok:["私は、えんりょします。サッカーは、よくわからないから。","わたしは、えんりょします。サッカーは、よくわからないから。"] },
    { k:"f1-11", es:"Ya verás: en cuanto veas un partido, te haces del equipo.", c:1, pat:"〜たら",
      ok:["一度、試合を見たら、ファンになりますよ。","いちど、しあいをみたら、ファンになりますよ。"] },
    { k:"f1-12", es:"Ah, ¿sí? En ese caso, voy a probar.", c:1, pat:"それなら",
      ok:["そうですか。それなら、行ってみます。","そうですか。それなら、いってみます。"] },
    { k:"f1-13", es:"La verdad es que al final no voy a poder ir al partido de mañana.", c:1, pat:"じつは、〜んです",
      ok:["じつは、明日の試合、行けなくなったんです。","じつは、あしたのしあい、いけなくなったんです。"] },
    { k:"f1-14", es:"La verdad es que me viene un conocido de China.", c:1, pat:"じつは、〜んです",
      ok:["じつは、中国から知りあいが日本に来るんです。","じつは、ちゅうごくからしりあいがにほんにくるんです。"] },
    { k:"f1-15", es:"Al final no voy a poder ir.", c:1, pat:"〜なくなりました",
      ok:["行けなくなったんです。","いけなくなったんです。","行けなくなりました。"] },
    { k:"f1-16", es:"No pasa nada. No le des importancia.", c:1, pat:"気にしないで",
      ok:["だいじょうぶですよ。気にしないで。","だいじょうぶですよ。きにしないで。"] },
    { k:"f1-17", es:"¡Ánimo! ¡Corre más! ¡No te rindas!", c:1, pat:"応援の表現",
      ok:["がんばれ！　もっと走れ！　負けるな！","がんばれ！もっと走れ！負けるな！","がんばれ！　もっとはしれ！　まけるな！"] },
    { k:"f1-18", es:"¡Vamos! ¡Gana! ¡No aflojes!", c:1, pat:"応援の表現",
      ok:["行け！　勝て！　しっかりしろ！","いけ！　かて！　しっかりしろ！"] },
    { k:"f1-19", es:"Los Eagles ganaron 2 a 1.", c:1, pat:"〜対〜",
      ok:["2対1で、イーグルズが勝ちました。","2たい1で、イーグルズがかちました。"] },
    { k:"f1-20", es:"Como perdieron los Bears, a sus aficionados se les veía la rabia.", c:1, pat:"〜そうでした",
      ok:["ベアーズが負けたので、ベアーズのファンはくやしそうでした。","ベアーズがまけたので、ベアーズのファンはくやしそうでした。"] },
    { k:"f1-21", es:"Como jugó un futbolista famoso, el partido se animó.", c:1, pat:"〜ので",
      ok:["有名な選手が試合に出たので、試合がもりあがりました。","ゆうめいなせんしゅがしあいにでたので、しあいがもりあがりました。"] },
    { k:"f1-22", es:"Perdón por haber cancelado de repente el fútbol del otro día.", c:2, pat:"〜てすみませんでした",
      ok:["先日はサッカーの試合、急にキャンセルしてすみませんでした。","せんじつはサッカーのしあい、きゅうにキャンセルしてすみませんでした。"] },
    { k:"f1-23", es:"El sábado tenía que ir al aeropuerto a buscar a un conocido de mi padre.", c:2, pat:"〜なければなりません",
      ok:["土曜日は、空港に父の知りあいを迎えに行かなければなりませんでした。","どようびは、くうこうにちちのしりあいをむかえにいかなければなりませんでした。"] },
    { k:"f1-24", es:"El sábado tengo que ir a buscar a un conocido de mi padre.", c:2, pat:"〜なきゃいけません",
      ok:["土曜日に父の知りあいをむかえに行かなきゃいけないんです。","どようびにちちのしりあいをむかえにいかなきゃいけないんです。"] },
    { k:"f1-25", es:"Me emocionó lo magnífico que juega Nagatomo.", c:2, pat:"〜さ",
      ok:["長友選手のプレーのすばらしさに感動しました。","ながともせんしゅのプレーのすばらしさにかんどうしました。"] },
    { k:"f1-26", es:"Lo sencillo de sus reglas es una de las razones de que el fútbol guste.", c:2, pat:"〜さ",
      ok:["ルールのかんたんさが、サッカー人気のりゆうの1つです。","ルールのかんたんさが、サッカーにんきのりゆうの1つです。"] },
    { k:"f1-27", es:"Como estaba liado con los estudios, rechacé la invitación de mis amigos.", c:2, pat:"raíz de ます como sustantivo",
      ok:["勉強が忙しいから、友だちのさそいをことわりました。","べんきょうがいそがしいから、ともだちのさそいをことわりました。"] },
    { k:"f1-28", es:"El mes que viene está el partido contra los Mariners. Vamos juntos.", c:2, pat:"と／で／へ／から／まで＋の",
      ok:["来月のマリナーズとの試合、一緒に行きましょう。","らいげつのマリナーズとのしあい、いっしょにいきましょう。","来月のマリナーズとの試合、いっしょに行きましょう。"] },
    { k:"f1-29", es:"Los partidos en el campo JF son unos quince al año.", c:2, pat:"と／で／へ／から／まで＋の",
      ok:["JFサッカー場での試合は、年に15回ぐらいです。","JFサッカーじょうでのしあいは、ねんに15かいぐらいです。"] },
    { k:"f1-30", es:"Al salir de la estación la calle estaba llena de aficionados, y me entró la emoción.", c:2, pat:"〜たら",
      ok:["駅を出たら、通りがファンでいっぱいで、わくわくしました。","えきをでたら、とおりがファンでいっぱいで、わくわくしました。"] },
    { k:"f1-31", es:"Como los Bears también son fuertes, estuve en vilo pensando que íbamos a perder.", c:2, pat:"〜んじゃないか",
      ok:["ベアーズも強いので、負けるんじゃないかとはらはらしました。","ベアーズもつよいので、まけるんじゃないかとはらはらしました。"] },
    { k:"f1-32", es:"Como los Eagles ganaron y quedaron campeones, Nakamura estaba loco de contento.", c:2, pat:"〜ので",
      ok:["イーグルズが勝って、優勝したので、中村さんは大喜びでした。","イーグルズがかって、ゆうしょうしたので、なかむらさんはおおよろこびでした。"] },
    { k:"f1-33", es:"Sentí lo popular que es el fútbol.", c:2, pat:"〜さ",
      ok:["サッカー人気の高さを感じました。","サッカーにんきのたかさをかんじました。"] },
    /* la oracion del cuadro 文2 de p31, que es la que cita el indice oficial */
    { k:"f1-34", es:"El sábado tengo que ir a buscar a un conocido de mi padre.", c:2, pat:"〜なければなりません",
      ok:["土曜日に父の知り合いを迎えに行かなければなりません。","どようびにちちのしりあいをむかえにいかなければなりません。"] }
  ],

  /* --- FRASES CON HUECO ----------------------------------------- */
  huecos: [
    /* p25, ejercicio 2 */
    { k:"h1-01", pat:"〜対〜", pre:"その日は、イーグルズ（", post:"）ベアーズの試合でした。", hint:"el «a» del marcador", ok:["対","たい"], c:1, es:"Aquel día era Eagles contra Bears." },
    { k:"h1-02", pat:"応援の表現", pre:"私はイーグルズのファンだから、イーグルズを（", post:"）。", hint:"animar → forma ました", ok:["おうえんしました","応援しました"], c:1, es:"Como soy de los Eagles, animé a los Eagles." },
    { k:"h1-03", pat:"〜ので", pre:"有名な選手が試合に出たので、試合が（", post:"）。", hint:"もりあがります → forma ました", ok:["もりあがりました"], c:1, es:"Como jugó un futbolista famoso, el partido se animó." },
    { k:"h1-04", pat:"〜そうでした", pre:"ベアーズが（", post:"）ので、ベアーズのファンはくやしそうでした。", hint:"負けます → forma た", ok:["負けた","まけた"], c:1, es:"Como perdieron los Bears, sus aficionados estaban dolidos." },
    { k:"h1-05", pat:"〜から（りゆう）", pre:"来週の試合にもさそわれましたが、仕事があるので（", post:"）。", hint:"ことわります → forma ました", ok:["ことわりました"], c:1, es:"También me invitaron al de la semana que viene, pero como trabajo, dije que no." },
    { k:"h1-06", pat:"応援の表現", pre:"友だちにさそわれて、サッカーの試合を（", post:"）。", hint:"見に行きます → forma ました", ok:["見に行きました","みにいきました"], c:1, es:"Un amigo me invitó y fui a ver el fútbol." },

    /* p26, ejercicio 2 */
    { k:"h1-07", pat:"〜なら", pre:"（", post:"）、行けます。", hint:"来週の日曜日 → 〜なら", ok:["来週の日曜日なら","らいしゅうのにちようびなら"], c:1, es:"Si es el domingo que viene, sí puedo." },
    { k:"h1-08", pat:"〜なら", pre:"長友選手が（", post:"）、おもしろい試合になると思います。", hint:"出ます → 〜なら", ok:["出るなら","でるなら"], c:1, es:"Si juega Nagatomo, creo que será un buen partido." },
    { k:"h1-09", pat:"〜なら", pre:"山田さんが（", post:"）、私も行きます。", hint:"行きます → 〜なら", ok:["行くなら","いくなら"], c:1, es:"Si va Yamada, yo también voy." },
    { k:"h1-10", pat:"〜って言ってました", pre:"山田さんも（", post:"）って、言ってました。", hint:"行きます → forma simple", ok:["行く","いく"], c:1, es:"Yamada dijo que él también va." },
    { k:"h1-11", pat:"〜って言ってました", pre:"試合のチケットは、もう（", post:"）って、言ってました。", hint:"買いました → forma simple", ok:["買った","かった"], c:1, es:"Dijo que la entrada ya la había comprado." },
    { k:"h1-12", pat:"〜って言ってました", pre:"テレビで、こんどの週末は（", post:"）って、言ってましたよ。", hint:"暑くないです → forma simple", ok:["暑くない","あつくない"], c:1, es:"En la tele dijeron que este fin de semana no hará calor." },

    /* p27 y p28, los dialogos */
    { k:"h1-13", pat:"〜んですが、いっしょに〜ませんか", pre:"来週の土曜日、サッカーの試合、見に行くんですが、（", post:"）。", hint:"¿vamos juntos? → いっしょに〜ませんか", ok:["いっしょに行きませんか","いっしょにいきませんか"], c:1, es:"El sábado que viene voy al fútbol, ¿te vienes?" },
    { k:"h1-14", pat:"〜たいんですが、だめなんです", pre:"（", post:"）、だめなんです。土曜日はアルバイトがあるから。", hint:"行きます → 〜たいんですが", ok:["行きたいんですが","いきたいんですが"], c:1, es:"Me gustaría ir, pero no puedo: el sábado trabajo." },
    { k:"h1-15", pat:"えんりょします", pre:"私は、（", post:"）。サッカーは、よくわからないから。", hint:"declinar sin dar razones", ok:["えんりょします"], c:1, es:"Yo paso. De fútbol no entiendo mucho." },
    { k:"h1-16", pat:"〜たら", pre:"一度、試合を（", post:"）、ファンになりますよ。", hint:"見ます → 〜たら", ok:["見たら","みたら"], c:1, es:"En cuanto veas un partido, te haces del equipo." },
    { k:"h1-17", pat:"じつは、〜んです", pre:"あのう、じつは、明日の試合、（", post:"）。", hint:"行けません → 〜なくなったんです", ok:["行けなくなったんです","いけなくなったんです"], c:1, es:"Esto… la verdad es que al final no puedo ir al partido de mañana." },
    { k:"h1-18", pat:"じつは、〜んです", pre:"じつは、中国から知りあいが日本に（", post:"）。", hint:"来ます → 〜んです", ok:["来るんです","くるんです"], c:1, es:"La verdad es que me viene un conocido de China." },
    { k:"h1-19", pat:"気にしないで", pre:"だいじょうぶですよ。（", post:"）。", hint:"no le des importancia", ok:["気にしないで","きにしないで"], c:1, es:"No pasa nada. No le des importancia." },

    /* p31, ejercicio 2 */
    { k:"h1-20", pat:"〜なければなりません", pre:"カーラさんはあさってまでに、レポートを（", post:"）。", hint:"出します → 〜なければなりません", ok:["出さなければなりません","ださなければなりません"], c:2, es:"Carla tiene que entregar el informe para pasado mañana." },
    { k:"h1-21", pat:"〜なければなりません", pre:"ホセさんは明日、大使館にしょるいを（", post:"）。", hint:"とりに行きます → 〜なければなりません", ok:["とりに行かなければなりません","とりにいかなければなりません"], c:2, es:"José tiene que ir mañana a la embajada a recoger unos papeles." },
    { k:"h1-22", pat:"〜なければなりません", pre:"あさって、あべさんはうちに（", post:"）。", hint:"います → 〜なければなりません", ok:["いなければなりません"], c:2, es:"Pasado mañana Abe tiene que quedarse en casa." },
    { k:"h1-23", pat:"〜なければなりません", pre:"あさって、パクさんは（", post:"）。", hint:"出張します → 〜なければなりません", ok:["出張しなければなりません","しゅっちょうしなければなりません"], c:2, es:"Pasado mañana Paku tiene que viajar por trabajo." },

    /* p32, ejercicio 3 */
    { k:"h1-24", pat:"raíz de ます como sustantivo", pre:"若い選手は、試合のさいごまで（", post:"）を見せませんでした。", hint:"つかれます → raíz de ます", ok:["つかれ"], c:2, es:"Los jugadores jóvenes no dieron muestras de cansancio hasta el final." },
    { k:"h1-25", pat:"〜さ", pre:"イーグルズの（", post:"）のひみつは、チームワークです。", hint:"強い → 〜さ", ok:["強さ","つよさ"], c:2, es:"El secreto de la fuerza de los Eagles es el trabajo en equipo." },
    { k:"h1-26", pat:"〜さ", pre:"すばらしいサッカー場を見ると、文化的な（", post:"）をかんじます。", hint:"ゆたか → 〜さ", ok:["ゆたかさ"], c:2, es:"Al ver un campo así se siente su riqueza cultural." },
    { k:"h1-27", pat:"raíz de ます como sustantivo", pre:"今日の試合は、1対1で（", post:"）でした。", hint:"ひきわけます → raíz de ます", ok:["ひきわけ"], c:2, es:"El partido de hoy acabó 1 a 1, en empate." },
    { k:"h1-28", pat:"〜さ", pre:"イーグルズのファンは、おうえんのマナーの（", post:"）で、有名です。", hint:"いい（よい）→ 〜さ", ok:["よさ"], c:2, es:"Los aficionados de los Eagles son famosos por lo buenos que son sus modales animando." },

    /* p32, ejercicio 4 */
    { k:"h1-29", pat:"と／で／へ／から／まで＋の", pre:"JFサッカー場（", post:"）試合は、年に15回ぐらいです。", hint:"で + の", ok:["での"], c:2, es:"Los partidos en el campo JF son unos quince al año." },
    { k:"h1-30", pat:"と／で／へ／から／まで＋の", pre:"JFサッカー場（", post:"）行き方をサイトでしらべました。", hint:"まで + の", ok:["までの"], c:2, es:"Miré en la web cómo llegar hasta el campo JF." },
    { k:"h1-31", pat:"と／で／へ／から／まで＋の", pre:"ファン（", post:"）プレゼントは、Tシャツでした。", hint:"から + の", ok:["からの"], c:2, es:"El regalo de los aficionados era una camiseta." },
    { k:"h1-32", pat:"と／で／へ／から／まで＋の", pre:"ファン（", post:"）メッセージは、サイトで読めます。", hint:"へ + の", ok:["への"], c:2, es:"El mensaje para los aficionados se puede leer en la web." },

    /* p29, p30 y p33 */
    { k:"h1-33", pat:"応援の表現", pre:"あきらめる（", post:"）！　負ける（", post2:"）！", hint:"prohibitivo: forma diccionario + …", ok:["な"], ok2:["な"], c:1, es:"¡No te rindas! ¡No pierdas!" },
    { k:"h1-34", pat:"応援の表現", pre:"がんばる → （", post:"）！　もっと走る → （", post2:"）！", hint:"imperativo de grupo 1", ok:["がんばれ"], ok2:["走れ","はしれ"], c:1, es:"¡Ánimo! ¡Corre más!" },
    { k:"h1-35", pat:"〜てすみませんでした", pre:"先日はサッカーの試合、急に（", post:"）。", hint:"キャンセルします → forma て + すみませんでした", ok:["キャンセルしてすみませんでした"], c:2, es:"Perdón por haber cancelado de repente el fútbol del otro día." },
    { k:"h1-36", pat:"〜なきゃいけません", pre:"土曜日に父の知りあいをむかえに（", post:"）んです。", hint:"行きます → 〜なきゃいけない", ok:["行かなきゃいけない","いかなきゃいけない"], c:2, es:"Es que el sábado tengo que ir a buscar a un conocido de mi padre." },
    { k:"h1-37", pat:"〜んじゃないか", pre:"ベアーズも強いので、（", post:"）とはらはらしました。", hint:"負けます → 〜んじゃないか", ok:["負けるんじゃないか","まけるんじゃないか"], c:2, es:"Como los Bears también son fuertes, estuve en vilo pensando que perderíamos." },
    { k:"h1-38", pat:"〜たら", pre:"駅を（", post:"）、通りがファンでいっぱいで、わくわくしました。", hint:"出ます → 〜たら", ok:["出たら","でたら"], c:2, es:"Al salir de la estación la calle estaba llena de aficionados." }
  ],

  /* --- ARMAR LA FRASE (piezas desordenadas) ---------------------- */
  armar: [
    { k:"a1-01", es:"El sábado que viene voy a ver el fútbol, ¿te vienes conmigo?", c:1, chips:["来週の土曜日、","サッカーの試合、","見に行くんですが、","いっしょに行きませんか"] },
    { k:"a1-02", es:"Me gustaría ir, pero no puedo. El sábado tengo el trabajo.", c:1, chips:["行きたいんですが、","だめなんです。","土曜日は","アルバイトがあるから"] },
    { k:"a1-03", es:"Si el partido es el domingo, no hay problema…", c:1, chips:["試合が","日曜日なら、","だいじょうぶ","なんですが"] },
    { k:"a1-04", es:"En la tele dijeron que va a ser un partido interesante.", c:1, chips:["テレビで、","おもしろい試合になる","って、","言ってましたよ"] },
    { k:"a1-05", es:"Yo paso. Es que de fútbol no entiendo mucho.", c:1, chips:["私は、","えんりょします。","サッカーは、","よくわからないから"] },
    { k:"a1-06", es:"Ya verás: en cuanto veas un partido, te haces del equipo.", c:1, chips:["一度、","試合を","見たら、","ファンになりますよ"] },
    { k:"a1-07", es:"Esto… la verdad es que al final no puedo ir al partido de mañana.", c:1, chips:["あのう、","じつは、","明日の試合、","行けなくなったんです"] },
    { k:"a1-08", es:"Como jugó un futbolista famoso, el partido se animó.", c:1, chips:["有名な選手が","試合に出たので、","試合が","もりあがりました"] },
    { k:"a1-09", es:"Como perdieron los Bears, a sus aficionados se les veía la rabia.", c:1, chips:["ベアーズが","負けたので、","ベアーズのファンは","くやしそうでした"] },
    { k:"a1-10", es:"Los Eagles ganaron 2 a 1 y me alegré.", c:1, chips:["2対1で、","イーグルズが","勝って、","うれしかったです"] },
    { k:"a1-11", es:"Perdón por haber cancelado de repente el fútbol del otro día.", c:2, chips:["先日は","サッカーの試合、","急にキャンセルして","すみませんでした"] },
    { k:"a1-12", es:"El sábado tenía que ir al aeropuerto a buscar a un conocido de mi padre.", c:2, chips:["土曜日は、","空港に父の知りあいを","迎えに","行かなければなりませんでした"] },
    { k:"a1-13", es:"Me emocionó lo magnífico que juega Nagatomo.", c:2, chips:["長友選手の","プレーの","すばらしさに","感動しました"] },
    { k:"a1-14", es:"Lo sencillo de sus reglas es una de las razones de que el fútbol guste.", c:2, chips:["ルールの","かんたんさが、","サッカー人気の","りゆうの1つです"] },
    { k:"a1-15", es:"Como estaba liado con los estudios, rechacé la invitación de mis amigos.", c:2, chips:["勉強が","忙しいから、","友だちのさそいを","ことわりました"] },
    { k:"a1-16", es:"El mes que viene está el partido contra los Mariners. Vamos juntos.", c:2, chips:["来月の","マリナーズとの試合、","いっしょに","行きましょう"] },
    { k:"a1-17", es:"Al salir de la estación la calle estaba llena de aficionados, y me entró la emoción.", c:2, chips:["駅を出たら、","通りが","ファンでいっぱいで、","わくわくしました"] },
    { k:"a1-18", es:"Como los Bears también son fuertes, estuve en vilo pensando que perderíamos.", c:2, chips:["ベアーズも","強いので、","負けるんじゃないかと","はらはらしました"] }
  ]
});
