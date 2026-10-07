const pacienteGuardado =
    localStorage.getItem(
        "pacienteTerapistaSeleccionado"
    );


if (!pacienteGuardado) {

    alert(
        "No se encontró el paciente."
    );

    window.location.href =
        "pacientes.html";

} else {

    const paciente =
        JSON.parse(pacienteGuardado);


    const nombrePaciente =
        document.getElementById(
            "nombrePaciente"
        );


    const nuevoObjetivo =
        document.getElementById(
            "nuevoObjetivo"
        );


    const botonAgregarObjetivo =
        document.getElementById(
            "botonAgregarObjetivo"
        );


    const listaObjetivos =
        document.getElementById(
            "listaObjetivos"
        );


    nombrePaciente.textContent =
        paciente.nombre;


    let objetivos =
        paciente.objetivos || [];


    // ==========================================
    // MOSTRAR OBJETIVOS
    // ==========================================

    function mostrarObjetivos() {

        listaObjetivos.innerHTML = "";


        if (objetivos.length === 0) {

            listaObjetivos.innerHTML =
                "<p>No hay objetivos agregados todavía.</p>";

            return;
        }


        objetivos.forEach(
            function (objetivo, indice) {

                const tarjeta =
                    document.createElement("div");


                tarjeta.className =
                    "tarjeta-paciente";


                tarjeta.innerHTML = `

                    <label>

                        <input
                            type="checkbox"
                            ${objetivo.completado ? "checked" : ""}
                            onchange="cambiarEstadoObjetivo(${indice})"
                        >

                        ${objetivo.texto}

                    </label>

                `;


                listaObjetivos.appendChild(
                    tarjeta
                );

            }
        );

    }


    // ==========================================
    // AGREGAR OBJETIVO
    // ==========================================

    botonAgregarObjetivo.addEventListener(
        "click",
        function () {

            const texto =
                nuevoObjetivo.value.trim();


            if (texto === "") {

                alert(
                    "Ingresá un objetivo."
                );

                return;
            }


            objetivos.push({

                texto:
                    texto,

                completado:
                    false

            });


            paciente.objetivos =
                objetivos;


            actualizarPaciente();


            nuevoObjetivo.value = "";


            mostrarObjetivos();

        }
    );


    // ==========================================
    // CAMBIAR ESTADO
    // ==========================================

    window.cambiarEstadoObjetivo =
        function (indice) {

            objetivos[indice].completado =
                !objetivos[indice].completado;


            paciente.objetivos =
                objetivos;


            actualizarPaciente();


            mostrarObjetivos();

        };


    // ==========================================
    // GUARDAR PACIENTE
    // ==========================================

    function actualizarPaciente() {

        localStorage.setItem(
            "pacienteTerapistaSeleccionado",
            JSON.stringify(paciente)
        );


        let pacientes =
            JSON.parse(
                localStorage.getItem(
                    "pacientesTerapista"
                )
            ) || [];


        const posicion =
            pacientes.findIndex(
                function (p) {

                    return p.id === paciente.id;

                }
            );


        if (posicion !== -1) {

            pacientes[posicion] =
                paciente;

        }


        localStorage.setItem(
            "pacientesTerapista",
            JSON.stringify(pacientes)
        );

    }


    mostrarObjetivos();

}