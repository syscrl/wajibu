// Firebase CDN Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAtb3j689SACHCK-jTXQq0ogAUqqe-j-Xc",
  authDomain: "wajibu-d6711.firebaseapp.com",
  projectId: "wajibu-d6711",
  storageBucket: "wajibu-d6711.appspot.com",
  messagingSenderId: "569118868943",
  appId: "1:569118868943:web:e29aa464ba826b6b863eba"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // <== THIS is what was likely missing

// ✅ Login Form Handler
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().isAdmin) {
      window.location.href = "/frontend/pages/admin-dashboard.html";
    } else {
      alert("Access denied. Admins only.");
    }
  } catch (error) {
    alert("Login failed: " + error.message);
    console.error("Login error:", error);
  }
});
