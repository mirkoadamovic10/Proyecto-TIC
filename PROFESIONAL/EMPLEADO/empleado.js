// ==========================================
// NOMBRE DEL USUARIO
// ==========================================

const nombreUsuario =
    localStorage.getItem("nombreUsuario");


const saludoEmpleado =
    document.getElementById("saludoEmpleado");


if (
    nombreUsuario &&
    saludoEmpleado
) {

    saludoEmpleado.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}



// ==========================================
// ELEMENTOS
// ==========================================

const codigoInstitucion =
    document.getElementById("codigoInstitucion");


const botonVincular =
    document.getElementById("botonVincular");


const institucionVinculada =
    document.getElementById(
        "institucionVinculada"
    );


// ==========================================
// VINCULAR INSTITUCIÓN
// ==========================================

botonVincular.addEventListener(
    "click",
    function() {


        const codigo =
            codigoInstitucion.value.trim();


        if (codigo === "") {

            alert(
                "Ingresá el código de la institución."
            );

            return;

        }


        localStorage.setItem(
            "institucionEmpleado",
            codigo
        );


        institucionVinculada.textContent =
            `Institución vinculada: ${codigo}`;


        codigoInstitucion.value = "";

    }
);



// ==========================================
// MOSTRAR INSTITUCIÓN GUARDADA
// ==========================================

const institucionGuardada =
    localStorage.getItem(
        "institucionEmpleado"
    );


if (
    institucionGuardada &&
    institucionVinculada
) {

    institucionVinculada.textContent =
        `Institución vinculada: ${institucionGuardada}`;

}



// ==========================================
// PREFERENCIAS
// ==========================================

const botonPreferencias =
    document.getElementById(
        "botonPreferencias"
    );


botonPreferencias.addEventListener(
    "click",
    function() {

        const comunicacion =
            prompt(
                "¿Cómo preferís que se comuniquen con vos?"
            );


        const ambiente =
            prompt(
                "¿Qué tipo de ambiente de trabajo te resulta más cómodo?"
            );


        const organizacion =
            prompt(
                "¿Qué forma de organización te ayuda?"
            );


        const adaptaciones =
            prompt(
                "¿Necesitás alguna adaptación en tu trabajo?"
            );


        const otras =
            prompt(
                "¿Querés agregar alguna otra preferencia?"
            );


        const preferencias = {

            comunicacion:
                comunicacion || "No especificado",

            ambiente:
                ambiente || "No especificado",

            organizacion:
                organizacion || "No especificado",

            adaptaciones:
                adaptaciones || "No especificado",

            otras:
                otras || "No especificado"

        };


        localStorage.setItem(
            "preferenciasTrabajo",
            JSON.stringify(preferencias)
        );


        mostrarPreferencias();

    }
);



// ==========================================
// MOSTRAR PREFERENCIAS
// ==========================================

function mostrarPreferencias() {


    const guardadas =
        localStorage.getItem(
            "preferenciasTrabajo"
        );


    if (!guardadas) {
        return;
    }


    const preferencias =
        JSON.parse(guardadas);


    document.getElementById(
        "comunicacion"
    ).textContent =
        preferencias.comunicacion;


    document.getElementById(
        "ambiente"
    ).textContent =
        preferencias.ambiente;


    document.getElementById(
        "organizacion"
    ).textContent =
        preferencias.organizacion;


    document.getElementById(
        "adaptaciones"
    ).textContent =
        preferencias.adaptaciones;


    document.getElementById(
        "otrasPreferencias"
    ).textContent =
        preferencias.otras;

}


mostrarPreferencias();