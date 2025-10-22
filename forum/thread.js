// === thread.js — versión completa con login anónimo y Google ===

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUZxlkCyKI9aujf27qQV_-bqeOwmcnu8U",
  authDomain: "lumen-foro.firebaseapp.com",
  projectId: "lumen-foro",
  storageBucket: "lumen-foro.firebasestorage.app",
  messagingSenderId: "868961310491",
  appId: "1:868961310491:web:8fc2c50eb549bc31ae25be",
  measurementId: "G-D6M9EKJFDL"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "fabian.alba.off@gmail.com";

// === Elementos de la interfaz ===
const userInfo = document.getElementById("user-info");
const addCommentDiv = document.getElementById("add-comment");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("comments-list");

// Obtener ID del tema desde la URL
const params = new URLSearchParams(window.location.search);
const threadId = params.get("id");
if (!threadId) {
  document.body.innerHTML = "<h2>El tema no fue encontrado.</h2>";
  throw new Error("Falta el ID del tema");
}

logEvent(analytics, "view_thread", { threadId });

// === Variables globales ===
let anonUser = null;

// === Renderizar botones de login / logout ===
function renderLoginButton() {
  userInfo.innerHTML = `
    <button id="loginBtn">Sign in with Google</button>
    <button id="anonBtn">Entrar sin cuenta</button>
  `;

  // Login con Google
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    logEvent(analytics, "login", { method: "google" });
  });

  // Login anónimo con nombre
  document.getElementById("anonBtn").addEventListener("click", () => {
    const name = prompt("Escribe tu nombre (será visible en tus comentarios):");
    if (!name) return alert("Debes escribir un nombre para continuar.");
    anonUser = { displayName: name, uid: "anon-" + Date.now() };
    localStorage.setItem("anonName", name);
    renderUser(anonUser);
    addCommentDiv.hidden = false;
  });
}

// === Mostrar usuario autenticado o anónimo ===
function renderUser(user) {
  const displayName = user?.displayName || "Anónimo";
  userInfo.innerHTML = `
    <span>${displayName}</span>
    ${user?.email ? `<button id="logoutBtn">Logout</button>` : ""}
  `;

  if (user?.email) {
    document.getElementById("logoutBtn").addEventListener("click", () => {
      signOut(auth);
      logEvent(analytics, "logout");
    });
  }
  addCommentDiv.hidden = false;
}

// === Estado de autenticación ===
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderUser(user);
  } else {
    const savedAnon = localStorage.getItem("anonName");
    if (savedAnon) {
      anonUser = { displayName: savedAnon, uid: "anon-local" };
      renderUser(anonUser);
    } else {
      renderLoginButton();
    }
  }
});

// === Cargar contenido del tema ===
async function loadThread() {
  const threadDoc = await getDoc(doc(db, "threads", threadId));
  if (!threadDoc.exists()) {
    document.body.innerHTML = "<h2>Este tema no existe o fue eliminado.</h2>";
    return;
  }
  const data = threadDoc.data();
  document.getElementById("thread-title").textContent = data.title;
  document.getElementById("thread-content").textContent = data.content;
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
  document.getElementById("thread-meta").textContent = `Por ${data.author} • ${new Date(createdAt).toLocaleString()}`;
}
loadThread();

// === Publicar comentario ===
document.getElementById("commentBtn").addEventListener("click", async () => {
  const text = commentText.value.trim();
  if (!text) return alert("Escribe un comentario antes de publicar.");

  // Determinar autor (Google o anónimo)
  const user = auth.currentUser || anonUser || { displayName: "Anónimo", uid: "anon" };

  await addDoc(collection(db, "threads", threadId, "comments"), {
    text,
    author: user.displayName,
    authorId: user.uid,
    authorEmail: user.email || null,
    createdAt: serverTimestamp()
  });

  logEvent(analytics, "comment_added", { threadId });
  commentText.value = "";
});

// === Mostrar comentarios en tiempo real ===
const q = query(collection(db, "threads", threadId, "comments"), orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  commentsList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const c = docSnap.data();
    const id = docSnap.id;
    const createdAt = c.createdAt?.toDate ? c.createdAt.toDate() : new Date();
    const user = auth.currentUser || anonUser;
    const canDelete =
      (user && (user.email === ADMIN_EMAIL || user.uid === c.authorId));

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <p>${c.text}</p>
      <small>Por ${c.author} • ${new Date(createdAt).toLocaleString()}</small>
      ${canDelete ? `<div><button class="delComment" data-id="${id}">Borrar</button></div>` : ""}
    `;
    commentsList.appendChild(div);
  });

  // Botones de eliminar
  document.querySelectorAll(".delComment").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("¿Seguro que deseas borrar este comentario?")) return;
      await deleteDoc(doc(db, "threads", threadId, "comments", btn.getAttribute("data-id")));
    });
  });
});



