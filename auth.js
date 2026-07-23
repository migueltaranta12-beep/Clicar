import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";

  } catch (e) {

    alert("Correo o contraseña incorrectos.");

  }

};

onAuthStateChanged(auth, (user) => {

  if (user && window.location.pathname.includes("login.html")) {
    window.location.href = "admin.html";
  }

});
