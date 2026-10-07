const codigoPaciente =
    document.getElementById("codigoPaciente");

const botonLinkearPaciente =
    document.getElementById("botonLinkearPaciente");

const pacientesVinculados =
    document.getElementById("pacientesVinculados");


let pacientes =
    JSON.parse(
        localStorage.getItem("pacientesPsicologo")
    ) || [];


// ==========================================
// MOSTRAR PACIENTES
// ==========================================

function mostrarPacientes() {

    pacientesVinculados.innerHTML = "";


    if (pacientes.length === 0) {

        pacientesVinculados.innerHTML =
            "<p>No hay pacientes vinculados todavía.</p>";

        return;
    }


    pacientes.forEach(
        function (paciente, indice) {

            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "tarjeta-paciente";


            tarjeta.innerHTML = `

                <h3>
                    ${paciente.nombre}
                </h3>

                <p>
                    Paciente vinculado
                </p>

                <button
                    type="button"
                    onclick="verPaciente(${indice})"
                >
                    Ver paciente
                </button>

            `;


            pacientesVinculados.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================
// VINCULAR PACIENTE
// ==========================================

botonLinkearPaciente.addEventListener(
    "click",
    function () {

        const codigo =
            codigoPaciente.value.trim();


        if (codigo === "") {

            alert(
                "Ingresá el código del paciente."
            );

            return;
        }


        const paciente = {

            id:
                Date.now(),

            nombre:
                "Paciente vinculado",

            codigo:
                codigo

        };


        pacientes.push(
            paciente
        );


        localStorage.setItem(
            "pacientesPsicologo",
            JSON.stringify(pacientes)
        );


        codigoPaciente.value = "";


        mostrarPacientes();

    }
);


// ==========================================
// VER PACIENTE
// ==========================================

function verPaciente(indice) {

    localStorage.setItem(
        "pacientePsicologoSeleccionado",
        JSON.stringify(
            pacientes[indice]
        )
    );


    alert(
        "Paciente seleccionado correctamente."
    );

}


mostrarPacientes();