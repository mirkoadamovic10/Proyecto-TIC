const botonAgregarPaciente =
    document.getElementById("botonAgregarPaciente");

const ventanaPaciente =
    document.getElementById("ventanaPaciente");

const cerrarPaciente =
    document.getElementById("cerrarPaciente");

const guardarPaciente =
    document.getElementById("guardarPaciente");

const emailPaciente =
    document.getElementById("emailPaciente");

const mensajePaciente =
    document.getElementById("mensajePaciente");

const listaPacientes =
    document.getElementById("listaPacientes");


let pacientes =
    JSON.parse(
        localStorage.getItem("pacientesHospital")
    ) || [];


function mostrarPacientes() {

    listaPacientes.innerHTML = "";


    if (pacientes.length === 0) {

        const mensaje =
            document.createElement("p");

        mensaje.textContent =
            "Todavía no hay pacientes vinculados.";

        listaPacientes.appendChild(mensaje);

        return;

    }


    pacientes.forEach(function(paciente) {

        const tarjeta =
            document.createElement("article");

        tarjeta.classList.add(
            "tarjeta-hospital"
        );


        const nombre =
            document.createElement("h2");

        nombre.textContent =
            paciente.nombre || "Paciente";


        const email =
            document.createElement("p");

        email.textContent =
            paciente.email;


        const botonPasaporte =
            document.createElement("button");

        botonPasaporte.classList.add(
            "boton-ver-hospital"
        );

        botonPasaporte.textContent =
            "Ver pasaporte";


        botonPasaporte.addEventListener(
            "click",
            function() {

                localStorage.setItem(
                    "pacienteSeleccionadoHospital",
                    JSON.stringify(paciente)
                );

                window.location.href =
                    "pasaporte-paciente.html";

            }
        );


        tarjeta.appendChild(nombre);

        tarjeta.appendChild(email);

        tarjeta.appendChild(botonPasaporte);


        listaPacientes.appendChild(tarjeta);

    });

}


botonAgregarPaciente.addEventListener(
    "click",
    function() {

        emailPaciente.value = "";

        mensajePaciente.textContent = "";

        ventanaPaciente.classList.add("mostrar");

    }
);


cerrarPaciente.addEventListener(
    "click",
    function() {

        ventanaPaciente.classList.remove("mostrar");

    }
);


ventanaPaciente.addEventListener(
    "click",
    function(evento) {

        if (evento.target === ventanaPaciente) {

            ventanaPaciente.classList.remove("mostrar");

        }

    }
);


guardarPaciente.addEventListener(
    "click",
    function() {

        const email =
            emailPaciente.value.trim();


        if (email === "") {

            mensajePaciente.textContent =
                "Ingresá el correo del paciente.";

            return;

        }


        const existe =
            pacientes.some(
                function(paciente) {

                    return paciente.email === email;

                }
            );


        if (existe) {

            mensajePaciente.textContent =
                "Este paciente ya está vinculado.";

            return;

        }


        pacientes.push({

            id: Date.now(),

            email: email,

            nombre: "Paciente"

        });


        localStorage.setItem(
            "pacientesHospital",
            JSON.stringify(pacientes)
        );


        mensajePaciente.textContent =
            "Paciente vinculado correctamente.";

        emailPaciente.value = "";

        mostrarPacientes();

    }
);


mostrarPacientes();