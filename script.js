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
    contenido: `
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
    titulo: "Oráculos en Internet: historia y cultura — Gaby",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Oráculos en Internet_ historia y cultura Gaby.pdf -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Pega aquí la introducción completa del PDF (línea histórica de oráculos en la red, enfoques culturales).</p>

      <!-- SECCIONES -->
      <h2>De los oráculos clásicos a la web</h2>
      <p>Pega aquí el puente histórico y cambios de medio / soporte.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Evolución histórica de oráculos" />

      <h2>Casos y plataformas destacadas</h2>
      <p>Pega aquí los ejemplos que mencione el PDF (sitios, apps, fenómenos).</p>

      <h2>Dimensión cultural y simbólica</h2>
      <p>Pega aquí análisis cultural, recepción, usos, narrativas.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Cultura digital y oráculos" />

      <!-- CIERRE -->
      <h2>Conclusión</h2>
      <p>Pega aquí el cierre completo del PDF.</p>
    `
  },

  {
    titulo: "Resurgimiento cultural de la ‘bruja’ en el siglo XXI — Gaby",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Resurgimiento cultural de la “bruja” en el siglo XXI Gaby.pdf -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Pega aquí la introducción completa del PDF (contexto de la figura de la bruja hoy).</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Iconografía de la bruja" />

      <!-- SECCIONES -->
      <h2>De estigma a símbolo</h2>
      <p>Pega aquí el cambio de percepción histórica y social.</p>

      <h2>Representaciones en medios y redes</h2>
      <p>Pega aquí ejemplos de moda, arte, cine, #WitchTok, etc.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Representaciones contemporáneas" />

      <h2>Dimensión identitaria y espiritual</h2>
      <p>Pega aquí la lectura de autonomía, rebeldía, espiritualidad.</p>

      <!-- CIERRE -->
      <h2>Conclusión</h2>
      <p>Pega aquí el cierre completo del PDF.</p>
    `
  },

  {
    titulo: "Artículos de Mateo",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Articulos mateo.pdf -->
      <!-- Si este PDF contiene varios artículos, puedes dividirlo en sub-secciones con h2/h3 -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Pega aquí la introducción global o el contexto del conjunto de artículos.</p>

      <!-- ARTÍCULO 1 -->
      <h2>Título del primer artículo</h2>
      <p>Pega aquí el contenido completo del primer artículo.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Imagen del primer artículo" />

      <!-- ARTÍCULO 2 -->
      <h2>Título del segundo artículo</h2>
      <p>Pega aquí el contenido completo del segundo artículo.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Imagen del segundo artículo" />

      <!-- Agrega más bloques si hay más artículos dentro del PDF -->

      <!-- CIERRE -->
      <h2>Conclusión</h2>
      <p>Pega aquí el cierre o reflexión final.</p>
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
