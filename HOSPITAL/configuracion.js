const inputFoto = document.getElementById("inputFoto");
const botonCambiarFoto = document.getElementById("botonCambiarFoto");
const fotoConfiguracion = document.getElementById("fotoConfiguracion");
const nombreConfiguracion = document.getElementById("nombreConfiguracion");
const botonGuardarConfiguracion = document.getElementById("botonGuardarConfiguracion");
const mensajeConfiguracion = document.getElementById("mensajeConfiguracion");

const nombreGuardado = localStorage.getItem("nombreUsuario");

// La foto se guarda por usuario ("fotoPerfil_4") para que no se pierda al cerrar sesión.
// "fotoPerfil" es la copia que leen las demás pantallas (el botón de perfil).
const claveFotoUsuario = "fotoPerfil_" + (localStorage.getItem("idUsuario") || "invitado");
const fotoGuardada = localStorage.getItem(claveFotoUsuario) || localStorage.getItem("fotoPerfil");

if (nombreGuardado) {
    nombreConfiguracion.value = nombreGuardado;
}

if (fotoGuardada) {
    fotoConfiguracion.style.backgroundImage = `url("${fotoGuardada}")`;
    fotoConfiguracion.classList.add("tiene-foto");
}

// Cargar los datos del usuario desde el backend
let idUsuario = localStorage.getItem("idUsuario");

if (idUsuario) {
    fetch(`http://localhost:3000/api/usuarios/${idUsuario}`)
        .then(function(respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los datos del usuario.");
            }

            return respuesta.json();
        })
        .then(function(usuario) {
            nombreConfiguracion.value = usuario.nombre;
            localStorage.setItem("nombreUsuario", usuario.nombre);
        })
        .catch(function(error) {
            mensajeConfiguracion.textContent = error.message;
        });
} else {
    mensajeConfiguracion.textContent = "No se encontró el usuario.";
}

botonCambiarFoto.addEventListener("click", function() {
    inputFoto.click();
});

inputFoto.addEventListener("change", function() {

    const archivo = inputFoto.files[0];

    if (!archivo) {
        return;
    }

    if (!archivo.type.startsWith("image/")) {
        mensajeConfiguracion.textContent = "Elegí un archivo de imagen.";
        return;
    }

    const lector = new FileReader();

    lector.onload = function(evento) {
        achicarFoto(evento.target.result, function(foto) {

            // Si la foto no entra en el navegador, se avisa en vez de fallar sin decir nada
            try {
                localStorage.setItem(claveFotoUsuario, foto);
                localStorage.setItem("fotoPerfil", foto);
            } catch (error) {
                mensajeConfiguracion.textContent = "No se pudo guardar la foto. Probá con otra imagen.";
                return;
            }

            fotoConfiguracion.style.backgroundImage = `url("${foto}")`;
            fotoConfiguracion.classList.add("tiene-foto");

            mensajeConfiguracion.textContent = "Foto de perfil actualizada.";
        });
    };

    lector.readAsDataURL(archivo);

    // Permite volver a elegir la misma foto
    inputFoto.value = "";
});

// Achica la foto a 300 px como máximo para que entre en localStorage
// (las fotos del celular pesan varios MB y el navegador no las deja guardar)
function achicarFoto(fotoOriginal, cuandoTermine) {
    const imagen = new Image();

    imagen.onload = function() {
        const LADO_MAXIMO = 300;
        const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));

        const lienzo = document.createElement("canvas");
        lienzo.width = Math.round(imagen.width * escala);
        lienzo.height = Math.round(imagen.height * escala);

        lienzo.getContext("2d").drawImage(imagen, 0, 0, lienzo.width, lienzo.height);

        cuandoTermine(lienzo.toDataURL("image/jpeg", 0.85));
    };

    imagen.onerror = function() {
        mensajeConfiguracion.textContent = "No se pudo leer la imagen. Probá con otra.";
    };

    imagen.src = fotoOriginal;
}

// Guardar los cambios del usuario en el backend
botonGuardarConfiguracion.addEventListener("click", function() {

    const nuevoNombre = nombreConfiguracion.value.trim();

    if (nuevoNombre === "") {
        mensajeConfiguracion.textContent = "Ingresá tu nombre.";
        return;
    }

    if (!idUsuario) {
        mensajeConfiguracion.textContent = "No se encontró el usuario.";
        return;
    }

    fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nuevoNombre
        })
    })
        .then(function(respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudieron guardar los cambios.");
            }

            return respuesta.json();
        })
        .then(function(datos) {
            localStorage.setItem("nombreUsuario", nuevoNombre);
            mensajeConfiguracion.textContent = "Cambios guardados correctamente.";
        })
        .catch(function(error) {
            mensajeConfiguracion.textContent = error.message;
        });
});


// ==========================================
// VOLVER: a la pantalla anterior, o al inicio si se entró directo
// ==========================================
document.querySelectorAll("[data-volver]").forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();

        if (document.referrer && window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "hospital.html";
        }
    });
});
