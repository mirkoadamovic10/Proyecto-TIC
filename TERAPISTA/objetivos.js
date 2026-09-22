const pacienteSeleccionado =
    JSON.parse(
        localStorage.getItem(
            "pacienteSeleccionadoTerapista"
        )
    );


const nombrePaciente =
    document.getElementById("nombrePaciente");

const listaObjetivos =
    document.getElementById("listaObjetivos");

const botonAgregarObjetivo =
    document.getElementById("botonAgregarObjetivo");

const ventanaObjetivo =
    document.getElementById("ventanaObjetivo");

const cerrarObjetivo =
    document.getElementById("cerrarObjetivo");

const guardarObjetivo =
    document.getElementById("guardarObjetivo");

const textoObjetivo =
    document.getElementById("textoObjetivo");


if (pacienteSeleccionado) {

    nombrePaciente.textContent =
        `Objetivos de ${pacienteSeleccionado.nombre || pacienteSeleccionado.email}`;

}


function obtenerClaveObjetivos() {

    if (!pacienteSeleccionado) {
        return "objetivosTerapista";
    }

    return (
        "objetivosTerapista_" +
        pacienteSeleccionado.email
    );

}


let objetivos =
    JSON.parse(
        localStorage.getItem(
            obtenerClaveObjetivos()
        )
    ) || [];


function mostrarObjetivos() {

    listaObjetivos.innerHTML = "";


    if (objetivos.length === 0) {

        const mensaje =
            document.createElement("p");

        mensaje.classList.add(
            "sin-objetivos"
        );

        mensaje.textContent =
            "Todavía no hay objetivos para este paciente.";

        listaObjetivos.appendChild(mensaje);

        return;

    }


    objetivos.forEach(
        function(objetivo, indice) {

            const tarjeta =
                document.createElement("div");

            tarjeta.classList.add(
                "tarjeta-objetivo"
            );


            const contenido =
                document.createElement("div");

            contenido.classList.add(
                "contenido-objetivo"
            );


            const titulo =
                document.createElement("h2");

            titulo.textContent =
                objetivo.texto;


            const estado =
                document.createElement("p");

            estado.textContent =
                objetivo.cumplido
                    ? "Objetivo cumplido"
                    : "Objetivo pendiente";


            estado.classList.add(
                objetivo.cumplido
                    ? "objetivo-cumplido"
                    : "objetivo-pendiente"
            );


            contenido.appendChild(titulo);

            contenido.appendChild(estado);


            const botonEstado =
                document.createElement("button");

            botonEstado.type = "button";

            botonEstado.classList.add(
                "boton-estado-objetivo"
            );


            botonEstado.textContent =
                objetivo.cumplido
                    ? "Marcar como pendiente"
                    : "Marcar como cumplido";


            botonEstado.addEventListener(
                "click",
                function() {

                    objetivos[indice].cumplido =
                        !objetivos[indice].cumplido;


                    guardarObjetivos();

                    mostrarObjetivos();

                }
            );


            tarjeta.appendChild(contenido);

            tarjeta.appendChild(botonEstado);


            listaObjetivos.appendChild(tarjeta);

        }
    );

}


function guardarObjetivos() {

    localStorage.setItem(
        obtenerClaveObjetivos(),
        JSON.stringify(objetivos)
    );

}


botonAgregarObjetivo.addEventListener(
    "click",
    function() {

        textoObjetivo.value = "";

        ventanaObjetivo.classList.add(
            "mostrar"
        );

        textoObjetivo.focus();

    }
);


cerrarObjetivo.addEventListener(
    "click",
    function() {

        ventanaObjetivo.classList.remove(
            "mostrar"
        );

    }
);


ventanaObjetivo.addEventListener(
    "click",
    function(evento) {

        if (evento.target === ventanaObjetivo) {

            ventanaObjetivo.classList.remove(
                "mostrar"
            );

        }

    }
);


guardarObjetivo.addEventListener(
    "click",
    function() {

        const texto =
            textoObjetivo.value.trim();


        if (texto === "") {

            alert(
                "Escribí un objetivo antes de guardarlo."
            );

            return;

        }


        const nuevoObjetivo = {

            id: Date.now(),

            texto: texto,

            cumplido: false

        };


        objetivos.push(
            nuevoObjetivo
        );


        guardarObjetivos();

        mostrarObjetivos();


        ventanaObjetivo.classList.remove(
            "mostrar"
        );

    }
);


mostrarObjetivos();