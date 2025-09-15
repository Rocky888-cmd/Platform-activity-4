import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// 🔧 Firebase config (same as signup.js)
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

/* ---------- Same helper crypto functions as signup.js ---------- */
function str2ab(str) {
  return new TextEncoder().encode(str);
}
function abToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function sha256Hex(input) {
  const data = (input instanceof Uint8Array) ? input : str2ab(String(input));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return abToHex(hashBuffer);
}

/* ---------- Signin logic ---------- */
window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let user = document.getElementById("loginUser").value.trim();
      let pass = document.getElementById("loginPass").value.trim();

      if (!user || !pass) {
        alert("⚠ Please fill in all fields.");
        return;
      }

      try {
        // We don’t know salt yet — must check all users
        const dbRef = ref(db, "studentInfo");
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
          alert("❌ No users registered.");
          return;
        }

        let found = false;
        snapshot.forEach(childSnap => {
          const data = childSnap.val();
          if (data.userName === user) {
            found = true;
            // recompute hash with stored salt
            sha256Hex(data.salt + pass).then(async (pwdHashHex) => {
              // recompute expected userKey
              const userKeyHex = await sha256Hex(user + ":" + pwdHashHex);

              if (
                data.passwordHash === pwdHashHex &&
                childSnap.key === encodeURIComponent(userKeyHex)
              ) {
                // ✅ Success
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("currentUser", user);

                alert("✅ Login successful!");
                window.location.href = "dashboard.html";
              } else {
                alert("❌ Invalid username or password.");
              }
            });
          }
        });

        if (!found) {
          alert("❌ User not found.");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        alert("Error logging in: " + error.message);
      }
    });
  }

  // 🚪 Kickback: if logged in and on index.html → go to dashboard
  if (localStorage.getItem("loggedIn") === "true" && window.location.pathname.includes("index.html")) {
    window.location.href = "dashboard.html";
  }
});

// 🔓 Logout
window.logout = function () {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  alert("🚪 You have been logged out!");
  window.location.href = "index.html";
};
