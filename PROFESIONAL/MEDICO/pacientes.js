// ==========================================
// ELEMENTOS
// ==========================================

const pacientesVinculados =
    document.getElementById(
        "pacientesVinculados"
    );


// ==========================================
// OBTENER PACIENTES
// ==========================================

let pacientes =
    JSON.parse(
        localStorage.getItem(
            "pacientesLinkeados"
        )
    ) || [];


// ==========================================
// MOSTRAR PACIENTES
// ==========================================

function mostrarPacientes() {

    pacientesVinculados.innerHTML = "";


    if (pacientes.length === 0) {

        pacientesVinculados.innerHTML = `
            <p>
                No hay pacientes vinculados todavía.
            </p>
        `;

        return;

    }


    pacientes.forEach(
        function (paciente, indice) {

            const tarjeta =
                document.createElement("article");


            tarjeta.className =
                "tarjeta-empresa";


            tarjeta.innerHTML = `

                <h3>
                    ${paciente.nombre || "Paciente"}
                </h3>

                <p>
                    Paciente vinculado
                </p>

                <button
                    type="button"
                    onclick="verPaciente(${indice})"
                >
                    Ver información
                </button>

            `;


            pacientesVinculados.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================
// VER PACIENTE
// ==========================================

function verPaciente(indice) {

    localStorage.setItem(
        "pacienteSeleccionado",
        JSON.stringify(
            pacientes[indice]
        )
    );


    alert(
        "Paciente seleccionado."
    );

}


// ==========================================
// INICIAR
// ==========================================

mostrarPacientes();