const paciente =
    JSON.parse(
        localStorage.getItem(
            "pacienteSeleccionadoHospital"
        )
    );


const nombrePaciente =
    document.getElementById("nombrePaciente");

const ventanaPasaporte =
    document.getElementById("ventanaPasaporte");

const cerrarPasaporte =
    document.getElementById("cerrarPasaporte");

const guardarPasaporte =
    document.getElementById("guardarPasaporte");

const informacionPasaporte =
    document.getElementById("informacionPasaporte");

const tituloVentanaPasaporte =
    document.getElementById(
        "tituloVentanaPasaporte"
    );


let seccionActual = "";


const secciones = {

    diagnosticos: "Diagnósticos",

    medicaciones: "Medicaciones",

    alergias: "Alergias",

    estudios: "Estudios",

    imagenes: "Imágenes",

    recetas: "Recetas",

    terapias: "Terapias",

    cirugias: "Cirugías",

    certificados: "Certificados",

    adaptaciones: "Adaptaciones",

    objetivos: "Objetivos"

};


if (paciente) {

    nombrePaciente.textContent =
        `Pasaporte de ${paciente.nombre || paciente.email}`;

}


function obtenerClave() {

    if (!paciente) {
        return "pasaporte_compartido";
    }

    return (
        "pasaporte_compartido_" +
        paciente.email
    );

}


let pasaporte =
    JSON.parse(
        localStorage.getItem(
            obtenerClave()
        )
    ) || {};


function mostrarInformacion() {

    Object.keys(secciones).forEach(
        function(seccion) {

            const contenedor =
                document.getElementById(
                    seccion + "Paciente"
                );


            if (!contenedor) {
                return;
            }


            contenedor.innerHTML = "";


            const datos =
                pasaporte[seccion] || [];


            if (datos.length === 0) {

                const vacio =
                    document.createElement("p");

                vacio.classList.add(
                    "pasaporte-vacio"
                );

                vacio.textContent =
                    "Sin información cargada.";

                contenedor.appendChild(vacio);

                return;

            }


            datos.forEach(function(dato) {

                const elemento =
                    document.createElement("div");

                elemento.classList.add(
                    "dato-pasaporte-hospital"
                );

                elemento.textContent =
                    dato;

                contenedor.appendChild(
                    elemento
                );

            });

        }
    );

}


document
    .querySelectorAll(".boton-agregar-pasaporte")
    .forEach(
        function(boton) {

            boton.addEventListener(
                "click",
                function() {

                    seccionActual =
                        boton.dataset.seccion;


                    tituloVentanaPasaporte.textContent =
                        `Agregar ${secciones[seccionActual]}`;


                    informacionPasaporte.value = "";


                    ventanaPasaporte.classList.add(
                        "mostrar"
                    );


                    informacionPasaporte.focus();

                }
            );

        }
    );


cerrarPasaporte.addEventListener(
    "click",
    function() {

        ventanaPasaporte.classList.remove(
            "mostrar"
        );

    }
);


ventanaPasaporte.addEventListener(
    "click",
    function(evento) {

        if (evento.target === ventanaPasaporte) {

            ventanaPasaporte.classList.remove(
                "mostrar"
            );

        }

    }
);


guardarPasaporte.addEventListener(
    "click",
    function() {

        const informacion =
            informacionPasaporte.value.trim();


        if (informacion === "") {

            alert(
                "Ingresá información antes de guardar."
            );

            return;

        }


        if (!pasaporte[seccionActual]) {

            pasaporte[seccionActual] = [];

        }


        pasaporte[seccionActual].push(
            informacion
        );


        localStorage.setItem(
            obtenerClave(),
            JSON.stringify(pasaporte)
        );


        mostrarInformacion();


        ventanaPasaporte.classList.remove(
            "mostrar"
        );

    }
);


mostrarInformacion();


// ==========================================
// DATOS DEL PACIENTE DESDE EL SERVIDOR
// GET /api/hospitales/:idHospital/pacientes
// ==========================================

(async function actualizarPacienteDesdeServidor() {
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;
    const idHospital = idUsuario ? Number(localStorage.getItem("idHospital_" + idUsuario)) : null;

    if (!paciente || !idHospital) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/api/hospitales/${idHospital}/pacientes`);

        if (!respuesta.ok) return;

        const lista = await respuesta.json();
        const encontrado = lista.find(function (usuario) {
            return usuario.idUsuario === paciente.idUsuario ||
                (usuario.email || "").toLowerCase() === (paciente.email || "").toLowerCase();
        });

        if (encontrado) {
            nombrePaciente.textContent = `Pasaporte de ${encontrado.nombre || encontrado.email}`;
        }
    } catch (error) {
        console.error("No se pudieron cargar los datos del paciente:", error);
    }
})();
