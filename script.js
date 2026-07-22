import { firebaseConfig, cloudinaryConfig } from "./firebase.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const marca = document.getElementById("marca");
const modelo = document.getElementById("modelo");
const anio = document.getElementById("anio");
const precio = document.getElementById("precio");
const km = document.getElementById("km");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");

const previewImagen = document.getElementById("previewImagen");
const previewTitulo = document.getElementById("previewTitulo");
const previewPrecio = document.getElementById("previewPrecio");
const previewDescripcion = document.getElementById("previewDescripcion");

const publicar = document.getElementById("publicar");
const estado = document.getElementById("estado");

function actualizarVista(){

    previewTitulo.textContent =
        marca.value + " " + modelo.value;

    previewPrecio.textContent =
        "$ " + precio.value;

    previewDescripcion.textContent =
        descripcion.value || "Sin descripción";

}
