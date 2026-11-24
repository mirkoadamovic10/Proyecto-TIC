const nombreUsuario =
    localStorage.getItem("nombreUsuario");


const saludoInstitucion =
    document.getElementById("saludoInstitucion");


if (nombreUsuario && saludoInstitucion) {

    saludoInstitucion.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}

// ==========================================
// INSTITUCIÓN DEL USUARIO: POST /api/instituciones
// Se crea una sola vez por usuario y se guarda su idInstitucion
// ==========================================

async function obtenerIdInstitucion() {
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

    if (!idUsuario) {
        return null;
    }

    const clave = "idInstitucion_" + idUsuario;
    const guardado = Number(localStorage.getItem(clave));

    if (guardado) {
        return guardado;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/instituciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                nombre: localStorage.getItem("nombreUsuario") || "Institución",
                tipo: localStorage.getItem("tipoInstitucion") || "escuela"
            })
        });

        if (!respuesta.ok) {
            console.error("No se pudo crear la institución:", respuesta.status);
            return null;
        }

        const institucion = await respuesta.json();
        localStorage.setItem(clave, institucion.idInstitucion);
        return institucion.idInstitucion;
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return null;
    }
}


// Crea (o recupera) la institución y muestra su código para vincular estudiantes y empleados
obtenerIdInstitucion().then(function (idInstitucion) {
    const saludo = document.getElementById("saludoInstitucion");

    const titulo = saludo || document.querySelector("main h1, main h2");

    if (!idInstitucion || !titulo) return;

    const codigo = document.createElement("p");
    codigo.className = "codigo-institucion";
    codigo.textContent = "Código de la institución: " + idInstitucion;
    codigo.style.textAlign = "center";
    codigo.style.margin = "6px 0 0";
    titulo.insertAdjacentElement("afterend", codigo);
});


// ==========================================
// FOTO DE PERFIL: se muestra en el botón de perfil
// (es la que se elige en Configuración)
// ==========================================
(function () {
    function mostrarFotoPerfil() {
        const foto = localStorage.getItem("fotoPerfil");
        const botonConFoto = document.getElementById("perfilInstitucion");

        if (!foto || !botonConFoto) {
            return;
        }

        // "important" para ganarle al color de fondo que tiene el botón en el CSS
        botonConFoto.style.setProperty("background-image", 'url("' + foto + '")', "important");
        botonConFoto.style.setProperty("background-size", "cover", "important");
        botonConFoto.style.setProperty("background-position", "center", "important");
        botonConFoto.style.setProperty("background-repeat", "no-repeat", "important");
        botonConFoto.classList.add("con-foto-perfil");

        // Se oculta el muñequito que está adentro del botón
        Array.from(botonConFoto.children).forEach(function (hijo) {
            hijo.style.setProperty("display", "none", "important");
        });
    }

    // Se aplica cuando la página terminó de cargar, después del resto del código
    if (document.readyState === "complete") {
        mostrarFotoPerfil();
    } else {
        window.addEventListener("load", mostrarFotoPerfil);
    }
})();
