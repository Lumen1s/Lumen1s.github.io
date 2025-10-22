import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUZxlkCyKI9aujf27qQV_-bqeOwmcnu8U",
  authDomain: "lumen-foro.firebaseapp.com",
  projectId: "lumen-foro",
  storageBucket: "lumen-foro.firebasestorage.app",
  messagingSenderId: "868961310491",
  appId: "1:868961310491:web:8fc2c50eb549bc31ae25be",
  measurementId: "G-D6M9EKJFDL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "fabian.alba.off@gmail.com";

// === ELEMENTOS ===
const welcomeScreen = document.getElementById("welcome-screen");
const forumContainer = document.getElementById("forum-container");
const loginGoogleBtn = document.getElementById("loginGoogleBtn");
const loginAnonBtn = document.getElementById("loginAnonBtn");
const userInfo = document.getElementById("user-info");
const threadsList = document.getElementById("threadsList");

let anonUser = null;

// === LOGIN CON GOOGLE ===
loginGoogleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  logEvent(analytics, "login", { method: "google" });
  enterForum(auth.currentUser);
});

// === LOGIN ANÓNIMO ===
loginAnonBtn.addEventListener("click", () => {
  const name = prompt("Escribe tu nombre (visible en tus publicaciones):");
  if (!name) return alert("Debes escribir un nombre.");
  anonUser = { displayName: name, uid: "anon-" + Date.now() };
  localStorage.setItem("anonName", name);
  enterForum(anonUser);
});

// === MOSTRAR FORO DESPUÉS DEL LOGIN ===
function enterForum(user) {
  welcomeScreen.classList.add("hidden");
  forumContainer.classList.remove("hidden");
  renderUser(user);
  subscribeThreads();
}

// === MOSTRAR USUARIO Y LOGOUT ===
function renderUser(user) {
  const name = user?.displayName || "Anónimo";
  userInfo.innerHTML = `
    <span>${name}</span>
    ${user?.email ? `<button id="logoutBtn">Logout</button>` : ""}
  `;
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      location.reload();
    });
  }
}

// === DETECTAR SESIÓN ACTIVA ===
onAuthStateChanged(auth, (user) => {
  if (user) {
    enterForum(user);
  } else {
    const savedName = localStorage.getItem("anonName");
    if (savedName) {
      anonUser = { displayName: savedName, uid: "anon-local" };
      enterForum(anonUser);
    }
  }
});

// === CREAR TEMA ===
document.getElementById("createThreadBtn").addEventListener("click", async () => {
  const title = document.getElementById("threadTitle").value.trim();
  const content = document.getElementById("threadContent").value.trim();
  if (!title || !content) return alert("Completa todos los campos.");
  const user = auth.currentUser || anonUser || { displayName: "Anónimo" };

  await addDoc(collection(db, "threads"), {
    title,
    content,
    author: user.displayName,
    authorId: user.uid || null,
    authorEmail: user.email || null,
    createdAt: serverTimestamp()
  });
  logEvent(analytics, "create_thread", { title });

  document.getElementById("threadTitle").value = "";
  document.getElementById("threadContent").value = "";
});

// === LISTAR TEMAS EN TIEMPO REAL ===
function subscribeThreads() {
  const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    threadsList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const thread = docSnap.data();
      const id = docSnap.id;
      const createdAt = thread.createdAt?.toDate ? thread.createdAt.toDate() : new Date();
      const user = auth.currentUser || anonUser;
      const canDelete =
        (user && (user.email === ADMIN_EMAIL || user.uid === thread.authorId));

      const el = document.createElement("div");
      el.className = "thread";
      el.innerHTML = `
        <h3><a href="thread.html?id=${id}" class="thread-link">${thread.title}</a></h3>
        <p>${thread.content}</p>
        <div class="meta">Por ${thread.author || "Anónimo"} • ${new Date(createdAt).toLocaleString()}</div>
        <div class="actions">
          <a href="thread.html?id=${id}"><button>Ver</button></a>
          ${canDelete ? `<button class="deleteBtn" data-id="${id}">Borrar</button>` : ""}
        </div>
      `;
      threadsList.appendChild(el);
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Seguro que deseas borrar este tema?")) return;
        await deleteDoc(doc(db, "threads", btn.getAttribute("data-id")));
      });
    });
  });
}





