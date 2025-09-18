/* =========================
   Navegación entre secciones
   ========================= */
function openSection(sectionId, initialList = null, initialIndices = null) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");

    // Si es blog, render inicial (o lista filtrada si se pasa)
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
   Oráculo (respuestas aleatorias)
   ========================= */
function askOracle() {
  const input = document.getElementById("oracleQuestion");
  const q = (input?.value || "").trim();

  // Sin filtro aquí: si hay texto y quieres, puedes mantener solo la respuesta azar
  const respuestas = [
    "El destino sonríe a tu favor 🌙",
    "Debes tener paciencia ✨",
    "La respuesta está en tu interior 🔮",
    "El universo te dará una señal pronto 🌌",
    "Camina con fe y encontrarás el camino 🔥",
    "Cuidado, no todo es lo que parece 🌑"
  ];
  const randomIndex = Math.floor(Math.random() * respuestas.length);
  document.getElementById("oracleAnswer").innerText = respuestas[randomIndex];
}

/* =========================
   Oráculo — Filtro (actualizado a multi-palabra)
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

  // abre el post (modal) al hacer clic
  box.querySelectorAll(".filter-item").forEach(el => {
    el.addEventListener("click", () => {
      const idx = Number(el.getAttribute("data-index"));
      openPost(idx);
    });
  });
}

// Enter para ejecutar el filtro
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
   Blog — Datos en memoria (EDITABLES)
   ========================= */
const posts = [
  {
    titulo: "Cómo leer tu carta natal sin perderte",
    categoria: "Astrología",
    fecha: "2025-08-27",
    contenido: "Un mapa de tu personalidad y tus ciclos. Guía básica para empezar con Sol, Luna y Ascendente."
  },
  {
    titulo: "Tres arcanos para desbloquear tu semana",
    categoria: "Tarot",
    fecha: "2025-08-25",
    contenido: "Elige entre A, B o C. Cada arcano trae un consejo práctico para el presente."
  },
  {
    titulo: "Símbolos cotidianos con potencia mística",
    categoria: "Curiosidades",
    fecha: "2025-08-23",
    contenido: "Puertas, velas y espejos: significados y rituales simples de protección y enfoque."
  }
];

/* =========================
   Búsqueda de posts (multi-palabra, coincidencias parciales)
   ========================= */
function searchPosts(query) {
  // tokeniza y normaliza (soporta tildes y números)
  const terms = (query || "")
    .toLowerCase()
    .match(/[a-záéíóúüñ0-9]+/gi);

  if (!terms || !terms.length) return { results: [], indices: [], scores: [] };

  // calcula un "score" = cuántas palabras de la consulta aparecen en el post
  const scored = [];
  posts.forEach((p, i) => {
    const haystack = `${p.titulo} ${p.categoria} ${p.contenido}`.toLowerCase();
    let score = 0;
    terms.forEach(t => { if (haystack.includes(t)) score++; });
    if (score > 0) {
      scored.push({
        p,
        i,
        score,
        date: new Date(p.fecha || "1970-01-01")
      });
    }
  });

  // ordena: primero mejor score, luego fecha más reciente
  scored.sort((a, b) => (b.score - a.score) || (b.date - a.date));

  return {
    results: scored.map(x => x.p),
    indices: scored.map(x => x.i),
    scores: scored.map(x => x.score)
  };
}
/* =========================
   Utilidades del Blog
   ========================= */
function formatearFecha(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

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
      openPost(idx);
    });
  });
}

/* =========================
   Modal de lectura a pantalla completa
   ========================= */
function openPost(idx) {
  const p = posts[idx];
  if (!p) return;

  document.getElementById("modalTag").textContent = p.categoria || "";
  document.getElementById("modalTitle").textContent = p.titulo || "";
  document.getElementById("modalMeta").textContent = formatearFecha(p.fecha || "");
  document.getElementById("modalBody").innerHTML = p.contenido || "";

  const modal = document.getElementById("postModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePost() {
  const modal = document.getElementById("postModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePost();
});

/* =========================
   Filtros por categoría (dentro del Blog)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Si se entra directo al blog, pinto
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

