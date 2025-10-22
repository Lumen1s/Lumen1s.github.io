// Foro LUMEN — lista de temas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu config real
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
const analytics = getAnalytics(app); // 🔥 activamos Google Analytics
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "fabian.alba.off@gmail.com";

const userInfo = document.getElementById("user-info");
const threadsList = document.getElementById("threadsList");
const createSection = document.getElementById("createThreadSection");

// Login / Logout
function renderLoginButton() {
  userInfo.innerHTML = `<button id="loginBtn">Sign in with Google</button>`;
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    logEvent(analytics, "login", { method: "google" }); // registro de login
  });
}
function renderUser(user) {
  userInfo.innerHTML = `<span>${user.displayName}</span>
                        <button id="logoutBtn">Logout</button>`;
  document.getElementById("logoutBtn").addEventListener("click", async () => { 
    await signOut(auth);
    logEvent(analytics, "logout");
  });
  createSection.hidden = false;
}

// Sesión
onAuthStateChanged(auth, (user) => {
  if (user) { renderUser(user); subscribeThreads(); logEvent(analytics, "user_online"); }
  else { renderLoginButton(); createSection.hidden = true; subscribeThreads(); }
});

// Crear tema
document.getElementById("createThreadBtn").addEventListener("click", async () => {
  const title = document.getElementById("threadTitle").value.trim();
  const content = document.getElementById("threadContent").value.trim();
  if (!title || !content) return alert("Completa todos los campos.");
  const user = auth.currentUser;
  await addDoc(collection(db, "threads"), {
    title, content,
    author: user.displayName,
    authorId: user.uid,
    authorEmail: user.email,
    createdAt: serverTimestamp(),
    flagged: false
  });
  logEvent(analytics, "create_thread", { title }); // 🔥 evento Analytics
  document.getElementById("threadTitle").value = "";
  document.getElementById("threadContent").value = "";
});


// Listado en tiempo real
let unsubscribe = null;
function subscribeThreads() {
  if (unsubscribe) unsubscribe();
  const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
  unsubscribe = onSnapshot(q, (snapshot) => {
    threadsList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const thread = docSnap.data();
      const id = docSnap.id;
      const createdAt = thread.createdAt?.toDate ? thread.createdAt.toDate() : new Date();
      const user = auth.currentUser;
      const canDelete = (user && (user.email === ADMIN_EMAIL || user.uid === thread.authorId));

      const el = document.createElement("div");
      el.className = "thread";
      el.innerHTML = `
        <h3><a href="thread.html?id=${id}" class="thread-link">${thread.title}</a></h3>
        <p>${thread.content}</p>
        <div class="meta">By ${thread.author || 'Anon'} • ${new Date(createdAt).toLocaleString()}</div>
        <div class="actions">
          <a href="thread.html?id=${id}"><button>Open</button></a>
          <button class="flagBtn" data-id="${id}">Report</button>
          ${canDelete ? `<button class="deleteBtn" data-id="${id}">Delete</button>` : ``}
        </div>
      `;
      threadsList.appendChild(el);
    });

    // Moderar / reportar
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this topic?")) return;
        await deleteDoc(doc(db, "threads", btn.getAttribute("data-id")));
      });
    });
    document.querySelectorAll(".flagBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await updateDoc(doc(db, "threads", id), { flagged: true });
        alert("Thanks. The topic was flagged for review.");
      });
    });
  });
}


