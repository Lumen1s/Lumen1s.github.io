/* =========================
   Navegación
   ========================= */
function openSection(sectionId, initialList = null, initialIndices = null) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    if (sectionId === "blog") {
      if (initialList) renderPosts(initialList, initialIndices);
      else renderPosts(posts);
      document.querySelectorAll(".blog-nav .nav-link").forEach(a => a.classList.remove("active"));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
function goHome(){ document.querySelectorAll("section").forEach(sec=>sec.classList.add("hidden")); document.getElementById("home").classList.remove("hidden"); }

/* =========================
   Oráculo
   ========================= */
function askOracle(){
  const respuestas=[
    "El destino sonríe a tu favor 🌙","Debes tener paciencia ✨","La respuesta está en tu interior 🔮",
    "El universo te dará una señal pronto 🌌","Camina con fe y encontrarás el camino 🔥","Cuidado, no todo es lo que parece 🌑"
  ];
  const r=respuestas[Math.floor(Math.random()*respuestas.length)];
  const box=document.getElementById("oracleAnswer"); if(box) box.innerText=r;
}

/* =========================
   Filtro (Oráculo) — multi-palabra con ranking
   ========================= */
function runOracleFilter(){
  const input=document.getElementById("oracleFilter");
  const q=(input?.value||"").trim();
  const box=document.getElementById("oracleFilterResults");
  if(!box) return;
  if(!q){ box.innerHTML=""; return; }
  const {results,indices,scores}=searchPosts(q);
  if(!results.length){ box.innerHTML=`<button class="btn-no-results" type="button" disabled>Aún no hay resultados para esta palabra</button>`; return; }
  box.innerHTML=results.map((p,i)=>`
    <div class="filter-item" data-index="${indices[i]}">
      <div class="title">${p.titulo}</div>
      <div class="meta">${p.categoria} · ${formatearFecha(p.fecha)} · ${scores[i]} coincidencia(s)</div>
    </div>
  `).join("");
  box.querySelectorAll(".filter-item").forEach(el=>{
    el.addEventListener("click",()=>{ const idx=Number(el.getAttribute("data-index")); openPost(idx,'oracle'); });
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  const fi=document.getElementById("oracleFilter");
  if(fi){ fi.addEventListener("keydown",(e)=>{ if(e.key==="Enter"){ e.preventDefault(); runOracleFilter(); } }); }
});

/* =========================
   POSTS — ahora como HTML nativo (no PDF)
   Pega el HTML completo de cada artículo en 'contenido'.
   Puedes insertar imágenes con <img src="assets/img/mifoto.jpg" alt="...">
   (cuando tengas los archivos subidos).
   ========================= */
const posts = [
  /* === TAROT === */
  {
    titulo: "Guía Completa del Tarot: Significado de las 78 Cartas",
    categoria: "Tarot",
    fecha: "2025-09-01",
    contenido: `
      <h2>Introducción</h2>
      <p>El tarot es un sistema simbólico compuesto por <strong>78 cartas</strong> que sirven como herramienta de introspección, guía y autoconocimiento. Se divide en <strong>22 Arcanos Mayores</strong>, que representan grandes lecciones y etapas de la vida, y <strong>56 Arcanos Menores</strong>, que hablan de lo cotidiano: emociones, trabajo, pensamientos y acciones.</p>

      <h2>Arcanos Mayores</h2>
      <ul>
        <li><strong>0. El Loco:</strong> Nuevos comienzos, libertad, aventura.</li>
        <li><strong>1. El Mago:</strong> Creatividad, acción y poder personal.</li>
        <li><strong>2. La Sacerdotisa:</strong> Intuición, misterio y sabiduría interna.</li>
        <li><strong>3. La Emperatriz:</strong> Fertilidad, abundancia, cuidado, creación.</li>
        <li><strong>4. El Emperador:</strong> Orden, estructura, autoridad, estabilidad.</li>
        <li><strong>5. El Sumo Sacerdote:</strong> Tradición, valores espirituales, enseñanza.</li>
        <li><strong>6. Los Enamorados:</strong> Decisiones, amor, unión.</li>
        <li><strong>7. El Carro:</strong> Control, victoria, avance.</li>
        <li><strong>8. La Fuerza:</strong> Valor, paciencia, autocontrol.</li>
        <li><strong>9. El Ermitaño:</strong> Búsqueda interior, soledad sabia.</li>
        <li><strong>10. La Rueda de la Fortuna:</strong> Ciclos, cambios, destino.</li>
        <li><strong>11. La Justicia:</strong> Equilibrio, verdad, consecuencias.</li>
        <li><strong>12. El Colgado:</strong> Nueva perspectiva, sacrificio, pausa.</li>
        <li><strong>13. La Muerte:</strong> Transformación, cierre de ciclo.</li>
        <li><strong>14. La Templanza:</strong> Armonía, paciencia, equilibrio.</li>
        <li><strong>15. El Diablo:</strong> Ataduras, obsesiones, tentaciones.</li>
        <li><strong>16. La Torre:</strong> Ruptura, cambio repentino.</li>
        <li><strong>17. La Estrella:</strong> Esperanza, sanación, inspiración.</li>
        <li><strong>18. La Luna:</strong> Ilusión, intuición, confusión.</li>
        <li><strong>19. El Sol:</strong> Alegría, éxito, vitalidad.</li>
        <li><strong>20. El Juicio:</strong> Renovación, despertar, segunda oportunidad.</li>
        <li><strong>21. El Mundo:</strong> Logro, plenitud, cierre exitoso.</li>
      </ul>

      <h2>Arcanos Menores</h2>
      <p>Están divididos en cuatro palos: <em>Oros</em>, <em>Copas</em>, <em>Espadas</em> y <em>Bastos</em>. Cada uno representa un área de la vida (Oros → material/trabajo/dinero; Copas → emociones/amor/relaciones; Espadas → mente/conflictos; Bastos → acción/energía/creatividad).</p>

      <h3>Ejemplos</h3>
      <ul>
        <li><strong>As de Oros:</strong> Nuevas oportunidades materiales o laborales.</li>
        <li><strong>Dos de Oros:</strong> Equilibrio financiero y toma de decisiones.</li>
        <li><strong>As de Copas:</strong> Nuevos sentimientos o amor.</li>
        <li><strong>Tres de Copas:</strong> Celebración y amistad.</li>
        <li><strong>Diez de Oros:</strong> Riqueza y estabilidad familiar.</li>
        <li><strong>Ocho de Copas:</strong> Búsqueda; abandonar lo conocido.</li>
      </ul>

      <h2>Una tirada simple de tres cartas</h2>
      <p><strong>Pasado – Presente – Futuro:</strong> extrae tres cartas y reflexiona con calma en cada posición; observa el diálogo entre los Arcanos.</p>

      <h2>Cierre</h2>
      <p>El tarot es un lenguaje simbólico que invita a la <strong>autocomprensión</strong> y a tomar decisiones con mayor claridad.</p>
    `
  },

  {
    titulo: "Los inicios del Tarot: historia y simbolismo",
    categoria: "Tarot",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: articulo_tarot_blog.pdf -->

      <!-- PORTADA / INTRO -->
      <h2>¿Qué es?</h2>
      <p>El tarot, reconocido hoy como una poderosa herramienta de adivinación y autoconocimiento, tiene sus raíces en la Europa del siglo XV. Su origen más documentado se encuentra en Italia, donde surgió como un mazo de cartas utilizado en un juego llamado tarocchi. En aquella época no estaba asociado con lo místico, sino que servía principalmente como entretenimiento para las cortes nobles, acompañado de elaboradas ilustraciones que decoraban las cartas.</p>
      <p>Las imágenes de los Arcanos Mayores rápidamente llamaron la atención. Estas cartas mostraban figuras cargadas de simbolismo —como El Mago, La Emperatriz o La Muerte— que representaban arquetipos humanos y fuerzas universales. Aunque al principio eran solo parte del diseño artístico, con el tiempo comenzaron a ser interpretadas como expresiones filosóficas y espirituales.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Portada del artículo de Tarot" />

      <!-- SECCIONES PRINCIPALES -->
      <h2>Historia y contexto</h2>
      <p>Durante el Renacimiento, periodo caracterizado por el auge del conocimiento y el redescubrimiento de
tradiciones antiguas, el tarot fue vinculado con la filosofía hermética, la alquimia y la astrología. Los
símbolos en las cartas fueron vistos como un puente hacia el entendimiento de los misterios del
cosmos y de la condición humana, lo que permitió que trascendieran su función lúdica.</p>

<p>En el siglo XVIII, el interés por lo oculto y lo esotérico creció en Europa. Autores franceses como
Antoine Court de Gébelin afirmaron que el tarot tenía un origen mucho más antiguo, vinculándolo con
la sabiduría de Egipto y con la cábala judía. Aunque no existen pruebas históricas de esa afirmación,
estas ideas alimentaron la percepción del tarot como una herencia mística de civilizaciones antiguas.</p>

<p>El ocultista Jean-Baptiste Alliette, más conocido como Etteilla, fue uno de los primeros en sistematizar
un método de lectura de tarot con fines adivinatorios. Su aporte marcó el inicio de la transición
definitiva de las cartas como un simple pasatiempo hacia una herramienta de consulta espiritual.
Desde entonces, surgieron múltiples mazos adaptados a distintas corrientes filosóficas y esotéricas.</p>

<p>En el siglo XIX y principios del XX, sociedades ocultistas como la Hermetic Order of the Golden Dawn
y figuras influyentes como Arthur Edward Waite consolidaron el tarot como práctica mística. De allí
nació el famoso mazo Rider-Waite-Smith, ilustrado por Pamela Colman Smith, que se convirtió en la
baraja más popular y la base de muchas de las interpretaciones modernas.</p>

      <!-- CIERRE -->
      <h2>Conclusión</h2>
      <p>Hoy, el tarot es una herramienta universal que trasciende el ámbito de la adivinación. Muchos lo
utilizan para reflexionar, meditar o explorar su propio mundo interior. Su fuerza radica en los símbolos
atemporales que representan experiencias humanas compartidas, lo que lo convierte en un puente
entre el pasado y el presente, entre lo lúdico y lo espiritual.</p>
    `
  },

  /* =========================
     ASTROLOGÍA (si tus PDFs de astro llegan luego, aquí irían)
     ========================= */


  /* =========================
     CURIOSIDADES
     ========================= */

  {
    titulo: "Oráculos digitales: la nueva magia del entretenimiento y la predicción",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido:`
      <!-- Basado en: Articulo 1 sofia, Oraculos digitales.pdf -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Palabras clave: oráculo, entretenimiento, curiosidad, juego interactivo, predicción, misticismo,
experiencias, redes sociales.</p>

<p>Los oráculos han existido desde tiempos antiguos como guías espirituales. En la antigüedad,
estos eran símbolos de misterio y sabiduría: santuarios, escrituras o ceremonias llenas de
misticismo. Hoy en día, en un mundo digital y globalizado, esta fascinación no ha desaparecido,
sino que se ha transformado en nuevas experiencias y creencias que mezclan misterio, juego y
entretenimiento. Consultar un oráculo digital ya no es un acto ritualizado, sino una forma
sencilla de explorar tu curiosidad y pasar un buen rato.</p>

<p>Ya no vemos la magia en lo sobrenatural, sino en lo que se puede compartir, en lo que nos
divierte y en lo que acompaña nuestra vida diaria.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Ilustración oráculos digitales" />

      <!-- SECCIONES -->
      <h2>¿Qué es un oráculo digital?</h2>
      <p>Un oráculo digital es mucho más que una simple plataforma online. Es un espacio interactivo
que convierte cartas, símbolos o mensajes enigmáticos en una experiencia divertida y
sorprendente. Conserva un toque de misterio, pero hoy su esencia es el juego, el cual busca
sorprender, divertir y dar de qué hablar.</p>

<p>Algunos ejemplos pueden ser lecturas instantáneas que se convierten en contenido viral o
filtros en redes sociales que mezclan azar con humor.</p>

      <h2>Entretenimiento en un mundo digital</h2>
      <p>Las personas actualmente buscan rapidez, si no logras enganchar y sorprender a tu público en
segundos, puedes pasar al olvido con un swipe. En este contexto, los oráculos digitales son
una herramienta diferente porque rompen la rutina diaria, generan momentos de risa y
reflexión, y nos hacen sentir parte de algo colectivo al compartir resultados con amigos o en
redes sociales.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Uso de apps y filtros oraculares" />

      <h3>Entre curiosidad y diversión</h3>
      <p>Los oráculos son como juegos interactivos que capturan la atención en pocos clics. Sus
lecturas despiertan intriga, mientras que los resultados se convierten en contenido para redes
sociales. Marianna Ruah-Midbar en su estudio Sacralization of Randomness: Theological
Imagination and the Logic of Digital Divination Rituals (2014), menciona que las prácticas de
adivinación en línea se han transformado en experiencias culturales que mezclan azar, juego y
espectáculo, más ligadas al entretenimiento que a la espiritualidad tradiciona</p>

      <!-- CIERRE -->
      <h2>¿Por qué atraen tanto los oráculos?</h2>
      <p>El atractivo de un oráculo no está en ofrecer verdades absolutas, sino en despertar la
curiosidad digital. En un mundo cargado de información, las personas buscan distracciones que
combinen sorpresa y diversión. Consultar un mensaje aleatorio, descubrir una carta virtual o
probar un filtro que predice tu futuro inmediato son experiencias que funcionan para esta
necesidad. No se trata de creer o no creer, sino de dejarse llevar por la intriga y disfrutar del
momento.</p>

<p>Además, estos logran conectar con la audiencia. Cuando alguien obtiene un resultado curioso o
gracioso, la reacción inmediata es mostrarlo en redes o enviarlo por chat. De esta manera, se
convierten en una herramienta para generar conversación y reconocimiento, igual que antes lo
hacían los rituales colectivos en los templos, pero ahora en un formato digital y viral.</p>

      <h3>De lo místico a lo cotidiano</h3>
      <p>Esta transformación refleja un cambio cultural profundo, debido a que lo ceremonial ha cedido
espacio a experiencias rápidas, ligeras y compartibles. En lugar de desaparecer, los oráculos
se han reinventado en el entorno digital, donde conviven con el humor y la inmediatez de las
redes sociales. De esta manera, lo que antes estaba reservado para espacios sagrados ahora
se vive como un entretenimiento personalizable y disponible en cualquier momento del día.</p>

      <h2>Conclusión</h2>
      <p>Los oráculos digitales representan la unión entre tradición y modernidad, entre misterio y
entretenimiento. Funcionan como un espejo de nuestra generación, curiosa, conectada y
siempre en busca de experiencias compartibles. Atrévete a explorar un oráculo online, déjate
llevar por la curiosidad digital y comparte la experiencia. Al final, puede que descubras que la
verdadera predicción no está en el futuro, sino en la forma en que disfrutamos el presente.</p>

<p>Descubre tu mensaje hoy en LUMEN y deja que la magia digital te sorprenda.</p>
    `
  },

  {
    titulo: "La magia online: ¿Cómo los oráculos digitales influyen en la juventud?",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Artículo 2 - Sofia Muñoz Portilla  MAGIA ONLINE.pdf -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Palabras clave: oráculo digital, adolescentes, jóvenes, entretenimiento, redes sociales,
curiosidad, identidad, predicción, cultura digital.</p>

<p>Los oráculos siempre han sido una herramienta utilizada para buscar respuestas y conectar
con lo desconocido. Sin embargo, en la actualidad, estos han encontrado un nuevo público: los
adolescentes y jóvenes. En un contexto donde la identidad, la personalidad, la curiosidad y la
autoexpresión son tan importantes, los oráculos digitales se convierten en una experiencia
divertida y diferente que forma parte de la vida cotidiana de esta generación.</p>

<p>Hoy no es necesario acceder a ellos en templos con sacerdotes o especialistas en este tema,
sino que gracias a los avances de la tecnología, con tu celular puedes consultarlos. Más que
predicciones, son juegos culturales que marcan tendencias en redes sociales.</p>

      <!-- SECCIONES -->
      <h2>¿Por qué los oráculos digitales atraen tanto a los jóvenes?</h2>
      <h3>La mezcla perfecta entre misterio y diversión</h3>
      <p>Las nuevas generaciones buscan experiencias rápidas e inmediatas que sorprendan. Un filtro
que te dice “qué energía tienes hoy” o “qué personaje eres según tu signo” despierta intriga en
segundos. No importa si se cree o no en la predicción porque lo relevante es generar risas,
identificación y conversación en el público.</p>
 <h3>Construcción de identidad</h3>
      <p>La psicóloga Sherry Turkle (MIT), en su investigación sobre jóvenes y tecnología, señala que
“los entornos digitales ofrecen espejos interactivos que los adolescentes usan para explorar
quiénes son” (Alone Together, 2011). Teniendo como referencia esto, podemos evidenciar que
los oráculos digitales ofrecen frases y símbolos con las que los jóvenes se reconocen, juegan o
cuestionan.</p>

      <h2>Entretenimiento en las redes sociales</h2>
      <h3>Contenido viral</h3>
      <p>En un ecosistema actual, donde todo se mide a través de likes y comentarios, los oráculos
digitales se convierten en contenidos perfectos para viralizarse. Un resultado inesperado o
gracioso es motivo para subir una historia, hacer un TikTok o iniciar una conversación en grupo.
Cada resultado genera interacción, comparación y comentarios entre los demás. Estas
acciones refuerzan la idea de que los oráculos digitales no solo entretienen, sino que también
construyen una comunidad en torno a la curiosidad.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Comunidades y rituales en línea" />

      <h2>El otro lado de los oráculos: riesgos</h2>
      <h3>La delgada línea entre el juego y la creencia</h3>
      <p>Aunque la mayoría de adolescentes encuentran a los oráculos como una forma de
entretenimiento, algunos pueden otorgarles un peso mayor. La investigadora Angela McRobbie,
experta en cultura juvenil, explica que los medios digitales muchas veces mezclan ocio y
creencias, lo que puede generar interpretaciones confusas sobre identidad o destino (The
Aftermath of Feminism, 2009).</p>

<p>Al estar tan conectados a las redes sociales, estos juegos exponen a los jóvenes a dinámicas
de comparación y validación constante entre ellos: “mi predicción es mejor que la tuya” o “mi
energía salió negativa”. Aquí es donde la educación digital y el pensamiento crítico se vuelven
fundamentales.
</p>

      <!-- CIERRE -->
      <h2>Una práctica cultural más que espiritual</h2>
      <h3>De la espiritualidad al espectáculo</h3>
      <p>Los oráculos que antes tenían un lugar sagrado en templos o rituales, hoy tienen un enfoque
más humorístico. Como explica Marianna Ruah-Midbar en su estudio sobre prácticas
contemporáneas de adivinación digital (Sacralization of Randomness, 2014), “lo que antes era
espiritual se convierte ahora en un espectáculo cultural”, especialmente atractivo para
generaciones jóvenes.</p>

<p>Consultar un oráculo digital ya no es un acto místico ni limitado, es parte de nuestro día a día,
se han convertido en hábitos de distracción, ya sea en medio de clases, durante un descanso o
al final del día frente al celular
</p>
      <h2>Conclusión</h2>
      <p>Los oráculos digitales muestran cómo los jóvenes dan forma a su identidad en el mundo online.
No representan verdades absolutas, sino experiencias que despiertan curiosidad y fomentan la
interacción social. En este sentido, funcionan como un puente entre tradición y cultura juvenil
digital, mostrando que lo místico puede reestructurarse para ser visto como memes, filtros y
tendencias.</p>

<p>Descubre la experiencia de los oráculos digitales en Lumen y comparte la magia con tu
comunidad. Al final, la verdadera predicción no está en el futuro, sino en cómo los jóvenes
crean, comparten y disfrutan el presente</p>
    `
  },

  {
    titulo: "Oráculos en Internet: historia y cultura",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Oráculos en Internet_ historia y cultura Gaby.pdf -->
      <p>De Delfos al Wi-Fi: La oscura y juguetona evolución de los oráculos en internet:</p>
      
<p>Desde la antigüedad, la humanidad ha buscado respuestas en voces ocultas; los
oráculos eran los intermediarios divinos para preguntas que requieren respuestas
sagradas. El primer registro vivido de estas experiencias espirituales nace en Grecia, 
El Oráculo de Delfos, que fue uno de los oráculos más importantes en la época,
sobreviviendo hasta el año 391. En este lugar, la sacerdotisa Pitia, en trance,
pronunciaba las profecías de Apolo.</p>

<p>xEstos oráculos inscribían preguntas y recibían respuestas enigmáticas, reforzando una
atmósfera mística y simbólica. Ese patrón (consultar para saber el futuro o la voluntad
divina) constituye la matriz cultural de todos los “oráculos”, y es el antecedente de las
versiones contemporáneas digitales.</p>

      <!-- SECCIONES -->
      <h2>Primeros oráculos en la red y buscadores como guía</h2>
      <p>Con la llegada de Internet surgieron las primeras herramientas de respuesta que,
simbólicamente, actuaron como oráculos modernos. Por ejemplo, Ask Jeeves
(Ask.com) nació en 1997 para contestar preguntas en lenguaje natural; era presentado
como un mayordomo («Jeeves») dispuesto a responder tus dudas. De manera
similar, buscadores como Google pasaron a ser vistos como “oráculos del
conocimiento” de la red. Según Wired, Google fue tratado en su momento “como
nuestro anterior oráculo del conocimiento de Internet”, capaz de brindar respuestas
prácticamente instantáneas a cualquier consulta.</p>

<p>Además, aparecieron comunidades de preguntas y respuestas colaborativas que
evocaban la dinámica oracular. El Internet Oracle (Usenet Oracle), creado en 1989, es
un ejemplo pionero: un foro global donde un usuario envía una pregunta que otro
participante responde con humor, y así sucesivamente. Cada intercambio, llamado
“oracularidad”, simula la figura del sacerdote que contesta el misterio; por ejemplo,
alguien podía preguntar “¿Por qué es una vaca?” y el “Oráculo” respondía
crípticamente “Mu”. Aunque irreverente, este sistema muestra cómo incluso en los
albores de la web surgieron estructuras sociales (foros, e-mails) que imitaron la
tradición oracular, ofreciendo respuestas disfrazadas de chiste o juego.
</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Evolución histórica de oráculos" />

      <h2>El internet extraño y liminal de los años 2000: sitios perturbadores y oraculares</h2>
      <p>En la transición al nuevo milenio floreció una estética extraña y liminal en la red. Se
multiplicaron sitios web con diseños caóticos, mensajes inquietantes y funcionalidades
aparentemente inútiles pero misteriosas. Un ejemplo célebre es Mortis.com (1997): al
abrirlo mostraba sólo un recuadro de inicio de sesión sobre fondo negro. Nadie sabía la
contraseña, y en su código fuente se descubrió que alojaba terabytes de datos
inexplicables. El nombre (del latín mortis, “muerte”) y la gigantesca base de datos
ocultaban rumores de archivos prohibidos y teorías conspirativas. Este misterio digital
(no resuelto hasta hoy) creó sensación de “conjuro” en los usuarios. Según informes,
Mortis.com “sigue siendo un enigma que no quiere ser resuelto”, ya que resistió
intentos de intrusión y sus contenidos nunca se revelaron.</p>

<p>Asimismo surgieron otros sitios con atmósferas esotéricas. Cthulhu.net, vinculado a
Mortis.com por el mismo supuesto programador, plasmaba iconografía satánica y
sonidos extraños: daba “una sensación igualmente inquietante”. Otras webs lúdicas y
artísticas jugaron con lo bizarro: por ejemplo, Zombo.com (1999) prometía desde su
página en blanco que “todo es posible” mediante una voz tranquilizadora, simulando un
oráculo absurdo[9]. En la misma línea se desarrollaron animaciones y experimentos
interactivos sin propósito práctico (animaciones sin sentido, banners infinitos, zonas de
chat improvisado), que impregnaban al usuario de un sentimiento de irrealidad. Estos
espacios (algunos diseñados con Flash o Java) convocaban al navegante a una
experiencia casi ritual: entretenimientos psicodélicos que, si bien lúdicos, evocaban la
tradición oracular de recibir revelaciones desde lo desconocido.</p>

<p>Ejemplos reales: Entre los sitios recordados de esa época extraña se mencionan
Mortis.com y Cthulhu.net, pero también páginas como ThisMan.org (un supuesto
oráculo de sueños), colecciones de audios y animaciones puntuales (Cat Bounce,
Electric Boogie-Woogie), o proyectos de net-art que imitaban rituales. Aunque muchos
eran meras curiosidades, todos contribuían al aura misteriosa del viejo Internet, donde
cada clic podía revelar algo inexplicado o fantástico (a veces, simplemente un
fragmento de historia irrelevante convertido en leyenda urbana digital).
.</p>

      <h2>Bots conversacionales y la tradición de preguntar a las máquinas</h2>
      <p>Los bots de conversación han funcionado como oráculos impersonales: interlocutores
digitales que, al menos en apariencia, “responden” cualquier pregunta. El primer
experimento destacado fue ELIZA (1966), un programa de Lawrence Weizenbaum que
simulaba un psicoterapeuta reflexivo; aunque rudimentario, causó el efecto Pygmalion:
muchos usuarios creyeron que conversaban con un humano real. En los años 90
aparecieron chatbots más avanzados: A.L.I.C.E. (1995) de Richard Wallace imitaba
mejor al habla humana y ganó el premio Loebner (competencia de Turing) tres
veces. Un poco después, Jabberwacky (1997) de Rollo Carpenter buscó “simular un
chat humano de forma interesante y entretenida”. A partir de él, en 2006 surgió
Cleverbot, simplemente un motor web que aprende automáticamente de las
conversaciones previas. Como afirma un reporte, “Cleverbot.com se lanzó en 2006,
pero la IA nació en 1988 con Rollo Carpenter” y ha ido aprendiendo desde
entonces. Así, cada generación de bot añadía más datos y naturalidad,
construyendo un tipo de oráculo mecánico al que cualquiera puede preguntar de todo.</p>

<p>Estos chatbots a menudo han sido empleados como oráculos lúdicos o reflexivos.
Usuarios consultan a Cleverbot o ALICE temas místicos, existenciales o hasta
adivinatorios, buscando respuestas que surgen de su gran base de conversaciones
previas. Los bots modernos basados en IA (ChatGPT, Siri, Alexa) son herederos de esa
idea: “Imagina una computadora que hable contigo… Existen desde los sesenta”,
pero hoy pueden contextualizar mejor cada pregunta. La fascinación radica en que
estas inteligencias artificiales asumen el rol de “guía” al estilo de los oráculos antiguos:
quien pregunta delega la tarea de hallar una respuesta en una entidad ajena, sea divina
o algorítmica[15][3]. En ese sentido, ChatGPT ha sido calificado como una de las
“últimas materializaciones” del oráculo moderno, ya que, como explica un análisis,
suplanta a “nuestros antiguos tutores” (libros, expertos, profesores) para entregar
respuestas inmediatas y autoritativas.
</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Cultura digital y oráculos" />

      <!-- CIERRE -->
      <h2>Juegos y herramientas de adivinación en línea</h2>
      <p>Paralelamente surgieron juegos y apps adivinatorias que canalizan la estructura
oracular en experiencias interactivas. Un ejemplo popular es Akinator (2007): un “genio”
web que adivina en qué personaje real o ficticio estás pensando formulando preguntas
binarias. Su algoritmo va aprendiendo de miles de usuarios, casi como un oráculo que
extrae el conocimiento de una vasta colectividad. Según su ficha técnica, Akinator
“intenta determinar qué personaje (objeto o animal) estás pensando, haciendo una
serie de preguntas” basándose en clasificaciones estadísticas aprendidas[16]. El
resultado es casi mágico: con alrededor de 20 preguntas suele acertar el personaje,
como si leyera la mente del usuario.</p>

<p>Otros sitios sacan provecho de la mística de la predicción: teletipos de horóscopos,
lecturas de tarot online, bolas 8 mágicas web, apps de runas o cartas que prometen
visiones del futuro. Aunque muchas veces funcionan con respuestas pre-programadas
o aleatorias, el formato de “consulta-respuesta” recuerda el método oracular clásico.
Incluso en redes sociales e IA moderna, es común ver prompts tipo “hazme de oráculo”
o “interpreta estos sueños”, reflejando que internet se autoasume cada vez más como
plataforma de revelación. Herramientas como Google Assistant o ChatGPT ahora
pueden configurarse para que “lean el tarot” o den consejos amorosos, emulando a un
adivino digital. De este modo, desde juegos livianos hasta bots espirituales, lo oracular
se ha diversificado en la cultura digital.</p>

<h2>Oráculos modernos en la cultura digital actual</h2>
<p>Hoy en día vivimos en la era del big data y la inteligencia artificial, donde los “oráculos”
se digitalizan por completo. El oráculo clásico (el oráculo de Delfos, el vidente, el sabio)
ha sido reemplazado por sistemas de información masivos: buscadores avanzados,
asistentes de voz y LLMs. Por ejemplo, ChatGPT y modelos similares son actualmente
consultados “no sólo para aprender, sino también para pedir consejos amorosos o
incluso predicciones”[15]. Se han convertido en “aliados” a la hora de resolver
preguntas cotidianas o existenciales. A la par, Google sigue siendo referido como un
oráculo implícito: tras la revolución de la IA, el anterior “oráculo difuso” era Google[3],
ahora muchas búsquedas se hacen a través de asistentes inteligentes.</p>

<p>Culturalmente, este fenómeno genera una especie de reverencia nueva: los usuarios
muestran asombro (o tal vez incertidumbre) ante respuestas automáticas que imitan al
pensamiento humano. Como escribió Kant hace siglos, el ser humano tiende a ceder
“la guía del uso de su razón” a un tutor externo; hoy ese tutor puede ser digital. Así, en
la cultura contemporánea del internet, las figuras de los videntes y profetas
tradicionales conviven con algoritmos; ambos dan lugar a un tipo de ritual: formular una
pregunta y recibir una respuesta como revelación final. Al mismo tiempo, muchos
artistas y creadores se han apropiado de esta idea en proyectos de net-art o
instalaciones interactivas, resaltando lo enigmático. En resumen, los oráculos digitales
–de los foros humorísticos de los 90 a los sofisticados bots de IA de hoy– siguen
cumpliendo un rol simbólico: el de encarnar el misterio de lo desconocido en la
vastedad de la cultura online.</p>

    `
  },

  {
    titulo: "Resurgimiento cultural de la ‘bruja’ en el siglo XXI",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Resurgimiento cultural de la “bruja” en el siglo XXI Gaby.pdf -->

      <!-- INTRO -->
      <p>En las últimas dos décadas la figura de la bruja dejó de ser solo una estampa de
cuentos medievales para convertirse en un ícono cultural multifacético. Estudios
recientes constatan que “la Bruja está de actualidad en todos los ámbitos sociales y
culturales”. Históricamente, las acusaciones de brujería solían dirigirse contra
mujeres poseedoras de saberes prácticos (herbología, medicina popular, conocimiento
intuitivo), vistos como peligrosos por el orden patriarcal. Como propone Blázquez‐Graf,
las acusadas de brujería fueron “modelo de mujer con conocimientos específicos” cuyo
saber fue perseguido. Recuperar hoy la bruja implica, pues, reivindicar ese
conocimiento marginado y cuestionar las estructuras que lo silenciaron.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Iconografía de la bruja" />

      <!-- SECCIONES -->
      <h2>Brujería, feminismo y movimientos identitarios</h2>
      <p>A partir de los años 2000 la bruja se rehizo como emblema de empoderamiento
femenino. Autoras actuales enfatizan que “la hechicería es feminismo, es
inherentemente política”. La activista Gabriela Herstik destaca que la bruja es
“inherentemente feminista”, simbolizando a la mujer rebelde que desafía la moral
dominante. Colectivos y figuras vinculadas al feminismo recuperan el motivo de la bruja
para canalizar su mensaje. Por ejemplo, grupos como W.I.T.C.H. (Women’s
International Terrorist Conspiracy from Hell) reclamaban que sus “hermanas brujas”
eran “guerrilleras y luchadoras de la resistencia”. Asimismo, diseñadoras y artistas
integran iconografía brujeril en su discurso feminista. Vogue documenta que el
diseñador Víctor Barragán usó la magia sexual de las brujas “para combatir la
dominación patriarcal”. En resumen, la bruja contemporánea conjuga rebelión
identitaria y empoderamiento de género.</p>

      <h2>Espiritualidad alternativa vs. religiones institucionales</h2>
      <p>El resurgimiento de la brujería está ligado al auge de formas de espiritualidad no
institucional. Según Lionel Obadia (2023), el cambio religioso global presenta un
“retorno de la magia” paralelo al crecimiento de la “espiritualidad”, y ambos fenómenos
se entrelazan: la brujería moderna se vuelve más “espiritual” y la espiritualidad más
“brujeril”. Este fenómeno se ha dado en sociedades secularizadas donde muchas
personas buscan experiencias místicas fuera de las iglesias tradicionales. Movimientos
como la Wicca o las feministas de la Diosa (goddess movement) promueven rituales de
la naturaleza y devociones a lo femenino sagrado, conectando la brujería con la
búsqueda de lo espiritual en clave personal e igualitaria. En este nuevo marco, la magia
recupera significados de sanación, conexión con la tierra y autonomía, reaccionando
ante el vacío que dejan las religiones convencionales.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Representaciones contemporáneas" />

      <h2>Comunidades esotéricas en la era digital</h2>
      <p>La revolución de Internet fue decisiva para esta ola bruja. Lo que antes se practicaba
en privado se exhibe ahora con orgullo en redes sociales. Plataformas clave facilitan la
creación de comunidades globales de brujas y curiosos esotéricos:</p>
 <ul>
        <li><strong>TikTok (#WitchTok):</strong> La etiqueta #WitchTok acumula decenas de miles de
millones de vistas. Creadoras como la española Nerea Luna
(@AuraDeCristal87) suman decenas de miles de seguidores mostrando rituales,
lecturas de tarot y reflexiones esotéricas. Forbes (2022) señala que tras la
pandemia este espacio se convirtió en refugio: “un trauma colectivo [que] hizo a
mucha gente mirar hacia dentro y buscar respuestas”. No todo es fiable,
advierten expertos, pero la mera presencia masiva de contenido esotérico en
TikTok es un signo del auge.</li>
        <li><strong>Tumblr y hashtags:</strong> En Tumblr surgió la comunidad #witchblr, donde usuarias
compartían fotos, consejos mágicos y una estética “witchy” (mística/gótica).
Estudios etnográficos muestran que etiquetas como #witchblr o #witchesofcolor
operan “como contramundos donde pueden articularse narrativas de resistencia
y trabajo personal de identidad”, especialmente entre mujeres jóvenes
marginadas. Esto evidencia que lo digital sirve de “espacio de contranarrativa”
donde se reivindica la bruja opuesta a estereotipos.</li>
        <li><strong>Otros espacios en línea:</strong> Desde foros especializados (e.g. Reddit r/witchcraft)
hasta blogs, podcasts y grupos en Facebook se han tejido redes de practicantes
modernos. Incluso existen programas comunitarios como la radio feminista Las
Brujas que Salem (en Argentina) o podcasts en español dedicados al
esoterismo. Así, la brujería de nueva ola ha formado comunidades
transnacionales que comparten recursos, cursos y comunidad.</li>
</ul>
<p>La iconografía brujeril también se proyecta en la moda y el arte. Colecciones de alta
costura han jugado con el arquetipo de la bruja para transmitir mensajes transgresores:
por ejemplo, Rei Kawakubo (Comme des Garçons) presentó en 2016 modelos con
voluminosos tocados y capas negras que recuerdan al sombrero de brujo clásico. Este
tipo de creaciones confirma que “en el diseño de moda se tiende a recuperar a la Bruja
para transmitir mensajes político-feministas”. La imagen de la bruja (sombreros
puntiagudos, estrellas, pentagramas bordados) aparece en desfiles de Saint Laurent,
Alexander McQueen o Gareth Pugh, acompañada de eslóganes como “Patriarchy =
CO₂” o referencias a cultos paganos.</p>

<p>Más allá de las pasarelas, la bruja percola el cine, la TV y la música. Desde el año 2000
se han estrenado más de sesenta películas y series con personajes brujescos (por
ejemplo The Witch, American Horror Story o el remake de La maldición de las brujas),
reflejando una explosión mediática. En la música pop son comunes las referencias
ocultistas: clásicos como “Black Magic Woman” (Santana, 1970) o “Witchy Woman”
(The Eagles, 1972) celebran la bruja como figura seductora[14]. Incluso artistas
españolas han abrazado el símbolo: la cantante La Bien Querida tituló un disco
Aquelarre, y letras de reguetón o trap incorporan emojis de pentagramas y lunas como
códigos estéticos. En el marketing masivo esta iconografía alcanza productos desde
velas y joyería hasta libros de autoayuda espiritual; se habla ya de una moda “witchy”
en decorados y diseño gráfico, reflejo del fenómeno cultural.</p>

      <!-- CIERRE -->
      <h2>Identidad, sabiduría y disidencia: la nueva bruja</h2>
      <p>En resumen, Internet y la cultura pop han reconfigurado a la bruja como símbolo de
autodeterminación. Como sintetiza Forbes, “en la era digital, una bruja puede ser
cualquiera”: personas comunes cuyo día a día incluye la magia como “uno de sus
pilares fundamentales”. Lejos de la estampa negativa de la anciana con escoba,
hoy la bruja representa el conocimiento intuitivo, la conexión con lo natural y la rebeldía
contra lo establecido. Aparece como arquetipo de mujer sabia, espiritual e
independiente, que desafía normas de género y de pensamiento. En este sentido, el
revival de la brujería es al mismo tiempo estético y político: rememora viejas
persecuciones para denunciar nuevas opresiones, revaloriza culturas alternativas y teje
comunidades globales de disidencia cultural.</p>
    `
  },

  {
    titulo: "Tarot 101: Descubre lo que los Arcanos Mayores Dicen de Ti",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Articulos mateo.pdf -->
      <!-- Si este PDF contiene varios artículos, puedes dividirlo en sub-secciones con h2/h3 -->

      <!-- INTRO -->
      <p>PEl tarot ya no es cosa de brujas en películas ni de adivinadoras en carpas misteriosas. Hoy en día es una herramienta de autoconocimiento que cualquiera puede usar para reflexionar sobre su vida, tomar decisiones y conectar con su intuición. Si alguna vez te ha intrigado ver esas cartas llenas de símbolos y figuras, este artículo es para ti.</p>

      <!-- ARTÍCULO 1 -->
      <h2>Qué es el tarot (en serio)</h2>
      <p>El tarot es un mazo de 78 cartas que se divide en dos grandes grupos:</p>
    <p> ● Arcanos Mayores (22 cartas): Representan grandes lecciones y arquetipos universales (como El Loco, La Muerte o El Sol). </p>
   <p> ● Arcanos Menores (56 cartas): Hablan de situaciones cotidianas y emociones más
concretas. </p>
<p>Hoy nos vamos a enfocar en los Arcanos Mayores, porque son los que tienen más “drama”
y profundidad.</p>

<h2>Los Arcanos Mayores y su significado</h2>
<p>Aquí tienes algunos de los más conocidos y lo que suelen simbolizar:</p>
<p>● El Loco (0): Nuevos comienzos, tomar riesgos, lanzarse sin miedo.</p>
<p>● La Sacerdotisa (II): Intuición, secretos, sabiduría interior.</p>
<p>● El Emperador (IV): Orden, estructura, liderazgo.</p>
<p>● Los Enamorados (VI): Elecciones importantes, relaciones, unión.</p>
<p>● La Muerte (XIII): Transformación, cierre de ciclos, renacimiento.</p>
<p>● El Sol (XIX): Éxito, alegría, claridad.</p>
<h3>Tip: Que salga “La Muerte” en tu tirada no significa que alguien vaya a morir.
Normalmente indica que algo en tu vida está por transformarse.</h3>

      <img src="assets/img/MI_IMAGEN.jpg" alt="Imagen del primer artículo" />

<h2>Cómo hacer una tirada simple</h2>
<p>No necesitas ser tarotista profesional para empezar:</p>
<p> 1. Conecta con tu intención – Respira profundo y piensa en la pregunta que quieres
responder.</p>
<p> 2. Baraja las cartas – Concéntrate en tu pregunta mientras las mezclas.</p>
<p> 3. Saca tres cartas:</p>
 <p>○ Carta 1 → El pasado o la raíz de la situación</p>
 <p>○ Carta 2 → El presente o lo que debes considerar</p>
 <p>○ Carta 3 → El futuro o el resultado probable</p>

 <h2>Tarot = espejo, no sentencia</h2>
 <p>El tarot no te dice lo que va a pasar, sino que te muestra posibilidades y patrones. Es como
un mapa que te ayuda a ver el terreno… pero el camino lo eliges tú.</p>

<p>Explorar el tarot es una forma divertida y profunda de conocerte mejor. Si lo pruebas, no te
lo tomes como algo rígido: úsalo para inspirarte, aclarar ideas y descubrir nuevas
perspectivas.</p>
<p>¿Te atreves a sacar una carta hoy y ver qué mensaje tiene para ti? </p>
    `
     
  },
   
   {
    titulo: "Manifestación: El Arte de Crear la Vida que Sueñas",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Articulos mateo.pdf -->
      <!-- Si este PDF contiene varios artículos, puedes dividirlo en sub-secciones con h2/h3 -->

      <!-- INTRO -->
<p>¿Alguna vez has escuchado la frase “lo que piensas, atraes”? 🤔 Pues eso es básicamente
la manifestación: el proceso de enfocar tus pensamientos, emociones y acciones para
traer a tu vida aquello que más deseas. No es magia, es intención… ¡y funciona mejor de lo
que crees!</p>

      <!-- ARTÍCULO 1 -->
      <h2>¿Qué es la manifestación?</h2>
      <p>La manifestación es la práctica de alinear tu mente y tus acciones con lo que quieres
lograr. Se trata de visualizar tu meta, creer que es posible y dar pasos hacia ella. Piensa en
ello como programar tu GPS mental hacia el destino de tus sueños.</p>

<h2>La ciencia detrás (sí, hay ciencia)</h2>
<p>Aunque suene místico, la psicología apoya parte de esta idea:</p>
    <p> ● Cuando defines un objetivo claro, tu cerebro filtra la información para enfocarse
en oportunidades relacionadas (efecto conocido como sistema de activación
reticular). </p>
   <p> ● Mantener una actitud positiva aumenta la motivación y la resiliencia, dos
ingredientes clave para alcanzar metas. </p>

<h2>Cómo empezar a manifestar</h2>
<p>Aquí van pasos simples para comenzar hoy mismo:</p>
<p>● Define tu deseo con claridad: No digas “quiero ser feliz”, di “quiero un trabajo que me permita viajar y tenga un
buen ambiente de equipo”.</p>
<p>● Visualiza: Dedica 5 minutos al día a imaginar que ya lo lograste: ¿cómo te sientes?, ¿qué
ves?, ¿con quién estás?</p>
<p>● Cree de verdad: La duda frena el proceso. Afirma: “esto es posible para mí”</p>
<p>● Toma acción: El universo se mueve contigo. Envía ese correo, toma ese curso, habla con esa
persona.</p>
<p>● Agradece antes de tiempo: Actúa como si ya fuera tuyo y agradece por ello. La gratitud cambia tu energía.</p>

<h2>Lo que NO es manifestar</h2>
<p>No se trata de quedarse sentado esperando que caiga del cielo. Manifestar es soñar +
actuar.</p>

      <img src="assets/img/MI_IMAGEN.jpg" alt="Imagen del primer artículo" />

<p>La manifestación es una herramienta poderosa para enfocarte en lo que realmente quieres
y crear la vida que imaginas. Así que hoy, detente un momento, escribe tu meta más grande
y empieza a dar pequeños pasos. ¡Tu yo del futuro te lo va a agradecer.</p>
    `
     
  }
];

/* =========================
   Búsqueda (título/categoría/contenido HTML)
   ========================= */
function searchPosts(query){
  const terms=(query||"").toLowerCase().match(/[a-záéíóúüñ0-9]+/gi);
  if(!terms||!terms.length) return {results:[],indices:[],scores:[]};
  const scored=[];
  posts.forEach((p,i)=>{
    const haystack=`${p.titulo} ${p.categoria} ${p.contenido}`.toLowerCase();
    let score=0; terms.forEach(t=>{ if(haystack.includes(t)) score++; });
    if(score>0) scored.push({p,i,score,date:new Date(p.fecha||"1970-01-01")});
  });
  scored.sort((a,b)=>(b.score-a.score)||(b.date-a.date));
  return {results:scored.map(x=>x.p),indices:scored.map(x=>x.i),scores:scored.map(x=>x.score)};
}

/* =========================
   Utilidades
   ========================= */
function formatearFecha(iso){ try{ const d=new Date(iso+"T00:00:00"); return d.toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});}catch{return iso;} }

/* =========================
   Render tarjetas
   ========================= */
function renderPosts(list,indices){
  const container=document.getElementById("blog-posts");
  if(!container) return;
  if(!list||!list.length){ container.innerHTML=`<p class="muted">No hay artículos en esta categoría aún.</p>`; return; }
  if(!indices) indices=list.map(p=>posts.indexOf(p));
  container.innerHTML=list.map((p,i)=>`
    <article class="post post-card" data-index="${indices[i]}">
      <h2>${p.titulo}</h2>
    </article>
  `).join("");
  container.querySelectorAll(".post-card").forEach(card=>{
    card.addEventListener("click",()=>{ const idx=Number(card.getAttribute("data-index")); openPost(idx,'blog'); });
  });
}

/* =========================
   Modal (blog/oráculo) — ahora muestra HTML nativo
   ========================= */
function openPost(idx, context='blog'){
  const p=posts[idx]; if(!p) return;
  const ids=(context==='oracle')?{
    modal:'oracleModal', tag:'oracleModalTag', title:'oracleModalTitle', meta:'oracleModalMeta', body:'oracleModalBody'
  }:{
    modal:'postModal', tag:'modalTag', title:'modalTitle', meta:'modalMeta', body:'modalBody'
  };
  document.getElementById(ids.tag).textContent=p.categoria||"";
  document.getElementById(ids.title).textContent=p.titulo||"";
  document.getElementById(ids.meta).textContent=formatearFecha(p.fecha||"");
  document.getElementById(ids.body).innerHTML=p.contenido||"";

  const modal=document.getElementById(ids.modal);
  if(modal){ modal.classList.remove("hidden"); document.body.style.overflow="hidden"; }
}
function closePost(modalId=null){
  if(modalId){ const m=document.getElementById(modalId); if(m) m.classList.add("hidden"); }
  else{ document.querySelectorAll('.modal:not(.hidden)').forEach(m=>m.classList.add('hidden')); }
  document.body.style.overflow="";
}
document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closePost(); });

/* =========================
   Filtros por categoría (blog)
   ========================= */
document.addEventListener("DOMContentLoaded",()=>{
  if(document.getElementById("blog").classList.contains("active")||!document.getElementById("home").classList.contains("active")) renderPosts(posts);
  document.querySelectorAll(".blog-nav .nav-link[data-filter]").forEach(link=>{
    link.addEventListener("click",(e)=>{
      e.preventDefault();
      const cat=link.dataset.filter;
      document.querySelectorAll(".blog-nav .nav-link").forEach(a=>a.classList.remove("active"));
      link.classList.add("active");
      const filtered=posts.map((p,i)=>({p,i})).filter(({p})=>p.categoria===cat);
      renderPosts(filtered.map(x=>x.p), filtered.map(x=>x.i));
      const wrap=document.querySelector(".blog-wrap"); if(wrap) window.scrollTo({top:wrap.offsetTop-16, behavior:"smooth"});
    });
  });
});
