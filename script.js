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
subirLogo.addEventListener("click", async (e) => {
e.preventDefault();

if (!logo.files.length) {
estadoLogo.textContent = "⚠️ Seleccioná un logo.";
return;
}

estadoLogo.textContent = "📤 Subiendo logo...";

try {
const urlLogo = await subirImagenCloudinary(logo.files[0]);

await setDoc(doc(db, "config", "logo"), {    
    imagen: urlLogo,    
    creado: Date.now()    
});    

estadoLogo.textContent = "✅ Logo subido correctamente.";    

document.getElementById("formLogo").reset();    

previewLogo.src = urlLogo;

} catch (error) {
console.error(error);

estadoLogo.textContent = "❌ Error al subir el logo.";

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

if (cerrarSesion) {
cerrarSesion.addEventListener("click", async () => {
await signOut(auth);
window.location.href = "login.html";
});
async function cargarContenido() {

try {

const documento = await getDoc(doc(db, "config", "web"));    

if (!documento.exists()) return;    

const datos = documento.data();    

tituloWeb.value = datos.titulo || "";

subtituloWeb.value = datos.subtitulo || "";
whatsappWeb.value = datos.whatsapp || "";
horarioWeb.value = datos.horario || "";
} catch (error) {

console.error(error);

}

}
}
guardarContenido.addEventListener("click", async (e) => {
e.preventDefault();

estadoContenido.textContent = "💾 Guardando...";

try {

await setDoc(doc(db, "config", "web"), {    
    titulo: tituloWeb.value,

subtitulo: subtituloWeb.value,
whatsapp: whatsappWeb.value,
horario: horarioWeb.value
});

estadoContenido.textContent = "✅ Contenido guardado correctamente.";

} catch (error) {
alert(error.message);

console.error(error);
estadoContenido.textContent = "❌ Error al guardar.";
}
});
cargarContenido();
