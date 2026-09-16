const diasCalendario = document.getElementById("diasCalendario");
const mesActual = document.getElementById("mesActual");

const mesAnterior = document.getElementById("mesAnterior");
const mesSiguiente = document.getElementById("mesSiguiente");

let fechaCalendario = new Date();

let eventos = JSON.parse(
    localStorage.getItem("neuropassport_eventos")
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
        nombre: "Turno médico",
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

        const espacio = document.createElement("div");

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

            nombre.textContent = evento.titulo;

            eventoElemento.appendChild(nombre);

            if (evento.hora) {

                const hora =
                    document.createElement("span");

                hora.classList.add("hora-evento");

                hora.textContent = evento.hora;

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

        diasCalendario.appendChild(elementoDia);

    }

}

function mostrarInformacionEvento(evento) {

    const tipo =
        tiposEvento[evento.tipo].nombre;

    let mensaje =
        `${evento.titulo}\n\n` +
        `Tipo: ${tipo}\n` +
        `Fecha: ${evento.fecha}`;

    if (evento.hora) {
        mensaje += `\nHora: ${evento.hora}`;
    }

    if (evento.descripcion) {
        mensaje += `\n\n${evento.descripcion}`;
    }

    alert(mensaje);

}

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