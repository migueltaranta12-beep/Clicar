import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuración de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyC8YBo6ynaldT7iRJ4fPLe_5Bxkj1o9_sc",
  authDomain: "clicar-627e8.firebaseapp.com",
  projectId: "clicar-627e8",
  storageBucket: "clicar-627e8.firebasestorage.app",
  messagingSenderId: "1038834599999",
  appId: "1:1038834599999:web:51ea9a9669858caa93508a"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Configuración de Cloudinary
export const cloudinaryConfig = {
  cloudName: "zpbpygfg",
  uploadPreset: "Clicarautos"
};
