// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtb3j689SACHCK-jTXQq0ogAUqqe-j-Xc",
    authDomain: "wajibu-d6711.firebaseapp.com",
    projectId: "wajibu-d6711",
    storageBucket: "wajibu-d6711.firebasestorage.app",
    messagingSenderId: "569118868943",
    appId: "1:569118868943:web:e29aa464ba826b6b863eba"
  };
  
// Non-modular Firebase Initialization
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth(); // Non-modular way
  console.log("Firebase initialized:", firebase);