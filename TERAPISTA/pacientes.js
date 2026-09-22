const botonNuevoPaciente =
    document.getElementById("botonNuevoPaciente");

const ventanaLinkear =
    document.getElementById("ventanaLinkear");

const cerrarLinkear =
    document.getElementById("cerrarLinkear");

const botonEnviarSolicitud =
    document.getElementById("botonEnviarSolicitud");

const emailPaciente =
    document.getElementById("emailPaciente");

const mensajeSolicitud =
    document.getElementById("mensajeSolicitud");

const listaPacientes =
    document.getElementById("listaPacientes");


let pacientes =
    JSON.parse(
        localStorage.getItem("pacientesTerapista")
    ) || [];


function mostrarPacientes() {

    listaPacientes.innerHTML = "";


    if (pacientes.length === 0) {

        const mensaje = document.createElement("p");

        mensaje.textContent =
            "Todavía no tenés pacientes vinculados.";

        listaPacientes.appendChild(mensaje);

        return;
    }


    pacientes.forEach(function(paciente) {

        const tarjeta =
            document.createElement("div");

        tarjeta.classList.add("tarjeta-paciente");


        const nombre =
            document.createElement("h2");

        nombre.textContent =
            paciente.nombre || paciente.email;


        const email =
            document.createElement("p");

        email.textContent =
            paciente.email;


        const botonObjetivos =
            document.createElement("button");

        botonObjetivos.type = "button";

        botonObjetivos.classList.add(
            "boton-objetivos"
        );

        botonObjetivos.textContent =
            "Objetivos";


        botonObjetivos.addEventListener(
            "click",
            function() {

                localStorage.setItem(
                    "pacienteSeleccionadoTerapista",
                    JSON.stringify(paciente)
                );

                window.location.href =
                    "objetivos.html";

            }
        );


        tarjeta.appendChild(nombre);

        tarjeta.appendChild(email);

        tarjeta.appendChild(botonObjetivos);


        listaPacientes.appendChild(tarjeta);

    });

}


botonNuevoPaciente.addEventListener(
    "click",
    function() {

        ventanaLinkear.classList.add("mostrar");

        emailPaciente.value = "";

        mensajeSolicitud.textContent = "";

    }
);


cerrarLinkear.addEventListener(
    "click",
    function() {

        ventanaLinkear.classList.remove("mostrar");

    }
);


ventanaLinkear.addEventListener(
    "click",
    function(evento) {

        if (evento.target === ventanaLinkear) {

            ventanaLinkear.classList.remove("mostrar");

        }

    }
);


botonEnviarSolicitud.addEventListener(
    "click",
    function() {

        const email =
            emailPaciente.value.trim();


        if (email === "") {

            mensajeSolicitud.textContent =
                "Ingresá el correo del paciente.";

            return;

        }


        const solicitudes =
            JSON.parse(
                localStorage.getItem(
                    "solicitudesTerapista"
                )
            ) || [];


        const solicitud = {

            id: Date.now(),

            email: email,

            estado: "pendiente"

        };


        solicitudes.push(solicitud);


        localStorage.setItem(
            "solicitudesTerapista",
            JSON.stringify(solicitudes)
        );


        mensajeSolicitud.textContent =
            "Solicitud enviada. El paciente debe aceptar la vinculación.";


        emailPaciente.value = "";

    }
);


mostrarPacientes();