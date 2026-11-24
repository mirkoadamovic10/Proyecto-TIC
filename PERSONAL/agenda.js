const diasCalendario = document.getElementById("diasCalendario");
const mesActual = document.getElementById("mesActual");

const mesAnterior = document.getElementById("mesAnterior");
const mesSiguiente = document.getElementById("mesSiguiente");

const botonAgregarEvento = document.getElementById("botonAgregarEvento");

const ventanaEvento = document.getElementById("ventanaEvento");
const cerrarEvento = document.getElementById("cerrarEvento");

const guardarEvento = document.getElementById("guardarEvento");

const tituloEvento = document.getElementById("tituloEvento");
const fechaEvento = document.getElementById("fechaEvento");
const horaEvento = document.getElementById("horaEvento");

const tipoEvento = document.getElementById("tipoEvento");
const descripcionEvento = document.getElementById("descripcionEvento");

const URL_API = "http://localhost:3000/api/agenda";
const ID_USUARIO_PRUEBA = "1"; // Cambiá este valor si querés otro ID por defecto en pruebas

let fechaCalendario = new Date();
let eventos = [];
let alertas = [];

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

function obtenerIdUsuario() {
    const idGuardado = localStorage.getItem("idUsuario");

    if (idGuardado && idGuardado.trim() !== "") {
        return idGuardado.trim();
    }

    // Si no existe en localStorage, usa el ID de prueba y lo guarda para mantener consistencia
    localStorage.setItem("idUsuario", ID_USUARIO_PRUEBA);
    return ID_USUARIO_PRUEBA;
}


// =====================================
// GUARDADO EN EL NAVEGADOR (por usuario)
// Así los eventos no se pierden aunque el servidor esté apagado
// =====================================

function claveEventos() {
    return "eventosAgenda_" + obtenerIdUsuario();
}

function claveEliminados() {
    return "eventosAgendaEliminados_" + obtenerIdUsuario();
}

function leerLista(clave) {
    try {
        const lista = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        return [];
    }
}

function guardarEventosLocales() {
    localStorage.setItem(claveEventos(), JSON.stringify(eventos));
}

// Cada evento tiene un id; los que vienen solo del servidor usan su idEvento
function idDeEvento(evento) {
    return String(evento.id || "srv-" + evento.idEvento);
}


// =====================================
// GET: OBTENER EVENTOS DEL USUARIO
// =====================================

async function cargarEventos() {
    const idUsuario = obtenerIdUsuario();

    // Primero lo guardado en este navegador, así se ve enseguida
    eventos = leerLista(claveEventos());
    mostrarCalendario();

    try {
        const respuesta = await fetch(`${URL_API}/${idUsuario}`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los eventos: " + respuesta.status);
        }

        const resultado = await respuesta.json();

        // Admite distintas estructuras habituales de respuesta.
        let delServidor = [];

        if (Array.isArray(resultado)) {
            delServidor = resultado;
        } else if (Array.isArray(resultado.eventos)) {
            delServidor = resultado.eventos;
        } else if (Array.isArray(resultado.datos)) {
            delServidor = resultado.datos;
        }

        const eliminados = leerLista(claveEliminados());
        const yaEstan = eventos.map(idDeEvento);

        // Suma los del servidor que no estén acá y que no se hayan borrado
        delServidor.forEach(function (evento) {
            // Los eventos de la agenda compartida de la familia van en su propia agenda
            if (evento.compartido) {
                return;
            }

            const id = idDeEvento(evento);

            if (!yaEstan.includes(id) && !eliminados.includes(id)) {
                eventos.push(evento);
            }
        });

        // Los que se guardaron con el servidor apagado se suben ahora
        for (const evento of eventos.filter(function (e) { return e.pendiente; })) {
            const { pendiente, ...datos } = evento;

            if (await guardarEventoEnServidor(datos)) {
                delete evento.pendiente;
            }
        }

        guardarEventosLocales();
        mostrarCalendario();
        console.log("Eventos cargados correctamente:", eventos);
    } catch (error) {
        // Sin servidor se usa lo guardado en el navegador
        console.error("No se pudo conectar con el servidor; se muestran los eventos guardados:", error);
    }
}


// =====================================
// POST: GUARDAR EVENTO EN EL SERVIDOR
// =====================================

async function guardarEventoEnServidor(nuevoEvento) {
    const idUsuario = obtenerIdUsuario();

    const datos = {
        idUsuario: Number(idUsuario),
        ...nuevoEvento
    };

    try {
        const respuesta = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "Error al guardar el evento: " + respuesta.status
            );
        }

        console.log("Evento guardado correctamente:", resultado);
        return true;
    } catch (error) {
        console.error("Error al guardar el evento en el servidor:", error);
        return false;
    }
}


// =====================================
// ALERTAS: POST /api/alertas · GET /api/alertas/:idUsuario
// =====================================

const URL_ALERTAS = "http://localhost:3000/api/alertas";

async function cargarAlertas() {
    const idUsuario = obtenerIdUsuario();

    try {
        const respuesta = await fetch(`${URL_ALERTAS}/${idUsuario}`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener las alertas: " + respuesta.status);
        }

        alertas = await respuesta.json();
        mostrarCalendario();
        console.log("Alertas cargadas correctamente:", alertas);
    } catch (error) {
        console.error("Error al cargar las alertas:", error);
        alertas = [];
    }
}

async function guardarAlertaEnServidor(evento) {
    const alerta = {
        idUsuario: Number(obtenerIdUsuario()),
        tipoAlerta: evento.tipo,
        fecha: evento.fecha,
        estado: "pendiente",
        mensaje: evento.hora ? `${evento.titulo} a las ${evento.hora}` : evento.titulo
    };

    try {
        const respuesta = await fetch(URL_ALERTAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(alerta)
        });

        if (!respuesta.ok) {
            throw new Error("Error al guardar la alerta: " + respuesta.status);
        }

        alertas.push(alerta);
    } catch (error) {
        console.error("Error al guardar la alerta:", error);
    }
}


// =====================================
// MOSTRAR CALENDARIO
// =====================================

function mostrarCalendario() {
    diasCalendario.innerHTML = "";

    const año = fechaCalendario.getFullYear();
    const mes = fechaCalendario.getMonth();

    mesActual.textContent = nombresMeses[mes] + " " + año;

    let primerDia = new Date(año, mes, 1).getDay();

    if (primerDia === 0) {
        primerDia = 7;
    }

    const cantidadDias = new Date(
        año,
        mes + 1,
        0
    ).getDate();

    for (let i = 1; i < primerDia; i++) {
        const espacio = document.createElement("div");
        espacio.classList.add("dia", "dia-vacio");
        diasCalendario.appendChild(espacio);
    }

    for (let dia = 1; dia <= cantidadDias; dia++) {
        const elementoDia = document.createElement("div");
        elementoDia.classList.add("dia");

        const numeroDia = document.createElement("span");
        numeroDia.classList.add("numero-dia");
        numeroDia.textContent = dia;

        elementoDia.appendChild(numeroDia);

        const fechaDelDia =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        if (alertas.some(alerta => alerta.fecha === fechaDelDia && alerta.estado !== "vista")) {
            elementoDia.classList.add("con-alerta");
        }

        const fechaFormateada =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const eventosDelDia = eventos.filter(
            evento => evento.fecha === fechaFormateada
        );

        eventosDelDia.forEach(evento => {
            const eventoElemento = document.createElement("div");
            const configuracionTipo = tiposEvento[evento.tipo];

            eventoElemento.classList.add(
                "evento-calendario",
                configuracionTipo ? configuracionTipo.clase : ""
            );

            const nombre = document.createElement("span");
            nombre.classList.add("nombre-evento");
            nombre.textContent = evento.titulo;
            eventoElemento.appendChild(nombre);

            if (evento.hora) {
                const hora = document.createElement("span");
                hora.classList.add("hora-evento");
                hora.textContent = evento.hora;
                eventoElemento.appendChild(hora);
            }

            eventoElemento.addEventListener("click", function(e) {
                e.stopPropagation();
                mostrarInformacionEvento(evento);
            });

            elementoDia.appendChild(eventoElemento);
        });

        elementoDia.addEventListener("click", function() {
            fechaEvento.value = fechaFormateada;
            abrirFormulario();
        });

        diasCalendario.appendChild(elementoDia);
    }
}


// =====================================
// ABRIR Y CERRAR FORMULARIO
// =====================================

function abrirFormulario() {
    ventanaEvento.classList.add("mostrar");
}

function cerrarFormulario() {
    ventanaEvento.classList.remove("mostrar");

    tituloEvento.value = "";
    horaEvento.value = "";
    descripcionEvento.value = "";
}

botonAgregarEvento.addEventListener("click", function() {
    const hoy = new Date();

    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    fechaEvento.value = `${año}-${mes}-${dia}`;

    abrirFormulario();
});

cerrarEvento.addEventListener("click", cerrarFormulario);

ventanaEvento.addEventListener("click", function(e) {
    if (e.target === ventanaEvento) {
        cerrarFormulario();
    }
});


// =====================================
// GUARDAR EVENTO
// =====================================

guardarEvento.addEventListener("click", async function() {
    if (tituloEvento.value.trim() === "") {
        alert("Por favor, escribí el nombre del evento.");
        return;
    }

    if (fechaEvento.value === "") {
        alert("Por favor, elegí una fecha.");
        return;
    }

    const nuevoEvento = {
        id: Date.now(),
        titulo: tituloEvento.value.trim(),
        fecha: fechaEvento.value,
        hora: horaEvento.value,
        tipo: tipoEvento.value,
        descripcion: descripcionEvento.value.trim()
    };

    // Se guarda en el navegador apenas se toca "Guardar"
    eventos.push(nuevoEvento);
    guardarEventosLocales();
    cerrarFormulario();
    mostrarCalendario();

    // Y después en el servidor; si está apagado, queda pendiente y se sube la próxima vez
    guardarEvento.disabled = true;
    const guardado = await guardarEventoEnServidor(nuevoEvento);
    guardarEvento.disabled = false;

    if (guardado) {
        await guardarAlertaEnServidor(nuevoEvento);
    } else {
        nuevoEvento.pendiente = true;
        guardarEventosLocales();
    }
});


// =====================================
// CAMBIAR DE MES
// =====================================

mesAnterior.addEventListener("click", function() {
    fechaCalendario.setMonth(
        fechaCalendario.getMonth() - 1
    );
    mostrarCalendario();
});

mesSiguiente.addEventListener("click", function() {
    fechaCalendario.setMonth(
        fechaCalendario.getMonth() + 1
    );
    mostrarCalendario();
});


// =====================================
// INFORMACIÓN Y ELIMINACIÓN DE EVENTOS
// =====================================

function mostrarInformacionEvento(evento) {
    const configuracionTipo = tiposEvento[evento.tipo];

    const tipo = configuracionTipo
        ? configuracionTipo.nombre
        : evento.tipo;

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

    const eliminar = confirm(
        mensaje + "\n\n¿Querés eliminar este evento?"
    );

    if (eliminar) {
        const id = idDeEvento(evento);

        eventos = eventos.filter(
            item => idDeEvento(item) !== id
        );
        guardarEventosLocales();

        // El servidor no tiene forma de borrar, así que se recuerda que se eliminó
        const eliminados = leerLista(claveEliminados());
        eliminados.push(id);
        localStorage.setItem(claveEliminados(), JSON.stringify(eliminados));

        mostrarCalendario();
    }
}


// =====================================
// INICIAR AGENDA
// =====================================

cargarEventos();
cargarAlertas();
