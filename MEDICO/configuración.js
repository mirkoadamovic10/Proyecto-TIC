const inputFoto = document.getElementById("inputFoto");
const botonCambiarFoto = document.getElementById("botonCambiarFoto");
const fotoConfiguracion = document.getElementById("fotoConfiguracion");
const nombreConfiguracion = document.getElementById("nombreConfiguracion");
const botonGuardarConfiguracion = document.getElementById("botonGuardarConfiguracion");
const mensajeConfiguracion = document.getElementById("mensajeConfiguracion");

const nombreGuardado = localStorage.getItem("nombreUsuario");
const fotoGuardada = localStorage.getItem("fotoPerfil");

if (nombreGuardado) {
    nombreConfiguracion.value = nombreGuardado;
}

if (fotoGuardada) {
    fotoConfiguracion.style.backgroundImage = `url("${fotoGuardada}")`;
    fotoConfiguracion.classList.add("tiene-foto");
}

botonCambiarFoto.addEventListener("click", function() {
    inputFoto.click();
});

inputFoto.addEventListener("change", function() {

    const archivo = inputFoto.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(evento) {

        const foto = evento.target.result;

        fotoConfiguracion.style.backgroundImage = `url("${foto}")`;
        fotoConfiguracion.classList.add("tiene-foto");

        localStorage.setItem("fotoPerfil", foto);

        mensajeConfiguracion.textContent = "Foto de perfil actualizada.";
    };

    lector.readAsDataURL(archivo);
});

botonGuardarConfiguracion.addEventListener("click", function() {

    const nuevoNombre = nombreConfiguracion.value.trim();

    if (nuevoNombre === "") {
        mensajeConfiguracion.textContent = "Ingresá tu nombre.";
        return;
    }

    localStorage.setItem("nombreUsuario", nuevoNombre);

    mensajeConfiguracion.textContent = "Cambios guardados correctamente.";
});