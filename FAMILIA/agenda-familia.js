document.addEventListener("DOMContentLoaded", function () {

    const diasCalendario =
        document.getElementById("diasCalendario");

    const mesActual =
        document.getElementById("mesActual");

    const mesAnterior =
        document.getElementById("mesAnterior");

    const mesSiguiente =
        document.getElementById("mesSiguiente");

    const botonAgregarEvento =
        document.getElementById("botonAgregarEvento");

    const ventanaEvento =
        document.getElementById("ventanaEvento");

    const cerrarEvento =
        document.getElementById("cerrarEvento");

    const guardarEvento =
        document.getElementById("guardarEvento");

    const tituloEvento =
        document.getElementById("tituloEvento");

    const personaEvento =
        document.getElementById("personaEvento");

    const motivoEvento =
        document.getElementById("motivoEvento");

    const fechaEvento =
        document.getElementById("fechaEvento");

    const horaEvento =
        document.getElementById("horaEvento");

    const tipoEvento =
        document.getElementById("tipoEvento");

    const descripcionEvento =
        document.getElementById("descripcionEvento");

    const perfilFamilia =
        document.getElementById("perfilFamilia");


    const fotoUsuario =
        localStorage.getItem("fotoPerfil");


    if (fotoUsuario && perfilFamilia) {

        perfilFamilia.style.backgroundImage =
            `url("${fotoUsuario}")`;

        perfilFamilia.style.backgroundSize =
            "cover";

        perfilFamilia.style.backgroundPosition =
            "center";

        perfilFamilia.classList.add("tiene-foto");

    }


    let fechaCalendario = new Date();


    let eventos =
        JSON.parse(
            localStorage.getItem(
                "neuropassport_eventos_familia"
            )
        ) || [];


    function mostrarCalendario() {

        diasCalendario.innerHTML = "";


        const año =
            fechaCalendario.getFullYear();

        const mes =
            fechaCalendario.getMonth();


        const nombreMes =
            fechaCalendario.toLocaleDateString(
                "es-AR",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        mesActual.textContent =
            nombreMes.charAt(0).toUpperCase() +
            nombreMes.slice(1);


        let primerDia =
            new Date(
                año,
                mes,
                1
            ).getDay();


        primerDia =
            primerDia === 0
                ? 6
                : primerDia - 1;


        const cantidadDias =
            new Date(
                año,
                mes + 1,
                0
            ).getDate();


        for (
            let i = 0;
            i < primerDia;
            i++
        ) {

            const espacio =
                document.createElement("div");

            espacio.className =
                "dia-calendario vacio";

            diasCalendario.appendChild(
                espacio
            );

        }


        for (
            let dia = 1;
            dia <= cantidadDias;
            dia++
        ) {

            const celda =
                document.createElement("div");

            celda.className =
                "dia-calendario";


            const numero =
                document.createElement("span");

            numero.textContent =
                dia;

            celda.appendChild(
                numero
            );


            const fecha =
                `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


            const eventosDelDia =
                eventos.filter(
                    function (evento) {

                        return evento.fecha === fecha;

                    }
                );


            eventosDelDia.forEach(
                function (evento) {

                    const eventoElemento =
                        document.createElement("div");

                    eventoElemento.className =
                        `evento-calendario ${evento.tipo}`;


                    eventoElemento.textContent =
                        evento.titulo;


                    eventoElemento.addEventListener(
                        "click",
                        function (e) {

                            e.stopPropagation();

                            mostrarEvento(
                                evento
                            );

                        }
                    );


                    celda.appendChild(
                        eventoElemento
                    );

                }
            );


            diasCalendario.appendChild(
                celda
            );

        }

    }


    function mostrarEvento(evento) {

        const informacion =
            `Evento: ${evento.titulo}\n\n` +
            `Persona: ${evento.persona}\n` +
            `Motivo: ${evento.motivo}\n` +
            `Fecha: ${evento.fecha}\n` +
            `Hora: ${evento.hora || "Sin horario"}\n` +
            `Descripción: ${evento.descripcion || "Sin descripción"}`;


        const eliminar =
            confirm(
                informacion +
                "\n\n¿Querés eliminar este evento?"
            );


        if (!eliminar) {
            return;
        }


        eventos =
            eventos.filter(
                function (item) {

                    return item.id !== evento.id;

                }
            );


        localStorage.setItem(
            "neuropassport_eventos_familia",
            JSON.stringify(eventos)
        );


        mostrarCalendario();

    }


    botonAgregarEvento.addEventListener(
        "click",
        function () {

            ventanaEvento.classList.add(
                "mostrar"
            );

        }
    );


    cerrarEvento.addEventListener(
        "click",
        function () {

            ventanaEvento.classList.remove(
                "mostrar"
            );

        }
    );


    ventanaEvento.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === ventanaEvento
            ) {

                ventanaEvento.classList.remove(
                    "mostrar"
                );

            }

        }
    );


    guardarEvento.addEventListener(
        "click",
        function () {

            if (
                tituloEvento.value.trim() === "" ||
                personaEvento.value.trim() === "" ||
                motivoEvento.value.trim() === "" ||
                fechaEvento.value === ""
            ) {

                alert(
                    "Completá el nombre, la persona, el motivo y la fecha."
                );

                return;

            }


            const nuevoEvento = {

                id: Date.now(),

                titulo:
                    tituloEvento.value.trim(),

                persona:
                    personaEvento.value.trim(),

                motivo:
                    motivoEvento.value.trim(),

                fecha:
                    fechaEvento.value,

                hora:
                    horaEvento.value,

                tipo:
                    tipoEvento.value,

                descripcion:
                    descripcionEvento.value.trim()

            };


            eventos.push(
                nuevoEvento
            );


            localStorage.setItem(
                "neuropassport_eventos_familia",
                JSON.stringify(eventos)
            );


            tituloEvento.value = "";
            personaEvento.value = "";
            motivoEvento.value = "";
            fechaEvento.value = "";
            horaEvento.value = "";
            tipoEvento.value = "turno";
            descripcionEvento.value = "";


            ventanaEvento.classList.remove(
                "mostrar"
            );


            mostrarCalendario();

        }
    );


    mesAnterior.addEventListener(
        "click",
        function () {

            fechaCalendario.setMonth(
                fechaCalendario.getMonth() - 1
            );

            mostrarCalendario();

        }
    );


    mesSiguiente.addEventListener(
        "click",
        function () {

            fechaCalendario.setMonth(
                fechaCalendario.getMonth() + 1
            );

            mostrarCalendario();

        }
    );


    mostrarCalendario();

});