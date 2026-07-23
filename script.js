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
const emailWeb = document.getElementById("emailWeb");
const quienesTitulo = document.getElementById("quienesTitulo");
const tarjeta1Titulo = document.getElementById("tarjeta1Titulo");
const tarjeta1Texto = document.getElementById("tarjeta1Texto");
const tarjeta2Titulo = document.getElementById("tarjeta2Titulo");
const tarjeta2Texto = document.getElementById("tarjeta2Texto");
const contactoTitulo = document.getElementById("contactoTitulo");
const guardarContenido = document.getElementById("guardarContenido");
const estadoContenido = document.getElementById("estadoContenido");
const marcaEntrega = document.getElementById("marcaEntrega");
const modeloEntrega = document.getElementById("modeloEntrega");
const clienteEntrega = document.getElementById("clienteEntrega");
const fechaEntrega = document.getElementById("fechaEntrega");
const mensajeEntrega = document.getElementById("mensajeEntrega");
const videoEntrega = document.getElementById("videoEntrega");
const imagenesEntrega = document.getElementById("imagenesEntrega");

const publicarEntrega = document.getElementById("publicarEntrega");
const estadoEntrega = document.getElementById("estadoEntrega");
const listaEntregasAdmin = document.getElementById("listaEntregasAdmin");
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
async function cargarEntregasAdmin() {

  if (!listaEntregasAdmin) return;

  listaEntregasAdmin.innerHTML = "Cargando entregas...";

  const consulta = query(
    collection(db, "entregas"),
    orderBy("creado", "desc")
  );

  const snapshot = await getDocs(consulta);

  listaEntregasAdmin.innerHTML = "";

  snapshot.forEach((documento) => {

    const entrega = documento.data();

    const tarjeta = document.createElement("div");

    tarjeta.className = "vehiculo-admin";

    tarjeta.innerHTML = `
      <img src="${entrega.imagenes[0]}" style="width:180px;border-radius:10px;">
      <h3>${entrega.marca} ${entrega.modelo}</h3>
      <p><b>Cliente:</b> ${entrega.cliente}</p>

<p>${entrega.mensaje || ""}</p>

${
  entrega.video
    ? `<a href="${entrega.video}" target="_blank">🎥 Ver video</a>`
    : ""
}

      <button class="eliminarEntrega" data-id="${documento.id}">
        🗑 Eliminar
      </button>
    `;

    listaEntregasAdmin.appendChild(tarjeta);

  });

  document.querySelectorAll(".eliminarEntrega").forEach((boton) => {

    boton.addEventListener("click", async () => {

      if (!confirm("¿Eliminar esta entrega?")) return;

      await deleteDoc(doc(db, "entregas", boton.dataset.id));

      cargarEntregasAdmin();

    });

  });

}
cargarEntregasAdmin();
async function guardarConfiguracion() {

  try {

    const datos = {};

    if (tituloWeb) datos.titulo = tituloWeb.value;
    if (subtituloWeb) datos.subtitulo = subtituloWeb.value;
    if (whatsappWeb) datos.whatsapp = whatsappWeb.value;
    if (horarioWeb) datos.horario = horarioWeb.value;
if (quienesTitulo) datos.quienesTitulo = quienesTitulo.value;
if (tarjeta1Titulo) datos.tarjeta1Titulo = tarjeta1Titulo.value;
if (tarjeta1Texto) datos.tarjeta1Texto = tarjeta1Texto.value;
if (tarjeta2Titulo) datos.tarjeta2Titulo = tarjeta2Titulo.value;
if (tarjeta2Texto) datos.tarjeta2Texto = tarjeta2Texto.value;
if (contactoTitulo) datos.contactoTitulo = contactoTitulo.value;
    if (banner && banner.files.length) {

  estadoBanner.textContent = "Subiendo banners...";

  const referencia = doc(db, "configuracion", "principal");

  const documento = await getDoc(referencia);

  let banners = [];

  if (documento.exists()) {

    const datosGuardados = documento.data();

    if (Array.isArray(datosGuardados.banners)) {
      banners = [...datosGuardados.banners];
    }

  }

  for (const archivo of banner.files) {

    if (banners.length >= 5) {
      break;
    }

    const url = await subirACloudinary(archivo);

    banners.push(url);

  }

  datos.banners = banners;

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
if (quienesTitulo && datos.quienesTitulo)
  quienesTitulo.value = datos.quienesTitulo;

if (tarjeta1Titulo && datos.tarjeta1Titulo)
  tarjeta1Titulo.value = datos.tarjeta1Titulo;

if (tarjeta1Texto && datos.tarjeta1Texto)
  tarjeta1Texto.value = datos.tarjeta1Texto;

if (tarjeta2Titulo && datos.tarjeta2Titulo)
  tarjeta2Titulo.value = datos.tarjeta2Titulo;

if (tarjeta2Texto && datos.tarjeta2Texto)
  tarjeta2Texto.value = datos.tarjeta2Texto;

if (contactoTitulo && datos.contactoTitulo)
  contactoTitulo.value = datos.contactoTitulo;
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
        alert("Seleccioná al menos un banner.");
        return;
      }

      if (banner.files.length > 5) {
        alert("Solo se permiten hasta 5 banners.");
        return;
      }

      estadoBanner.textContent = "Subiendo banners...";

      const referencia = doc(db, "configuracion", "principal");

const documento = await getDoc(referencia);

let urls = [];

if (documento.exists()) {
  const datos = documento.data();
  if (datos.banners) {
    urls = [...datos.banners];
  }
}

for (const archivo of banner.files) {

  if (urls.length >= 5) break;

  const url = await subirACloudinary(archivo);

  urls.push(url);

}

await setDoc(
  referencia,
  { banners: urls },
  { merge: true }
);

      previewBanner.src = urls[0];
      estadoBanner.textContent = "✅ Banners actualizados.";
      banner.value = "";

    } catch (error) {

      console.error(error);
      alert(error.message);
      estadoBanner.textContent = "❌ Error al subir los banners.";

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
async function publicarEntregaFuncion() {

  try {

    if (
      !marcaEntrega.value ||
      !modeloEntrega.value ||
      !clienteEntrega.value ||
      !fechaEntrega.value ||
      !mensajeEntrega.value ||
      !imagenesEntrega.files.length
      
    ) {
      alert("Completa todos los campos.");
      return;
    }

    estadoEntrega.textContent = "Subiendo entrega...";

    const imagenes = [];

    for (const archivo of imagenesEntrega.files) {

      if (imagenes.length >= 5) break;

      const url = await subirACloudinary(archivo);
      imagenes.push(url);

    }

    await addDoc(collection(db, "entregas"), {
  marca: marcaEntrega.value,
  modelo: modeloEntrega.value,
  cliente: clienteEntrega.value,
  fecha: fechaEntrega.value,
  mensaje: mensajeEntrega.value,
  video: videoEntrega.value,
  imagenes,
  creado: Date.now()
});
    estadoEntrega.textContent = "✅ Entrega publicada.";

    marcaEntrega.value = "";
    modeloEntrega.value = "";
    clienteEntrega.value = "";
    fechaEntrega.value = "";
    mensajeEntrega.value = "";
    videoEntrega.value = "";
    imagenesEntrega.value = "";
    await cargarEntregasAdmin();

  } catch (error) {

    console.error(error);
    estadoEntrega.textContent = "❌ Error al publicar.";

  }

}

if (publicarEntrega) {
  publicarEntrega.addEventListener("click", publicarEntregaFuncion);
}
