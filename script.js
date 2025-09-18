/* =========================
   Navegación entre secciones
   ========================= */
function openSection(sectionId, initialList = null, initialIndices = null) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");

    if (sectionId === "blog") {
      if (initialList) {
        renderPosts(initialList, initialIndices);
      } else {
        renderPosts(posts);
      }
      document.querySelectorAll(".blog-nav .nav-link").forEach(a => a.classList.remove("active"));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function goHome() {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById("home").classList.remove("hidden");
}

/* =========================
   Oráculo (respuesta aleatoria)
   ========================= */
function askOracle() {
  const respuestas = [
    "El destino sonríe a tu favor 🌙",
    "Debes tener paciencia ✨",
    "La respuesta está en tu interior 🔮",
    "El universo te dará una señal pronto 🌌",
    "Camina con fe y encontrarás el camino 🔥",
    "Cuidado, no todo es lo que parece 🌑"
  ];
  const randomIndex = Math.floor(Math.random() * respuestas.length);
  const box = document.getElementById("oracleAnswer");
  if (box) box.innerText = respuestas[randomIndex];
}

/* =========================
   Oráculo — Filtro (multi-palabra con ranking)
   ========================= */
function runOracleFilter() {
  const input = document.getElementById("oracleFilter");
  const q = (input?.value || "").trim();
  const box = document.getElementById("oracleFilterResults");
  if (!box) return;

  if (!q) {
    box.innerHTML = "";
    return;
  }

  const { results, indices, scores } = searchPosts(q);

  if (!results.length) {
    box.innerHTML = `<button class="btn-no-results" type="button" disabled>Aún no hay resultados para esta palabra</button>`;
    return;
  }

  // pinta resultados (scrolleables) mostrando cuántas palabras coincidieron
  box.innerHTML = results.map((p, i) => `
    <div class="filter-item" data-index="${indices[i]}">
      <div class="title">${p.titulo}</div>
      <div class="meta">${p.categoria} · ${formatearFecha(p.fecha)} · ${scores[i]} coincidencia(s)</div>
    </div>
  `).join("");

  // abrir en modal del ORÁCULO (aquí mismo)
  box.querySelectorAll(".filter-item").forEach(el => {
    el.addEventListener("click", () => {
      const idx = Number(el.getAttribute("data-index"));
      openPost(idx, 'oracle');
    });
  });
}

// Enter en el campo del filtro
document.addEventListener("DOMContentLoaded", () => {
  const fi = document.getElementById("oracleFilter");
  if (fi) {
    fi.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runOracleFilter();
      }
    });
  }
});

/* =========================
   POSTS — Aquí están tus artículos completos como PDF embebido
   =========================
   NOTA: Subí los PDFs al ZIP que te paso y los renombré con rutas seguras.
   Solo sube la carpeta "assets" del ZIP a tu repo en la misma raíz que index.html.
*/
const posts = [
  // === TAROT ===
  {
    titulo: "Los orígenes del Tarot",
    categoria: "Tarot",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/origenes_tarot_blog.pdf",
    contenido: "" // El PDF se incrusta completo
  },
  {
    titulo: "Tarot — Artículo de blog",
    categoria: "Tarot",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/articulo_tarot_blog.pdf",
    contenido: ""
  },

  // === CURIOSIDADES ===
  {
    titulo: "Oráculos digitales — Sofía Muñoz",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/articulo_oraculos_digitales_sofia.pdf",
    contenido: ""
  },
  {
    titulo: "Magia Online — Sofía Muñoz",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/articulo_magia_online_sofia.pdf",
    contenido: ""
  },
  {
    titulo: "Oráculos en Internet: historia y cultura — Gaby",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/oraculos_en_internet_gaby.pdf",
    contenido: ""
  },
  {
    titulo: "Resurgimiento cultural de la ‘bruja’ en el siglo XXI — Gaby",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/resurgimiento_cultural_bruja_gaby.pdf",
    contenido: ""
  },
  {
    titulo: "Artículos de Mateo",
    categoria: "Curiosidades",
    fecha: "2025-09-01",
    pdfSrc: "assets/docs/articulos_mateo.pdf",
    contenido: ""
  }
];

/* =========================
   Búsqueda de posts (multi-palabra, ranking)
   ========================= */
function searchPosts(query) {
  const terms = (query || "").toLowerCase().match(/[a-záéíóúüñ0-9]+/gi);
  if (!terms || !terms.length) return { results: [], indices: [], scores: [] };

  const scored = [];
  posts.forEach((p, i) => {
    const haystack = `${p.titulo} ${p.categoria} ${p.contenido}`.toLowerCase();
    let score = 0;
    terms.forEach(t => { if (haystack.includes(t)) score++; });
    if (score > 0) {
      scored.push({ p, i, score, date: new Date(p.fecha || "1970-01-01") });
    }
  });

  scored.sort((a, b) => (b.score - a.score) || (b.date - a.date));
  return {
    results: scored.map(x => x.p),
    indices: scored.map(x => x.i),
    scores: scored.map(x => x.score)
  };
}

/* =========================
   Utilidades
   ========================= */
function formatearFecha(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

// Si el contenido ya trae HTML, lo dejamos; si es texto plano, lo convertimos a párrafos
function formatContent(raw) {
  const txt = (raw || "").trim();
  if (!txt) return "";
  if (/<[a-z][\s\S]*>/i.test(txt)) return txt; // ya es HTML
  const blocks = txt
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(b => `<p>${b.replace(/\n/g, "<br>")}</p>`);
  return blocks.join("\n");
}

/* =========================
   Render de tarjetas del Blog
   ========================= */
function renderPosts(list, indices) {
  const container = document.getElementById("blog-posts");
  if (!container) return;

  if (!list || !list.length) {
    container.innerHTML = `<p class="muted">No hay artículos en esta categoría aún.</p>`;
    return;
  }

  if (!indices) indices = list.map(p => posts.indexOf(p));

  container.innerHTML = list.map((p, i) => `
    <article class="post post-card" data-index="${indices[i]}">
      <h2>${p.titulo}</h2>
    </article>
  `).join("");

  container.querySelectorAll(".post-card").forEach(card => {
    card.addEventListener("click", () => {
      const idx = Number(card.getAttribute("data-index"));
      openPost(idx, 'blog');
    });
  });
}

/* =========================
   Modal de lectura (Blog u Oráculo)
   ========================= */
function openPost(idx, context = 'blog') {
  const p = posts[idx];
  if (!p) return;

  const ids = (context === 'oracle') ? {
    modal: 'oracleModal',
    tag: 'oracleModalTag',
    title: 'oracleModalTitle',
    meta: 'oracleModalMeta',
    body: 'oracleModalBody'
  } : {
    modal: 'postModal',
    tag: 'modalTag',
    title: 'modalTitle',
    meta: 'modalMeta',
    body: 'modalBody'
  };

  document.getElementById(ids.tag).textContent = p.categoria || "";
  document.getElementById(ids.title).textContent = p.titulo || "";
  document.getElementById(ids.meta).textContent = formatearFecha(p.fecha || "");

  // Si el post tiene PDF, lo embebemos completo; si no, pintamos contenido HTML/Texto
  if (p.pdfSrc) {
    document.getElementById(ids.body).innerHTML = `
      <object data="${p.pdfSrc}#view=FitH" type="application/pdf" class="pdf-object">
        <embed src="${p.pdfSrc}" type="application/pdf" />
      </object>
      <div class="pdf-fallback">
        Si no ves el PDF, <a href="${p.pdfSrc}" target="_blank" rel="noopener">ábrelo en una nueva pestaña</a>.
      </div>
    `;
  } else {
    document.getElementById(ids.body).innerHTML = formatContent(p.contenido || "");
  }

  const modal = document.getElementById(ids.modal);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closePost(modalId = null) {
  if (modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add("hidden");
  } else {
    document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
  }
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePost();
});

/* =========================
   Filtros por categoría (Blog)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Render inicial si alguien entra directo al blog
  if (document.getElementById("blog").classList.contains("active") ||
      !document.getElementById("home").classList.contains("active")) {
    renderPosts(posts);
  }

  const navLinks = document.querySelectorAll(".blog-nav .nav-link[data-filter]");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.dataset.filter;

      document.querySelectorAll(".blog-nav .nav-link").forEach(a => a.classList.remove("active"));
      link.classList.add("active");

      const filtered = posts
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.categoria === cat);

      renderPosts(filtered.map(x => x.p), filtered.map(x => x.i));

      const wrap = document.querySelector(".blog-wrap");
      if (wrap) window.scrollTo({ top: wrap.offsetTop - 16, behavior: "smooth" });
    });
  });
});
