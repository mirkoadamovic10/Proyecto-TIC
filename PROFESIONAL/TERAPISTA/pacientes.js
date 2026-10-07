const codigoPaciente =
    document.getElementById("codigoPaciente");

const botonLinkearPaciente =
    document.getElementById("botonLinkearPaciente");

const pacientesVinculados =
    document.getElementById("pacientesVinculados");


let pacientes = JSON.parse(
    localStorage.getItem("pacientesTerapista")
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


    pacientes.forEach(function (paciente, indice) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-paciente";


        const cantidadObjetivos =
            paciente.objetivos
                ? paciente.objetivos.length
                : 0;


        tarjeta.innerHTML = `

            <h3>
                ${paciente.nombre}
            </h3>

            <p>
                Paciente vinculado
            </p>

            <p>
                Objetivos: ${cantidadObjetivos}
            </p>

            <button
                type="button"
                onclick="verPaciente(${indice})"
            >
                Ver paciente
            </button>

        `;


        pacientesVinculados.appendChild(tarjeta);

    });

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

            id: Date.now(),

            nombre:
                "Paciente vinculado",

            codigo:
                codigo,

            objetivos: []

        };


        pacientes.push(paciente);


        localStorage.setItem(
            "pacientesTerapista",
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
        "pacienteTerapistaSeleccionado",
        JSON.stringify(pacientes[indice])
    );


    window.location.href =
        "paciente.html";
}


mostrarPacientes();