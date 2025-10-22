import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUZxlkCyK1gaujf27qQV--bqeOwmcnu8U",
  authDomain: "lumen-foro.firebaseapp.com",
  projectId: "lumen-foro",
  storageBucket: "lumen-foro.appspot.com",
  messagingSenderId: "868961314091",
  appId: "1:868961314091:web:8fc2c50eb549bc31ae25be",
  measurementId: "G-D6M9EKJFDL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "fabian.alba.off@gmail.com";

// UI
const userInfo = document.getElementById("user-info");
const addCommentDiv = document.getElementById("add-comment");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("comments-list");

const params = new URLSearchParams(window.location.search);
const threadId = params.get("id");
if (!threadId) {
  document.body.innerHTML = "<h2>Topic not found.</h2>";
  throw new Error("Missing thread id");
}

logEvent(analytics, "view_thread", { threadId }); // 🔥 registrar vista de tema

function renderLoginButton() {
  userInfo.innerHTML = `<button id="loginBtn">Sign in with Google</button>`;
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    logEvent(analytics, "login", { method: "google" });
  });
}


// Login / logout
function renderLoginButton() {
  userInfo.innerHTML = `<button id="loginBtn">Sign in with Google</button>`;
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  });
}
function renderUser(user) {
  userInfo.innerHTML = `<span>${user.displayName}</span>
                        <button id="logoutBtn">Logout</button>`;
  document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));
  addCommentDiv.hidden = false;
}
onAuthStateChanged(auth, (user) => { if (user) renderUser(user); else renderLoginButton(); });

// Cargar tema
async function loadThread() {
  const threadDoc = await getDoc(doc(db, "threads", threadId));
  if (!threadDoc.exists()) {
    document.body.innerHTML = "<h2>The topic does not exist or was removed.</h2>";
    return;
  }
  const data = threadDoc.data();
  document.getElementById("thread-title").textContent = data.title;
  document.getElementById("thread-content").textContent = data.content;
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
  document.getElementById("thread-meta").textContent = `By ${data.author} • ${new Date(createdAt).toLocaleString()}`;
}
loadThread();

// Publicar comentario
document.getElementById("commentBtn").addEventListener("click", async () => {
  const text = commentText.value.trim();
  if (!text) return alert("Write something.");
  const user = auth.currentUser;
  await addDoc(collection(db, "threads", threadId, "comments"), {
    text,
    author: user.displayName,
    authorId: user.uid,
    authorEmail: user.email,
    createdAt: serverTimestamp()
  });
  logEvent(analytics, "comment_added", { threadId });
  commentText.value = "";
});

// Listar comentarios (tiempo real)
const q = query(collection(db, "threads", threadId, "comments"), orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  commentsList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const c = docSnap.data();
    const id = docSnap.id;
    const createdAt = c.createdAt?.toDate ? c.createdAt.toDate() : new Date();
    const user = auth.currentUser;
    const canDelete = user && (user.email === ADMIN_EMAIL || user.uid === c.authorId);
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <p>${c.text}</p>
      <small>By ${c.author} • ${new Date(createdAt).toLocaleString()}</small>
      ${canDelete ? `<div><button class="delComment" data-id="${id}">Delete</button></div>` : ``}
    `;
    commentsList.appendChild(div);
  });

  // Borrar comentario (admin o autor)
  document.querySelectorAll(".delComment").forEach(btn=>{
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this comment?")) return;
      await deleteDoc(doc(db, "threads", threadId, "comments", btn.getAttribute("data-id")));
    });
  });
});

