/* ============================= */
/* AGENDA COMPARTIDA - NeuroPassport */
/* ============================= */

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const diasCompartida = document.getElementById("diasCompartida");
const mesActualCompartida = document.getElementById("mesActualCompartida");
const mesAnteriorCompartida = document.getElementById("mesAnteriorCompartida");
const mesSiguienteCompartida = document.getElementById("mesSiguienteCompartida");
const botonAtrasAgenda = document.getElementById("botonAtrasAgenda");

const hoy = new Date();
let mesMostrado = hoy.getMonth();
let anioMostrado = hoy.getFullYear();


/* ---------- EVENTOS GUARDADOS ---------- */
/* Formato: [{ fecha: "2026-10-15", nombre: "Turno neurólogo", tipo: "turno" }]
   Tipos: turno, estudio, terapia, medicacion, control */

function leerEventos() {
    try {
        const eventos = JSON.parse(localStorage.getItem("eventosCompartidos"));
        return Array.isArray(eventos) ? eventos : [];
    } catch (error) {
        return [];
    }
}

function fechaTexto(anio, mes, dia) {
    return anio + "-" + String(mes + 1).padStart(2, "0") + "-" + String(dia).padStart(2, "0");
}


/* ---------- DIBUJAR EL CALENDARIO ---------- */

function dibujarCalendario() {

    mesActualCompartida.textContent = MESES[mesMostrado] + " " + anioMostrado;
    diasCompartida.innerHTML = "";

    const eventos = leerEventos();

    // En JS el domingo es 0; lo pasamos para que la semana arranque el lunes
    const primerDia = new Date(anioMostrado, mesMostrado, 1).getDay();
    const espaciosAntes = (primerDia + 6) % 7;
    const diasDelMes = new Date(anioMostrado, mesMostrado + 1, 0).getDate();

    // Casilleros vacíos antes del día 1
    for (let i = 0; i < espaciosAntes; i++) {
        const vacio = document.createElement("li");
        vacio.className = "acomp-dia acomp-dia-vacio";
        vacio.setAttribute("aria-hidden", "true");
        diasCompartida.appendChild(vacio);
    }

    // Días del mes
    for (let dia = 1; dia <= diasDelMes; dia++) {

        const casillero = document.createElement("li");
        casillero.className = "acomp-dia";

        const esHoy =
            dia === hoy.getDate() &&
            mesMostrado === hoy.getMonth() &&
            anioMostrado === hoy.getFullYear();

        if (esHoy) {
            casillero.classList.add("acomp-dia-hoy");
            casillero.setAttribute("aria-current", "date");
        }

        const numero = document.createElement("time");
        numero.className = "acomp-numero";
        numero.dateTime = fechaTexto(anioMostrado, mesMostrado, dia);
        numero.textContent = dia;
        casillero.appendChild(numero);

        eventos
            .filter(function (evento) {
                return evento.fecha === numero.dateTime;
            })
            .forEach(function (evento) {
                const etiqueta = document.createElement("span");
                etiqueta.className = "acomp-evento tipo-" + (evento.tipo || "turno");
                etiqueta.textContent = evento.nombre || "";
                etiqueta.title = evento.nombre || "";
                casillero.appendChild(etiqueta);
            });

        diasCompartida.appendChild(casillero);
    }
}


/* ---------- CAMBIAR DE MES ---------- */

mesAnteriorCompartida.addEventListener("click", function () {
    mesMostrado--;

    if (mesMostrado < 0) {
        mesMostrado = 11;
        anioMostrado--;
    }

    dibujarCalendario();
});

mesSiguienteCompartida.addEventListener("click", function () {
    mesMostrado++;

    if (mesMostrado > 11) {
        mesMostrado = 0;
        anioMostrado++;
    }

    dibujarCalendario();
});


/* ---------- VOLVER ---------- */

botonAtrasAgenda.addEventListener("click", function () {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "./familia-home.html";
    }
});


dibujarCalendario();
