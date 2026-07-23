import { app, auth, firebaseConfig } from "./firebase.js";

import {
getFirestore,
collection,
addDoc,
setDoc,
doc,
getDoc,
getDocs,
query,
orderBy,
deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



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

const banner = document.getElementById("banner");
const previewBanner = document.getElementById("previewBanner");
const subirBanner = document.getElementById("subirBanner");
const estadoBanner = document.getElementById("estadoBanner");

const logo = document.getElementById("logo");
const previewLogo = document.getElementById("previewLogo");
const subirLogo = document.getElementById("subirLogo");
const estadoLogo = document.getElementById("estadoLogo");

const tituloWeb = document.getElementById("tituloWeb");
const subtituloWeb = document.getElementById("subtituloWeb");
const whatsappWeb = document.getElementById("whatsappWeb");
const horarioWeb = document.getElementById("horarioWeb");
const guardarContenido = document.getElementById("guardarContenido");
const estadoContenido = document.getElementById("estadoContenido");

const cerrarSesion = document.getElementById("cerrarSesion");
const CLOUD_NAME = "zpbpygfg";
const UPLOAD_PRESET = "Clicarautos";

async function subirACloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const respuesta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!respuesta.ok) {
    throw new Error("Error al subir la imagen.");
  }

  const datos = await respuesta.json();
  return datos.secure_url;
}

if (imagen) {
  imagen.addEventListener("change", () => {
    if (imagen.files.length) {
      previewImagen.src = URL.createObjectURL(imagen.files[0]);
    }
  });
}

if (banner) {
  banner.addEventListener("change", () => {
    if (banner.files.length) {
      previewBanner.src = URL.createObjectURL(banner.files[0]);
    }
  });
}

if (logo) {
  logo.addEventListener("change", () => {
    if (logo.files.length) {
      previewLogo.src = URL.createObjectURL(logo.files[0]);
    }
  });
          }
async function publicarVehiculo() {
  try {

    if (
      !marca.value ||
      !modelo.value ||
      !anio.value ||
      !precio.value ||
      !km.value ||
      !descripcion.value ||
      !imagen.files.length
    ) {
      alert("Completa todos los campos.");
      return;
    }

    estado.textContent = "Subiendo imagen...";

    const urlImagen = await subirACloudinary(imagen.files[0]);

    await addDoc(collection(db, "vehiculos"), {
      marca: marca.value,
      modelo: modelo.value,
      anio: Number(anio.value),
      precio: Number(precio.value),
      km: Number(km.value),
      descripcion: descripcion.value,
      imagen: urlImagen,
      fecha: Date.now()
    });

    estado.textContent = "✅ Vehículo publicado correctamente.";

    marca.value = "";
    modelo.value = "";
    anio.value = "";
    precio.value = "";
    km.value = "";
    descripcion.value = "";
    imagen.value = "";

    previewImagen.src = "";

    if (typeof cargarVehiculos === "function") {
      cargarVehiculos();
    }

  } catch (error) {
  console.error(error);
  alert(error.message);
  estado.textContent = "❌ Error al publicar el vehículo.";
  }
}

if (publicar) {
  publicar.addEventListener("click", publicarVehiculo);
          }
async function cargarVehiculos() {

  const contenedor = document.getElementById("listaVehiculos");

  if (!contenedor) return;

  contenedor.innerHTML = "Cargando vehículos...";

  const consulta = query(
    collection(db, "vehiculos"),
    orderBy("fecha", "desc")
  );

  const snapshot = await getDocs(consulta);

  contenedor.innerHTML = "";

  snapshot.forEach((documento) => {

    const auto = documento.data();

    const tarjeta = document.createElement("div");
    tarjeta.className = "vehiculo-admin";

    tarjeta.innerHTML = `
      <img src="${auto.imagen}" style="width:180px;border-radius:10px;">
      <h3>${auto.marca} ${auto.modelo}</h3>
      <p>Año: ${auto.anio}</p>
      <p>Km: ${auto.km}</p>
      <p>Precio: $${auto.precio}</p>

      <button class="eliminar" data-id="${documento.id}">
        🗑 Eliminar
      </button>
    `;

    contenedor.appendChild(tarjeta);

  });

  document.querySelectorAll(".eliminar").forEach((boton) => {

    boton.addEventListener("click", async () => {

      if (!confirm("¿Eliminar este vehículo?")) return;

      await deleteDoc(doc(db, "vehiculos", boton.dataset.id));

      cargarVehiculos();

    });

  });

}

cargarVehiculos();
async function guardarConfiguracion() {

  try {

    const datos = {};

    if (tituloWeb) datos.titulo = tituloWeb.value;
    if (subtituloWeb) datos.subtitulo = subtituloWeb.value;
    if (whatsappWeb) datos.whatsapp = whatsappWeb.value;
    if (horarioWeb) datos.horario = horarioWeb.value;

    if (banner && banner.files.length) {
      estadoBanner.textContent = "Subiendo banner...";
      datos.banner = await subirACloudinary(banner.files[0]);
    }

    if (logo && logo.files.length) {
      estadoLogo.textContent = "Subiendo logo...";
      datos.logo = await subirACloudinary(logo.files[0]);
    }

    await setDoc(doc(db, "configuracion", "principal"), datos, {
      merge: true
    });

    if (estadoContenido) {
      estadoContenido.textContent = "✅ Configuración guardada.";
    }

    if (estadoBanner) estadoBanner.textContent = "";
    if (estadoLogo) estadoLogo.textContent = "";

  } catch (error) {
    console.error(error);

    if (estadoContenido) {
      estadoContenido.textContent = "❌ Error al guardar.";
    }
  }
}

if (guardarContenido) {
  guardarContenido.addEventListener("click", guardarConfiguracion);
}
async function cargarConfiguracion() {

  try {

    const referencia = doc(db, "configuracion", "principal");
    const documento = await getDoc(referencia);

    if (!documento.exists()) return;

    const datos = documento.data();

    if (tituloWeb && datos.titulo) tituloWeb.value = datos.titulo;
    if (subtituloWeb && datos.subtitulo) subtituloWeb.value = datos.subtitulo;
    if (whatsappWeb && datos.whatsapp) whatsappWeb.value = datos.whatsapp;
    if (horarioWeb && datos.horario) horarioWeb.value = datos.horario;

    if (previewBanner && datos.banner) {
      previewBanner.src = datos.banner;
    }

    if (previewLogo && datos.logo) {
      previewLogo.src = datos.logo;
    }

  } catch (error) {
    console.error("Error al cargar la configuración:", error);
  }

}

cargarConfiguracion();

if (cerrarSesion) {

  cerrarSesion.addEventListener("click", async () => {

    try {

      await signOut(auth);
      window.location.href = "login.html";

    } catch (error) {

      console.error(error);
      alert("No se pudo cerrar la sesión.");

    }

  });

}

if (subirBanner) {

  subirBanner.addEventListener("click", async () => {

    try {

      if (!banner.files.length) {
        alert("Seleccioná una imagen para el banner.");
        return;
      }

      estadoBanner.textContent = "Subiendo banner...";

      const url = await subirACloudinary(banner.files[0]);

      await setDoc(
        doc(db, "configuracion", "principal"),
        { banner: url },
        { merge: true }
      );

      previewBanner.src = url;
      estadoBanner.textContent = "✅ Banner actualizado.";
      banner.value = "";

    } catch (error) {

      console.error(error);
      alert(error.message);
      estadoBanner.textContent = "❌ Error al subir el banner.";

    }

  });

}

if (subirLogo) {

  subirLogo.addEventListener("click", async () => {

    try {

      if (!logo.files.length) {
        alert("Seleccioná un logo.");
        return;
      }

      estadoLogo.textContent = "Subiendo logo...";

      const url = await subirACloudinary(logo.files[0]);

      await setDoc(
        doc(db, "configuracion", "principal"),
        { logo: url },
        { merge: true }
      );

      previewLogo.src = url;
      estadoLogo.textContent = "✅ Logo actualizado.";
      logo.value = "";

    } catch (error) {

      console.error(error);
      alert(error.message);
      estadoLogo.textContent = "❌ Error al subir el logo.";

    }

  });

  }
