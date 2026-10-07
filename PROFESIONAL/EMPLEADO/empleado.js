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
    // ==========================

    const preferenciasGuardadas =
        localStorage.getItem("preferenciasTrabajo");


    if (preferenciasGuardadas) {

        const preferencias =
            JSON.parse(preferenciasGuardadas);


        const comunicacion =
            document.getElementById("comunicacion");

        const ambiente =
            document.getElementById("ambiente");

        const organizacion =
            document.getElementById("organizacion");

        const adaptaciones =
            document.getElementById("adaptaciones");

        const otrasPreferencias =
            document.getElementById("otrasPreferencias");


        if (
            comunicacion &&
            preferencias.comunicacion
        ) {

            comunicacion.textContent =
                preferencias.comunicacion;

        }


        if (
            ambiente &&
            preferencias.ambiente
        ) {

            ambiente.textContent =
                preferencias.ambiente;

        }


        if (
            organizacion &&
            preferencias.organizacion
        ) {

            organizacion.textContent =
                preferencias.organizacion;

        }


        if (
            adaptaciones &&
            preferencias.adaptaciones
        ) {

            adaptaciones.textContent =
                preferencias.adaptaciones;

        }


        if (
            otrasPreferencias &&
            preferencias.otrasPreferencias
        ) {

            otrasPreferencias.textContent =
                preferencias.otrasPreferencias;

        }

    }

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