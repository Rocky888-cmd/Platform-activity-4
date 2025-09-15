
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-bk3kUmemjtV9O-42lAcgpIR2wWO4lPo",
  authDomain: "platform-8df55.firebaseapp.com",
  projectId: "platform-8df55",
  storageBucket: "platform-8df55.firebasestorage.app",
  messagingSenderId: "338093660243",
  appId: "1:338093660243:web:3159e70684e6cc7ccd4ea6",
  measurementId: "G-BTS3547GN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Sign-up logic
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let user = document.getElementById("signupUser").value.trim();
    let pass = document.getElementById("signupPass").value.trim();

    if (!user || !pass) {
      alert("Please fill in all fields.");
      return;
    }

    // Hashmap key: combine username and password
    let userKey = user + "_" + pass;

    set(ref(db, "studentInfo/" + userKey), {
      userName: user,
      userPassword: pass
    })
    .then(() => {
      alert("Signup successful! You can now log in.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Error signing up: " + error.message);
    });
  });
});
