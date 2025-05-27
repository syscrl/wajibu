// comment-api.js
import { db } from './firebase.js';
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Save a comment
export async function postComment(auditId, name, text) {
  const ref = collection(db, "audits", auditId, "comments");
  await addDoc(ref, {
    name,
    text,
    timestamp: serverTimestamp()
  });
}

// Fetch all comments
export async function fetchComments(auditId) {
  const ref = collection(db, "audits", auditId, "comments");
  const q = query(ref, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Delete a comment
export async function deleteComment(auditId, commentId) {
  const ref = doc(db, "audits", auditId, "comments", commentId);
  await deleteDoc(ref);
}
