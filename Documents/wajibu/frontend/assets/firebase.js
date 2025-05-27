import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, getDoc, onSnapshot, query, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ✅ 1. Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtb3j689SACHCK-jTXQq0ogAUqqe-j-Xc",
  authDomain: "wajibu-d6711.firebaseapp.com",
  projectId: "wajibu-d6711",
  storageBucket: "wajibu-d6711.firebasestorage.app",
  messagingSenderId: "569118868943",
  appId: "1:569118868943:web:e29aa464ba826b6b863eba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "testCollection"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Firestore test failed:", error);
  }
}
testFirestore();

// 🔄 Static fetch (if needed)
export async function fetchSiteStats() {
  const statsRef = doc(db, "siteStats", "civicImpact");
  const docSnap = await getDoc(statsRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// 🔁 Real-time listener for civic stats
export function watchSiteStats() {
  const statsRef = doc(db, "siteStats", "civicImpact");
  onSnapshot(statsRef, (docSnap) => {
    if (docSnap.exists()) {
      const stats = docSnap.data();
      document.getElementById("stat-issues").textContent = stats.issuesReported;
      document.getElementById("stat-petitions").textContent = stats.petitionsSigned;
      document.getElementById("stat-actions").textContent = stats.actionsVerified;
    } else {
      console.warn("⚠️ No civicImpact document found in siteStats.");
    }
  });
}

// 🔁 Get static news updates (once)
export async function fetchNewsUpdates() {
  const q = query(collection(db, "news"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 🔁 Get petitions (you can duplicate this for other collections)
export async function fetchPetitions() {
  const q = query(collection(db, "petitions"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export { db, auth };    