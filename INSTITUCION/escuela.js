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
