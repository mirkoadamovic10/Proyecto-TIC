const diasCalendario = document.getElementById("diasCalendario");
const mesActual = document.getElementById("mesActual");

const mesAnterior = document.getElementById("mesAnterior");
const mesSiguiente = document.getElementById("mesSiguiente");

const botonAgregarEvento = document.getElementById("botonAgregarEvento");

const ventanaEvento = document.getElementById("ventanaEvento");
const cerrarEvento = document.getElementById("cerrarEvento");

const guardarEvento = document.getElementById("guardarEvento");

const tituloEvento = document.getElementById("tituloEvento");
const pacienteEvento = document.getElementById("pacienteEvento");
const motivoEvento = document.getElementById("motivoEvento");

const fechaEvento = document.getElementById("fechaEvento");
const horaEvento = document.getElementById("horaEvento");

const tipoEvento = document.getElementById("tipoEvento");
const descripcionEvento = document.getElementById("descripcionEvento");


let fechaCalendario = new Date();

let eventos = JSON.parse(
    localStorage.getItem("neuropassport_eventos_medico")
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


const tiposEvento = {

    turno: {
        nombre: "Consulta",
        clase: "turno"
    },

    estudio: {
        nombre: "Estudio médico",
        clase: "estudio"
    },

    terapia: {
        nombre: "Terapia",
        clase: "terapia"
    },

    medicacion: {
        nombre: "Medicación",
        clase: "medicacion"
    },

    control: {
        nombre: "Control / seguimiento",
        clase: "control"
    }

};


function mostrarCalendario() {

    diasCalendario.innerHTML = "";

    const año = fechaCalendario.getFullYear();
    const mes = fechaCalendario.getMonth();

    mesActual.textContent =
        nombresMeses[mes] + " " + año;


    let primerDia =
        new Date(año, mes, 1).getDay();

    if (primerDia === 0) {
        primerDia = 7;
    }


    const cantidadDias =
        new Date(año, mes + 1, 0).getDate();


    for (let i = 1; i < primerDia; i++) {

        const espacio =
            document.createElement("div");

        espacio.classList.add(
            "dia",
            "dia-vacio"
        );

        diasCalendario.appendChild(espacio);

    }


    for (let dia = 1; dia <= cantidadDias; dia++) {

        const elementoDia =
            document.createElement("div");

        elementoDia.classList.add("dia");


        const numeroDia =
            document.createElement("span");

        numeroDia.classList.add("numero-dia");

        numeroDia.textContent = dia;


        elementoDia.appendChild(numeroDia);


        const fechaFormateada =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


        const eventosDelDia =
            eventos.filter(
                evento => evento.fecha === fechaFormateada
            );


        eventosDelDia.forEach(evento => {

            const eventoElemento =
                document.createElement("div");


            eventoElemento.classList.add(
                "evento-calendario",
                tiposEvento[evento.tipo].clase
            );


            const nombre =
                document.createElement("span");

            nombre.classList.add("nombre-evento");

            nombre.textContent =
                evento.paciente
                    ? evento.paciente
                    : evento.titulo;


            eventoElemento.appendChild(nombre);


            if (evento.hora) {

                const hora =
                    document.createElement("span");

                hora.classList.add("hora-evento");

                hora.textContent =
                    evento.hora;

                eventoElemento.appendChild(hora);

            }


            eventoElemento.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();

                    mostrarInformacionEvento(evento);

                }
            );


            elementoDia.appendChild(eventoElemento);

        });


        elementoDia.addEventListener(
            "click",
            function () {

                fechaEvento.value =
                    fechaFormateada;

                abrirFormulario();

            }
        );


        diasCalendario.appendChild(elementoDia);

    }

}


function abrirFormulario() {

    ventanaEvento.classList.add("mostrar");

}


function cerrarFormulario() {

    ventanaEvento.classList.remove("mostrar");

    tituloEvento.value = "";
    pacienteEvento.value = "";
    motivoEvento.value = "";
    horaEvento.value = "";
    descripcionEvento.value = "";

}


botonAgregarEvento.addEventListener(
    "click",
    function () {

        const hoy = new Date();

        const año =
            hoy.getFullYear();

        const mes =
            String(hoy.getMonth() + 1)
                .padStart(2, "0");

        const dia =
            String(hoy.getDate())
                .padStart(2, "0");


        fechaEvento.value =
            `${año}-${mes}-${dia}`;


        abrirFormulario();

    }
);


cerrarEvento.addEventListener(
    "click",
    cerrarFormulario
);


ventanaEvento.addEventListener(
    "click",
    function (e) {

        if (e.target === ventanaEvento) {
            cerrarFormulario();
        }

    }
);


guardarEvento.addEventListener(
    "click",
    function () {

        if (
            tituloEvento.value.trim() === ""
        ) {

            alert(
                "Por favor, escribí el nombre del evento."
            );

            return;

        }


        if (
            pacienteEvento.value.trim() === ""
        ) {

            alert(
                "Por favor, escribí el nombre del paciente."
            );

            return;

        }


        if (
            motivoEvento.value.trim() === ""
        ) {

            alert(
                "Por favor, escribí el motivo de consulta."
            );

            return;

        }


        if (
            fechaEvento.value === ""
        ) {

            alert(
                "Por favor, elegí una fecha."
            );

            return;

        }


        const nuevoEvento = {

            id: Date.now(),

            titulo:
                tituloEvento.value.trim(),

            paciente:
                pacienteEvento.value.trim(),

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


        eventos.push(nuevoEvento);


        localStorage.setItem(
            "neuropassport_eventos_medico",
            JSON.stringify(eventos)
        );


        cerrarFormulario();

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


function mostrarInformacionEvento(evento) {

    const tipo =
        tiposEvento[evento.tipo].nombre;


    let mensaje =
        `${evento.titulo}\n\n` +
        `Paciente: ${evento.paciente}\n` +
        `Motivo de consulta: ${evento.motivo}\n\n` +
        `Tipo: ${tipo}\n` +
        `Fecha: ${evento.fecha}`;


    if (evento.hora) {

        mensaje +=
            `\nHora: ${evento.hora}`;

    }


    if (evento.descripcion) {

        mensaje +=
            `\n\n${evento.descripcion}`;

    }


    const eliminar =
        confirm(
            mensaje +
            "\n\n¿Querés eliminar este evento?"
        );


    if (eliminar) {

        eventos =
            eventos.filter(
                item => item.id !== evento.id
            );


        localStorage.setItem(
            "neuropassport_eventos_medico",
            JSON.stringify(eventos)
        );


        mostrarCalendario();

    }

}


mostrarCalendario();