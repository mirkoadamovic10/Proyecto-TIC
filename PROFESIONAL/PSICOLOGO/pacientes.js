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


// ==========================================
// CONFIGURACIÓN E INFORMACIÓN PERSONAL
// ==========================================

(function () {

    const RUTAS_CONFIGURACION = [
        "configuracion.html"
    ];


    const RUTAS_INFORMACION_PERSONAL = [
        "informacion-personal.html"
    ];


    const menuPerfil =
        document.getElementById("menuPerfilPacientes");


    if (!menuPerfil) {
        return;
    }


    async function irAPrimeraRutaQueExista(rutas, nombrePagina) {

        for (const ruta of rutas) {

            try {

                const respuesta =
                    await fetch(ruta, { method: "HEAD" });


                if (respuesta.ok) {

                    window.location.href = ruta;

                    return;

                }

            } catch (error) {

                // Se prueba con la siguiente ruta.

            }

        }


        alert(
            "No se encontró la página de " + nombrePagina + ".\n\n" +
            "Rutas probadas:\n" + rutas.join("\n")
        );

    }


    const botonConfiguracion =
        menuPerfil.querySelector("li:nth-child(1) button");


    const botonInfoPersonal =
        menuPerfil.querySelector("li:nth-child(2) button");


    if (botonConfiguracion) {

        botonConfiguracion.addEventListener(
            "click",
            function () {

                irAPrimeraRutaQueExista(
                    RUTAS_CONFIGURACION,
                    "configuración"
                );

            }
        );

    }


    if (botonInfoPersonal) {

        botonInfoPersonal.addEventListener(
            "click",
            function () {

                irAPrimeraRutaQueExista(
                    RUTAS_INFORMACION_PERSONAL,
                    "información personal"
                );

            }
        );

    }

})();


// ==========================================
// INICIAR
// ==========================================

mostrarPacientes();


// ==========================================
// FOTO DE PERFIL: se muestra en el botón de perfil
// (es la que se elige en Configuración)
// ==========================================
(function () {
    function mostrarFotoPerfil() {
        const foto = localStorage.getItem("fotoPerfil");
        const botonConFoto = document.getElementById("botonPerfilPacientes");

        if (!foto || !botonConFoto) {
            return;
        }

        // "important" para ganarle al color de fondo que tiene el botón en el CSS
        botonConFoto.style.setProperty("background-image", 'url("' + foto + '")', "important");
        botonConFoto.style.setProperty("background-size", "cover", "important");
        botonConFoto.style.setProperty("background-position", "center", "important");
        botonConFoto.style.setProperty("background-repeat", "no-repeat", "important");
        botonConFoto.classList.add("con-foto-perfil");

        // Se oculta el muñequito que está adentro del botón
        Array.from(botonConFoto.children).forEach(function (hijo) {
            hijo.style.setProperty("display", "none", "important");
        });
    }

    // Se aplica cuando la página terminó de cargar, después del resto del código
    if (document.readyState === "complete") {
        mostrarFotoPerfil();
    } else {
        window.addEventListener("load", mostrarFotoPerfil);
    }
})();
