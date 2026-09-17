document.addEventListener("DOMContentLoaded", function () {
    const inputFoto = document.getElementById("inputFoto");
    const botonCambiarFoto = document.getElementById("botonCambiarFoto");
    const fotoConfiguracion = document.getElementById("fotoConfiguracion");
    const nombreConfiguracion = document.getElementById("nombreConfiguracion");
    const botonGuardarConfiguracion = document.getElementById("botonGuardarConfiguracion");
    const mensajeConfiguracion = document.getElementById("mensajeConfiguracion");
    
    const fotoCabeza = document.getElementById("fotoCabeza");
    const fotoCuerpo = document.getElementById("fotoCuerpo");

    // 1. Cargar datos guardados previamente
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    const fotoGuardada = localStorage.getItem("fotoPerfil");

    if (nombreGuardado && nombreConfiguracion) {
        nombreConfiguracion.value = nombreGuardado;
    }

    function aplicarFotoDePerfil(urlImagen) {
        if (!fotoConfiguracion) return;
        fotoConfiguracion.style.backgroundImage = `url("${urlImagen}")`;
        fotoConfiguracion.style.backgroundSize = "cover";
        fotoConfiguracion.style.backgroundPosition = "center";
        
        // Ocultar silueta por defecto
        if (fotoCabeza) fotoCabeza.style.display = "none";
        if (fotoCuerpo) fotoCuerpo.style.display = "none";
    }

    if (fotoGuardada) {
        aplicarFotoDePerfil(fotoGuardada);
    }

    // 2. Eventos para abrir el selector de fotos
    function abrirSelector() {
        if (inputFoto) inputFoto.click();
    }

    if (botonCambiarFoto) botonCambiarFoto.addEventListener("click", abrirSelector);
    if (fotoConfiguracion) fotoConfiguracion.addEventListener("click", abrirSelector);

    // 3. Procesar y guardar la foto al elegirla
    if (inputFoto) {
        inputFoto.addEventListener("change", function () {
            if (!inputFoto.files || inputFoto.files.length === 0) return;
            
            const archivo = inputFoto.files[0]; // Corregido: accedemos al primer archivo

            // Validar tamaño máximo (~1.5 MB para no romper el LocalStorage)
            if (archivo.size > 1.5 * 1024 * 1024) {
                if (mensajeConfiguracion) {
                    mensajeConfiguracion.textContent = "La imagen es muy pesada. Elegí otra más chica.";
                    mensajeConfiguracion.style.color = "red";
                }
                return;
            }

            const lector = new FileReader();
            lector.onload = function (evento) {
                const fotoBase64 = evento.target.result;

                try {
                    localStorage.setItem("fotoPerfil", fotoBase64);
                    aplicarFotoDePerfil(fotoBase64);
                    if (mensajeConfiguracion) {
                        mensajeConfiguracion.textContent = "Foto de perfil actualizada.";
                        mensajeConfiguracion.style.color = "green";
                    }
                } catch (error) {
                    if (mensajeConfiguracion) {
                        mensajeConfiguracion.textContent = "Error de espacio. Intentá con otra imagen.";
                        mensajeConfiguracion.style.color = "red";
                    }
                }
            };
            lector.readAsDataURL(archivo);
        });
    }

    // 4. Guardar cambios del formulario (Nombre)
    if (botonGuardarConfiguracion) {
        botonGuardarConfiguracion.addEventListener("click", function () {
            const nuevoNombre = nombreConfiguracion ? nombreConfiguracion.value.trim() : "";

            if (nuevoNombre === "") {
                if (mensajeConfiguracion) {
                    mensajeConfiguracion.textContent = "Por favor, ingresá un nombre.";
                    mensajeConfiguracion.style.color = "red";
                }
                return;
            }

            localStorage.setItem("nombreUsuario", nuevoNombre);

            if (mensajeConfiguracion) {
                mensajeConfiguracion.textContent = "¡Cambios guardados con éxito!";
                mensajeConfiguracion.style.color = "green";
            }
        });
    }
});