import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC-bk3kUmemjtV9O-42lAcgpIR2wWO4lPo",
  authDomain: "platform-8df55.firebaseapp.com",
  databaseURL: "https://platform-8df55-default-rtdb.firebaseio.com",
  projectId: "platform-8df55",
  storageBucket: "platform-8df55.appspot.com",
  messagingSenderId: "338093660243",
  appId: "1:338093660243:web:3159e70684e6cc7ccd4ea6",
  measurementId: "G-BTS3547GN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ---------- Helper crypto functions ---------- */

// Convert string to Uint8Array
function str2ab(str) {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to hex string
function abToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate random salt (16 bytes)
function genSaltHex(len = 16) {
  const salt = new Uint8Array(len);
  crypto.getRandomValues(salt);
  return abToHex(salt.buffer);
}

// Compute SHA-256 hex of input Uint8Array or string
async function sha256Hex(input) {
  const data = (input instanceof Uint8Array) ? input : str2ab(String(input));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return abToHex(hashBuffer); // 64 hex chars = 256 bits
}

/* ---------- DOM + signup logic ---------- */
window.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const modal = document.getElementById("termsModal");
  const openBtn = document.getElementById("openTerms");
  const closeBtn = document.getElementById("closeTerms");

  // modal handlers
  openBtn.onclick = (e) => { e.preventDefault(); modal.style.display = "flex"; };
  closeBtn.onclick = () => { modal.style.display = "none"; };
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  // Make the submit handler async to await hashing
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let user = document.getElementById("signupUser").value.trim();
    let pass = document.getElementById("signupPass").value.trim();
    let termsAccepted = document.getElementById("termsCheck").checked;

    if (!user || !pass) {
      alert("Please fill in all fields.");
      return;
    }
    if (!termsAccepted) {
      alert("You must agree to the Terms & Conditions before signing up.");
      return;
    }

    try {
      // 1) generate salt
      const saltHex = genSaltHex(16); // 16 bytes -> 32 hex bytes

      // 2) compute password hash = SHA256( salt || password )
      // We'll concatenate salt (hex) + password as string input
      const pwdHashHex = await sha256Hex(saltHex + pass);

      // 3) derive a stable, non-revealing user key
      //    userKey = SHA256( username + ":" + pwdHashHex )
      const userKeyHex = await sha256Hex(user + ":" + pwdHashHex);

      // Store to Firebase (store username, salt, passwordHash but NOT plaintext password)
      await set(ref(db, "studentInfo/" + encodeURIComponent(userKeyHex)), {
        userName: user,
        salt: saltHex,
        passwordHash: pwdHashHex,
        createdAt: Date.now()
      });

      alert("Signup successful! You can now log in.");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Hashing / Firebase error", err);
      alert("Error signing up: " + (err.message || err));
    }
  });
});
