/* =========================
   Navegación entre secciones
   ========================= */
function openSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    // Si es blog, render inicial de posts
    if (sectionId === "blog") {
      renderPosts(posts);
      document.querySelectorAll(".blog-nav .nav-link").forEach(a => a.classList.remove("active"));
    }
    // Llevar el scroll arriba al entrar a cualquier apartado
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

  if (!indices) indices = list.map(p => posts.indexOf(p));

  if (!list.length) {
    container.innerHTML = `<p class="muted">No hay artículos en esta categoría aún.</p>`;
    return;
  }

  // Solo título en la tarjeta (clic abre modal)
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
