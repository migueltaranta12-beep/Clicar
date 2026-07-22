import { firebaseConfig, cloudinaryConfig } from "./firebase.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
getFirestore,
collection,
addDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (!user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
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
const banner = document.getElementById("banner");
const previewBanner = document.getElementById("previewBanner");
const subirBanner = document.getElementById("subirBanner");
const estadoBanner = document.getElementById("estadoBanner");
const logo = document.getElementById("logo");
const previewLogo = document.getElementById("previewLogo");
const subirLogo = document.getElementById("subirLogo");
const cerrarSesion = document.getElementById("cerrarSesion");
const estadoLogo = document.getElementById("estadoLogo");
function actualizarVista() {

    previewTitulo.textContent =
        `${marca.value} ${modelo.value}`.trim() || "Marca Modelo";

    previewPrecio.textContent =
        precio.value ? `$ ${precio.value}` : "$0";

    previewDescripcion.textContent =
        descripcion.value || "Sin descripción";

}

function actualizarImagen(e) {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = (evento) => {

        previewImagen.src = evento.target.result;

    };

    lector.readAsDataURL(archivo);

}

marca.addEventListener("input", actualizarVista);
modelo.addEventListener("input", actualizarVista);
precio.addEventListener("input", actualizarVista);
descripcion.addEventListener("input", actualizarVista);

imagen.addEventListener("change", actualizarImagen);
imagen.addEventListener("change", actualizarImagen);

banner.addEventListener("change", (e) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = (evento) => {
        previewBanner.src = evento.target.result;
    };

    lector.readAsDataURL(archivo);

});

actualizarVista();
actualizarVista();
async function subirImagenCloudinary(archivo) {

    const formData = new FormData();

    formData.append("file", archivo);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);

    const respuesta = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!respuesta.ok) {
        throw new Error("No se pudo subir la imagen.");
    }

    const datos = await respuesta.json();

    return datos.secure_url;

}

publicar.addEventListener("click", async (e) => {

    e.preventDefault();

    if (
        !marca.value ||
        !modelo.value ||
        !anio.value ||
        !precio.value ||
        !km.value ||
        !imagen.files.length
    ) {

        estado.textContent = "⚠️ Completá todos los campos.";

        return;

    }

    estado.textContent = "📤 Subiendo imagen...";

    try {

        const urlImagen = await subirImagenCloudinary(imagen.files[0]);
              await addDoc(collection(db, "autos"), {
            marca: marca.value,
            modelo: modelo.value,
            anio: Number(anio.value),
            precio: Number(precio.value),
            km: Number(km.value),
            descripcion: descripcion.value,
            imagen: urlImagen,
            creado: Date.now()
        });

        estado.textContent = "✅ Vehículo publicado correctamente.";

        document.getElementById("formAuto").reset();

        previewImagen.src =
            "https://placehold.co/700x450?text=Sin+Imagen";

        previewTitulo.textContent = "Marca Modelo";
        previewPrecio.textContent = "$0";
        previewDescripcion.textContent = "Sin descripción";

    } catch (error) {

        console.error(error);

        estado.textContent =
            "❌ Ocurrió un error al publicar el vehículo.";

    }

});
subirBanner.addEventListener("click", async (e) => {

    e.preventDefault();

    if (!banner.files.length) {
        estadoBanner.textContent = "⚠️ Seleccioná una imagen.";
        return;
    }

    estadoBanner.textContent = "📤 Subiendo banner...";

    try {

        const urlBanner = await subirImagenCloudinary(banner.files[0]);

        const id = "banner" + Date.now();

        await setDoc(doc(db, "banners", id), {
            imagen: urlBanner,
            creado: Date.now()
        });

        estadoBanner.textContent = "✅ Banner subido correctamente.";

        document.getElementById("formBanner").reset();

        previewBanner.src =
        "https://placehold.co/1200x400?text=Banner";

    } catch (error) {

        console.error(error);

        estadoBanner.textContent =
        "❌ Error al subir el banner.";

    }

});
logo.addEventListener("change", (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = (evento) => {
        previewLogo.src = evento.target.result;
    };

    lector.readAsDataURL(archivo);
});
cerrarSesion.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
  const cerrarSesion = document.getElementById("cerrarSesion");

if (cerrarSesion) {
  cerrarSesion.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
});
