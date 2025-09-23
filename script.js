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
    titulo: "Oráculos digitales — Sofía Muñoz",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Articulo 1 sofia, Oraculos digitales.pdf -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Pega aquí la introducción completa del PDF (contexto de oráculos digitales, definición, alcance).</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Ilustración oráculos digitales" />

      <!-- SECCIONES -->
      <h2>Oráculos digitales: concepto y evolución</h2>
      <p>Pega aquí el desarrollo de la idea: del oráculo clásico a lo digital, ejemplos y plataformas.</p>

      <h2>Prácticas, usos y experiencias</h2>
      <p>Pega aquí cómo las personas usan oráculos digitales: entretenimiento, autoexploración, comunidad.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Uso de apps y filtros oraculares" />

      <h2>Imaginarios y percepciones</h2>
      <p>Pega aquí reflexiones sobre creencias, expectativas, lo lúdico, lo espiritual, lo cultural.</p>

      <!-- CIERRE -->
      <h2>Conclusión</h2>
      <p>Pega aquí el cierre completo del PDF (síntesis, impacto, perspectivas).</p>
    `
  },

  {
    titulo: "Magia Online — Sofía Muñoz",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    contenido: `
      <!-- Basado en: Artículo 2 - Sofia Muñoz Portilla  MAGIA ONLINE.pdf -->

      <!-- INTRO -->
      <h2>Introducción</h2>
      <p>Pega aquí la introducción completa del PDF (qué se entiende por “magia online”, contexto, enfoque).</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Magia en entornos digitales" />

      <!-- SECCIONES -->
      <h2>Manifestaciones de la magia online</h2>
      <p>Pega aquí prácticas, ejemplos, plataformas, comunidades.</p>

      <h2>Interacciones sociales y cultura digital</h2>
      <p>Pega aquí dinámicas de redes, rituales compartidos, tendencias.</p>
      <img src="assets/img/MI_IMAGEN.jpg" alt="Comunidades y rituales en línea" />

      <h2>Implicaciones simbólicas y emocionales</h2>
      <p>Pega aquí los significados, búsquedas personales y colectivas.</p>

      <!-- CIERRE -->
      <h2>Conclusión</h2>
      <p>Pega aquí el cierre completo del PDF.</p>
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
