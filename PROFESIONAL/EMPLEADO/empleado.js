document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // SALUDO
    // ==========================

    const saludoEmpleado =
        document.getElementById("saludoEmpleado");

    const nombreUsuario =
        localStorage.getItem("nombreUsuario");

    if (nombreUsuario && saludoEmpleado) {

        saludoEmpleado.textContent =
            `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

    }


    // ==========================
    // VINCULAR INSTITUCIÓN
    // ==========================

    const botonVincular =
        document.getElementById("botonVincular");

    const codigoInstitucion =
        document.getElementById("codigoInstitucion");

    const institucionVinculada =
        document.getElementById("institucionVinculada");


    if (botonVincular) {

        botonVincular.addEventListener("click", () => {

            const codigo =
                codigoInstitucion.value.trim();


            if (codigo === "") {

                mostrarToast(
                    "Ingresá el código de la institución"
                );

                return;
            }


            localStorage.setItem(
                "codigoInstitucion",
                codigo
            );


            institucionVinculada.textContent =
                `Institución vinculada: ${codigo}`;


            mostrarToast(
                "✓ Institución vinculada correctamente"
            );

        });

    }


    // ==========================
    // MOSTRAR INSTITUCIÓN GUARDADA
    // ==========================

    const codigoGuardado =
        localStorage.getItem("codigoInstitucion");


    if (codigoGuardado && institucionVinculada) {

        institucionVinculada.textContent =
            `Institución vinculada: ${codigoGuardado}`;

    }


    // ==========================
    // MOSTRAR PREFERENCIAS
    // GET /api/preferencias-trabajo/:idUsuario
    // ==========================

    const textos = {
        tranquilo: "Ambiente tranquilo",
        dinamico: "Ambiente dinámico",
        indiferente: "Me es indiferente",
        solo: "Prefiero trabajar solo/a",
        equipo: "Prefiero trabajar en equipo",
        ambos: "Me adapto a ambas",
        escrita: "Comunicación escrita",
        oral: "Comunicación oral",
        ambas: "Comunicación escrita y oral"
    };

    function mostrarPreferencias(preferencias) {
        const poner = (id, valor) => {
            const elemento = document.getElementById(id);

            if (elemento && valor) {
                elemento.textContent = valor;
            }
        };

        poner("comunicacion", textos[preferencias.comunicacion] || preferencias.formaComunicacion);
        poner("ambiente", textos[preferencias.ambienteTrabajoOriginal] || preferencias.ambienteTrabajo);
        poner("organizacion", textos[preferencias.trabajoEquipo] || preferencias.formaTrabajo);
        poner("adaptaciones", preferencias.adaptaciones);
        poner("otrasPreferencias", preferencias.otrasPreferencias);
    }

    async function cargarPreferencias() {
        const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

        if (idUsuario) {
            try {
                const respuesta = await fetch(`http://localhost:3000/api/preferencias-trabajo/${idUsuario}`);

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    mostrarPreferencias(datos);
                    localStorage.setItem("preferenciasTrabajo", JSON.stringify(datos));
                    return;
                }
            } catch (error) {
                console.error("No se pudieron cargar las preferencias del servidor:", error);
            }
        }

        try {
            const guardadas = JSON.parse(localStorage.getItem("preferenciasTrabajo"));
            if (guardadas) mostrarPreferencias(guardadas);
        } catch (error) {
            // sin datos guardados
        }
    }

    cargarPreferencias();

});


// ==========================
// TOAST
// ==========================

function mostrarToast(mensaje) {

    const toast =
        document.createElement("div");

    toast.className =
        "toast-neuropassport";

    toast.textContent =
        mensaje;

    document.body.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3000);

}