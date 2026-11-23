// ==========================================
// PREFERENCIAS DE TRABAJO
// POST /api/preferencias-trabajo · GET /api/preferencias-trabajo/:idUsuario
// ==========================================

const API_PREFERENCIAS = "http://localhost:3000/api/preferencias-trabajo";

const guardarPreferencias =
    document.getElementById("guardarPreferencias");

const idUsuario =
    Number(localStorage.getItem("idUsuario")) || null;

// El backend solo acepta estos valores exactos
const valoresBackend = {
    ambienteTrabajo: { tranquilo: "Tranquilo", dinamico: "Dinámico" },
    trabajoEquipo: { solo: "Individual", equipo: "En equipo", ambos: "Mixto" },
    comunicacion: { escrita: "Escrita", oral: "Verbal" },
    horario: { manana: "Mañana", tarde: "Tarde", noche: "Noche", flexible: "Horario flexible" }
};

function valorDe(id) {
    const elemento = document.getElementById(id);
    return elemento ? elemento.value : "";
}

// Marca una opción en los desplegables personalizados de la pantalla
function elegirOpcion(id, valor) {
    if (!valor) return;

    const opcion = document.querySelector(
        `.desplegable-personalizado[data-id="${id}"] .opcion-desplegable[data-value="${valor}"]`
    );

    if (opcion) {
        opcion.click();
    }
}

function completarFormulario(preferencias) {
    elegirOpcion("ambienteTrabajo", preferencias.ambienteTrabajoOriginal);
    elegirOpcion("trabajoEquipo", preferencias.trabajoEquipo);
    elegirOpcion("comunicacion", preferencias.comunicacion);
    elegirOpcion("horario", preferencias.horario);

    const adaptaciones = document.getElementById("adaptaciones");
    const otras = document.getElementById("otrasPreferencias");

    if (adaptaciones && preferencias.adaptaciones) adaptaciones.value = preferencias.adaptaciones;
    if (otras && preferencias.otrasPreferencias) otras.value = preferencias.otrasPreferencias;
}

async function cargarPreferencias() {
    if (idUsuario) {
        try {
            const respuesta = await fetch(`${API_PREFERENCIAS}/${idUsuario}`);

            if (respuesta.ok) {
                const datos = await respuesta.json();
                completarFormulario(datos);
                localStorage.setItem("preferenciasTrabajo", JSON.stringify(datos));
                return;
            }
        } catch (error) {
            console.error("No se pudieron cargar las preferencias del servidor:", error);
        }
    }

    try {
        const guardadas = JSON.parse(localStorage.getItem("preferenciasTrabajo"));
        if (guardadas) completarFormulario(guardadas);
    } catch (error) {
        // sin datos guardados
    }
}

guardarPreferencias.addEventListener("click", async () => {

    const ambiente = valorDe("ambienteTrabajo");
    const equipo = valorDe("trabajoEquipo");
    const comunicacion = valorDe("comunicacion");
    const horario = valorDe("horario");

    const preferencias = {
        idUsuario: idUsuario,

        // Campos del backend
        ambienteTrabajo: valoresBackend.ambienteTrabajo[ambiente] || "",
        formaTrabajo: valoresBackend.trabajoEquipo[equipo] || "",
        formaComunicacion: valoresBackend.comunicacion[comunicacion] || "",
        preferenciaHorario: valoresBackend.horario[horario] || "",
        sensibilidad: valorDe("sensibilidad"),
        adaptaciones: valorDe("adaptaciones"),
        otrasPreferencias: valorDe("otrasPreferencias"),

        // Lo que se eligió en la pantalla (para volver a mostrarlo)
        ambienteTrabajoOriginal: ambiente,
        trabajoEquipo: equipo,
        comunicacion: comunicacion,
        horario: horario
    };

    localStorage.setItem(
        "preferenciasTrabajo",
        JSON.stringify(preferencias)
    );

    if (!idUsuario) {
        mostrarToast("✓ Preferencias guardadas en este navegador (no hay sesión iniciada)");
        return;
    }

    try {
        const respuesta = await fetch(API_PREFERENCIAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(preferencias)
        });

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            throw new Error(resultado.error || "No se pudieron guardar las preferencias.");
        }

        mostrarToast("✓ Preferencias de trabajo guardadas correctamente");
    } catch (error) {
        console.error(error);
        mostrarToast(error.message || "No se pudo conectar con el servidor");
    }
});


function mostrarToast(mensaje) {

    const toast = document.createElement("div");

    toast.className = "toast-neuropassport";

    toast.textContent = mensaje;

    document.body.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3000);
}

cargarPreferencias();
