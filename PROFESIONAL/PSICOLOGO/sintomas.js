// ==========================================
// ELEMENTOS
// ==========================================

const nombrePaciente =
    document.getElementById(
        "nombrePaciente"
    );

const fechaSintoma =
    document.getElementById(
        "fechaSintoma"
    );

const estadoEmocional =
    document.getElementById(
        "estadoEmocional"
    );

const sintomas =
    document.getElementById(
        "sintomas"
    );

const observaciones =
    document.getElementById(
        "observaciones"
    );

const botonGuardarSintoma =
    document.getElementById(
        "botonGuardarSintoma"
    );

const listaSintomas =
    document.getElementById(
        "listaSintomas"
    );


// ==========================================
// CARGAR REGISTROS
// ==========================================

let registros =
    JSON.parse(
        localStorage.getItem(
            "registrosSintomas"
        )
    ) || [];


// ==========================================
// MOSTRAR REGISTROS
// ==========================================

function mostrarRegistros() {

    listaSintomas.innerHTML = "";


    // --------------------------------------
    // SI NO HAY REGISTROS
    // --------------------------------------

    if (registros.length === 0) {

        listaSintomas.innerHTML = `
            <p>
                Todavía no hay registros.
            </p>
        `;

        return;

    }


    // --------------------------------------
    // MOSTRAR CADA REGISTRO
    // --------------------------------------

    registros.forEach(
        function (registro) {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "tarjeta-empresa";


            tarjeta.innerHTML = `

                <h3>
                    ${registro.paciente}
                </h3>

                <p>
                    <strong>Fecha:</strong>
                    ${registro.fecha}
                </p>

                <p>
                    <strong>Estado emocional:</strong>
                    ${registro.estado}
                </p>

                <p>
                    <strong>Síntomas:</strong>
                    ${registro.sintomas}
                </p>

                <p>
                    <strong>Observaciones:</strong>
                    ${registro.observaciones}
                </p>

            `;


            listaSintomas.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================
// GUARDAR REGISTRO
// ==========================================

botonGuardarSintoma.addEventListener(
    "click",
    function () {


        // ----------------------------------
        // COMPROBAR DATOS
        // ----------------------------------

        if (
            nombrePaciente.value.trim() === "" ||
            fechaSintoma.value === "" ||
            estadoEmocional.value === ""
        ) {

            alert(
                "Completá el paciente, la fecha y el estado emocional."
            );

            return;

        }


        // ----------------------------------
        // CREAR REGISTRO
        // ----------------------------------

        const nuevoRegistro = {

            paciente:
                nombrePaciente.value.trim(),

            fecha:
                fechaSintoma.value,

            estado:
                estadoEmocional.value,

            sintomas:
                sintomas.value.trim(),

            observaciones:
                observaciones.value.trim()

        };


        // ----------------------------------
        // AGREGAR REGISTRO
        // ----------------------------------

        registros.push(
            nuevoRegistro
        );


        // ----------------------------------
        // GUARDAR EN LOCALSTORAGE
        // ----------------------------------

        localStorage.setItem(
            "registrosSintomas",
            JSON.stringify(registros)
        );


        // ----------------------------------
        // LIMPIAR FORMULARIO
        // ----------------------------------

        nombrePaciente.value = "";

        fechaSintoma.value = "";

        estadoEmocional.value = "";

        sintomas.value = "";

        observaciones.value = "";


        // ----------------------------------
        // ACTUALIZAR LISTA
        // ----------------------------------

        mostrarRegistros();


        // ----------------------------------
        // AVISAR QUE SE GUARDÓ
        // ----------------------------------

        alert(
            "Registro guardado correctamente."
        );

    }
);


// ==========================================
// MOSTRAR AL ABRIR LA PÁGINA
// ==========================================

mostrarRegistros();