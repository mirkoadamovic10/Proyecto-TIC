const calendarioDias =
    document.getElementById("calendarioDias");

const mesActual =
    document.getElementById("mesActual");

const mesAnterior =
    document.getElementById("mesAnterior");

const mesSiguiente =
    document.getElementById("mesSiguiente");

const modalAgenda =
    document.getElementById("modalAgenda");

const cerrarModal =
    document.getElementById("cerrarModal");

const fechaSeleccionada =
    document.getElementById("fechaSeleccionada");

const nombrePaciente =
    document.getElementById("nombrePaciente");

const horaTurno =
    document.getElementById("horaTurno");

const motivoConsulta =
    document.getElementById("motivoConsulta");

const tipoTurno =
    document.getElementById("tipoTurno");

const guardarTurno =
    document.getElementById("guardarTurno");


let fechaCalendario =
    new Date();

let fechaElegida =
    "";


let fechasConAlerta =
    [];


let turnos =
    JSON.parse(
        localStorage.getItem("turnosPsicologo")
    ) || [];


const nombresMeses = [

    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"

];


// ==========================================
// MOSTRAR CALENDARIO
// ==========================================

function mostrarCalendario() {

    calendarioDias.innerHTML = "";


    const año =
        fechaCalendario.getFullYear();

    const mes =
        fechaCalendario.getMonth();


    mesActual.textContent =
        `${nombresMeses[mes]} ${año}`;


    const primerDia =
        new Date(año, mes, 1);

    const ultimoDia =
        new Date(año, mes + 1, 0);


    let diaInicio =
        primerDia.getDay();


    if (diaInicio === 0) {
        diaInicio = 7;
    }


    const cantidadDias =
        ultimoDia.getDate();


    for (
        let i = 1;
        i < diaInicio;
        i++
    ) {

        const espacio =
            document.createElement("div");

        espacio.className =
            "dia-vacio";

        calendarioDias.appendChild(
            espacio
        );

    }


    for (
        let dia = 1;
        dia <= cantidadDias;
        dia++
    ) {

        const celda =
            document.createElement("button");


        celda.type =
            "button";


        celda.className =
            "dia-calendario";


        celda.dataset.fecha =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


        celda.innerHTML =
            `<span class="numero-dia">${dia}</span>`;


        if (
            fechasConAlerta.includes(celda.dataset.fecha)
        ) {

            celda.classList.add("con-alerta");

        }


        const turnosDelDia =
            turnos.filter(
                function (turno) {

                    return turno.fecha ===
                        celda.dataset.fecha;

                }
            );


        if (
            turnosDelDia.length > 0
        ) {

            const indicador =
                document.createElement("div");


            indicador.className =
                "indicador-turno";


            indicador.textContent =
                `${turnosDelDia.length} turno${turnosDelDia.length > 1 ? "s" : ""}`;


            celda.appendChild(
                indicador
            );

        }


        celda.addEventListener(
            "click",
            function () {

                abrirModal(
                    celda.dataset.fecha
                );

            }
        );


        calendarioDias.appendChild(
            celda
        );

    }

}


// ==========================================
// ABRIR MODAL
// ==========================================

function abrirModal(fecha) {

    fechaElegida =
        fecha;


    const partes =
        fecha.split("-");


    fechaSeleccionada.textContent =
        `Fecha: ${partes[2]}/${partes[1]}/${partes[0]}`;


    nombrePaciente.value =
        "";

    horaTurno.value =
        "";

    motivoConsulta.value =
        "";

    tipoTurno.value =
        "";


    modalAgenda.hidden =
        false;

}


// ==========================================
// CERRAR
// ==========================================

function cerrarVentana() {

    modalAgenda.hidden =
        true;

}


cerrarModal.addEventListener(
    "click",
    cerrarVentana
);


// ==========================================
// GUARDAR TURNO
// ==========================================

guardarTurno.addEventListener(
    "click",
    function () {

        if (

            nombrePaciente.value.trim() === "" ||

            horaTurno.value === "" ||

            tipoTurno.value === ""

        ) {

            alert(
                "Completá el nombre del evento, la hora y el tipo de evento."
            );

            return;
        }


        const nuevoTurno = {

            id:
                Date.now(),

            fecha:
                fechaElegida,

            paciente:
                nombrePaciente.value.trim(),

            hora:
                horaTurno.value,

            motivo:
                motivoConsulta.value.trim(),

            tipo:
                tipoTurno.value

        };


        turnos.push(
            nuevoTurno
        );


        localStorage.setItem(
            "turnosPsicologo",
            JSON.stringify(turnos)
        );


        guardarTurnoEnServidor(
            nuevoTurno
        );


        cerrarVentana();

        mostrarCalendario();


        alert(
            "Turno guardado correctamente."
        );

    }
);


// ==========================================
// CAMBIAR MES
// ==========================================

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


// ==========================================
// API: AGENDA Y ALERTAS
// POST /api/agenda  ·  GET /api/agenda/:idUsuario
// POST /api/alertas ·  GET /api/alertas/:idUsuario
// ==========================================

const URL_API =
    "http://localhost:3000/api";


function idUsuarioActual() {

    return Number(
        localStorage.getItem("idUsuario")
    ) || 1;

}


async function guardarTurnoEnServidor(turno) {

    const idUsuario =
        idUsuarioActual();

    try {

        // Evento de agenda
        await fetch(`${URL_API}/agenda`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                fecha: turno.fecha,
                hora: turno.hora,
                tipo: turno.tipo,
                descripcion: turno.motivo,
                titulo: turno.paciente,
                idLocal: turno.id
            })
        });

        // Alerta para recordar el turno
        await fetch(`${URL_API}/alertas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                tipoAlerta: turno.tipo,
                fecha: turno.fecha,
                estado: "pendiente",
                mensaje: `${turno.paciente} a las ${turno.hora}`
            })
        });

        fechasConAlerta.push(turno.fecha);
        mostrarCalendario();

    } catch (error) {

        console.error("No se pudo guardar el turno en el servidor:", error);

    }

}


async function cargarDesdeServidor() {

    const idUsuario =
        idUsuarioActual();

    try {

        const respuestaAgenda =
            await fetch(`${URL_API}/agenda/${idUsuario}`);

        if (respuestaAgenda.ok) {

            const eventos =
                await respuestaAgenda.json();

            // Suma los turnos del servidor que no estén en este navegador
            eventos.forEach(function (evento) {

                const yaEsta =
                    turnos.some(function (turno) {
                        return turno.id === evento.idLocal ||
                            (turno.fecha === evento.fecha && turno.hora === evento.hora && turno.paciente === evento.titulo);
                    });

                if (!yaEsta) {

                    turnos.push({
                        id: evento.idLocal || evento.idEvento,
                        fecha: evento.fecha,
                        paciente: evento.titulo || "Evento",
                        hora: evento.hora,
                        motivo: evento.descripcion || "",
                        tipo: evento.tipo
                    });

                }

            });

            localStorage.setItem(
                "turnosPsicologo",
                JSON.stringify(turnos)
            );

        }

        const respuestaAlertas =
            await fetch(`${URL_API}/alertas/${idUsuario}`);

        if (respuestaAlertas.ok) {

            const alertas =
                await respuestaAlertas.json();

            fechasConAlerta = alertas
                .filter(function (alerta) { return alerta.estado !== "vista"; })
                .map(function (alerta) { return alerta.fecha; });

        }

        mostrarCalendario();

    } catch (error) {

        console.error("No se pudo cargar la agenda del servidor:", error);

    }

}


cargarDesdeServidor();
