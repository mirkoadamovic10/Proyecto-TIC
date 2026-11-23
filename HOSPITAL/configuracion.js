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
