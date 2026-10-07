// ==========================================
// ELEMENTOS
// ==========================================

const calendarioDias =
    document.getElementById(
        "calendarioDias"
    );

const mesActual =
    document.getElementById(
        "mesActual"
    );

const mesAnterior =
    document.getElementById(
        "mesAnterior"
    );

const mesSiguiente =
    document.getElementById(
        "mesSiguiente"
    );

const modalAgenda =
    document.getElementById(
        "modalAgenda"
    );

const cerrarModal =
    document.getElementById(
        "cerrarModal"
    );

const fechaSeleccionada =
    document.getElementById(
        "fechaSeleccionada"
    );

const nombrePaciente =
    document.getElementById(
        "nombrePaciente"
    );

const horaTurno =
    document.getElementById(
        "horaTurno"
    );

const motivoConsulta =
    document.getElementById(
        "motivoConsulta"
    );

const tipoTurno =
    document.getElementById(
        "tipoTurno"
    );

const guardarTurno =
    document.getElementById(
        "guardarTurno"
    );


// ==========================================
// FECHA ACTUAL
// ==========================================

let fechaCalendario = new Date();

let fechaElegida = "";


// ==========================================
// TURNOS GUARDADOS
// ==========================================

let turnos =
    JSON.parse(
        localStorage.getItem(
            "turnosMedico"
        )
    ) || [];


// ==========================================
// NOMBRES DE LOS MESES
// ==========================================

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


    // Primer día del mes

    const primerDia =
        new Date(
            año,
            mes,
            1
        );


    // Último día del mes

    const ultimoDia =
        new Date(
            año,
            mes + 1,
            0
        );


    let diaInicio =
        primerDia.getDay();


    // Convertimos domingo = 0
    // a domingo = 7

    if (diaInicio === 0) {

        diaInicio = 7;

    }


    const cantidadDias =
        ultimoDia.getDate();


    // ======================================
    // ESPACIOS ANTES DEL PRIMER DÍA
    // ======================================

    for (
        let i = 1;
        i < diaInicio;
        i++
    ) {

        const espacio =
            document.createElement(
                "div"
            );

        espacio.className =
            "dia-vacio";

        calendarioDias.appendChild(
            espacio
        );

    }


    // ======================================
    // CREAR DÍAS
    // ======================================

    for (
        let dia = 1;
        dia <= cantidadDias;
        dia++
    ) {

        const celda =
            document.createElement(
                "button"
            );


        celda.type =
            "button";


        celda.className =
            "dia-calendario";


        celda.dataset.fecha =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


        celda.innerHTML = `
            <span class="numero-dia">
                ${dia}
            </span>
        `;


        // ==================================
        // TURNOS DE ESE DÍA
        // ==================================

        const turnosDelDia =
            turnos.filter(
                function (turno) {

                    return (
                        turno.fecha ===
                        celda.dataset.fecha
                    );

                }
            );


        if (
            turnosDelDia.length > 0
        ) {

            const indicador =
                document.createElement(
                    "div"
                );


            indicador.className =
                "indicador-turno";


            indicador.textContent =
                `${turnosDelDia.length} turno${turnosDelDia.length > 1 ? "s" : ""}`;


            celda.appendChild(
                indicador
            );

        }


        // ==================================
        // CLICK EN DÍA
        // ==================================

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


    nombrePaciente.value = "";

    horaTurno.value = "";

    motivoConsulta.value = "";

    tipoTurno.value = "";


    modalAgenda.hidden =
        false;

}


// ==========================================
// CERRAR MODAL
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
            motivoConsulta.value.trim() === "" ||
            tipoTurno.value === ""
        ) {

            alert(
                "Completá todos los datos del turno."
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
            "turnosMedico",
            JSON.stringify(
                turnos
            )
        );


        cerrarVentana();


        mostrarCalendario();


        alert(
            "Turno guardado correctamente."
        );

    }
);


// ==========================================
// MES ANTERIOR
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


// ==========================================
// MES SIGUIENTE
// ==========================================

mesSiguiente.addEventListener(
    "click",
    function () {

        fechaCalendario.setMonth(
            fechaCalendario.getMonth() + 1
        );

        mostrarCalendario();

    }
);


// ==========================================
// INICIAR
// ==========================================

mostrarCalendario();