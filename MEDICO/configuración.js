document.addEventListener("DOMContentLoaded", function () {
    const inputFoto = document.getElementById("inputFoto");
    const botonCambiarFoto = document.getElementById("botonCambiarFoto");
    const fotoConfiguracion = document.getElementById("fotoConfiguracion");
    const nombreConfiguracion = document.getElementById("nombreConfiguracion");
    const botonGuardarConfiguracion = document.getElementById("botonGuardarConfiguracion");
    const mensajeConfiguracion = document.getElementById("mensajeConfiguracion");

    // Cargar datos previos
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    const fotoGuardada = localStorage.getItem("fotoPerfil");

    if (nombreGuardado && nombreConfiguracion) {
        nombreConfiguracion.value = nombreGuardado;
    }

    if (fotoGuardada && fotoConfiguracion) {
        fotoConfiguracion.style.backgroundImage = `url("${fotoGuardada}")`;
        fotoConfiguracion.style.backgroundSize = "cover";
        fotoConfiguracion.style.backgroundPosition = "center";
        fotoConfiguracion.classList.add("tiene-foto");
    }

    // Abrir selector de archivos al hacer clic en el botón o en la foto
    function abrirSelector() {
        if (inputFoto) inputFoto.click();
    }

    if (botonCambiarFoto) {
        botonCambiarFoto.addEventListener("click", abrirSelector);
    }

    if (fotoConfiguracion) {
        fotoConfiguracion.addEventListener("click", abrirSelector);
    }

    // Procesar cambio de foto
    if (inputFoto) {
        inputFoto.addEventListener("change", function () {
            const archivo = inputFoto.files[0];

            if (!archivo) return;

            const lector = new FileReader();

            lector.onload = function (evento) {
                const foto = evento.target.result;

                if (fotoConfiguracion) {
                    fotoConfiguracion.style.backgroundImage = `url("${foto}")`;
                    fotoConfiguracion.style.backgroundSize = "cover";
                    fotoConfiguracion.style.backgroundPosition = "center";
                    fotoConfiguracion.classList.add("tiene-foto");
                }

                try {
                    localStorage.setItem("fotoPerfil", foto);
                    if (mensajeConfiguracion) {
                        mensajeConfiguracion.textContent = "Foto de perfil actualizada.";
                    }
                } catch (error) {
                    if (mensajeConfiguracion) {
                        mensajeConfiguracion.textContent = "La imagen es muy grande. Intentá con una más pequeña.";
                    }
                }
            };

            lector.readAsDataURL(archivo);
        });
    }

    // Guardar nombre de usuario
    if (botonGuardarConfiguracion) {
        botonGuardarConfiguracion.addEventListener("click", function () {
            const nuevoNombre = nombreConfiguracion ? nombreConfiguracion.value.trim() : "";

            if (nuevoNombre === "") {
                if (mensajeConfiguracion) mensajeConfiguracion.textContent = "Ingresá tu nombre.";
                return;
            }

            localStorage.setItem("nombreUsuario", nuevoNombre);

            if (mensajeConfiguracion) {
                mensajeConfiguracion.textContent = "Cambios guardados correctamente.";
            }
        });
    }
});