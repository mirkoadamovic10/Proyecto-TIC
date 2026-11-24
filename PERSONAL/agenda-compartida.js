/* ============================= */
/* AGENDA COMPARTIDA - NeuroPassport */
/* Los eventos se comparten con todo el grupo familiar.
   Se guardan en el navegador (por grupo) y en el servidor:
   POST /api/agenda · GET /api/agenda/:idUsuario (de cada integrante) */
/* ============================= */

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const NOMBRES_TIPO = {
    turno: "Turno médico",
    estudio: "Estudio médico",
    terapia: "Terapia",
    medicacion: "Medicación",
    control: "Control / seguimiento"
};

const URL_API = "http://localhost:3000/api";

const diasCompartida = document.getElementById("diasCompartida");
const mesActualCompartida = document.getElementById("mesActualCompartida");
const mesAnteriorCompartida = document.getElementById("mesAnteriorCompartida");
const mesSiguienteCompartida = document.getElementById("mesSiguienteCompartida");
const botonAtrasAgenda = document.getElementById("botonAtrasAgenda");

// Formulario "Agregar evento"
const botonAgregarEvento = document.getElementById("botonAgregarEvento");
const ventanaEvento = document.getElementById("ventanaEvento");
const cerrarEvento = document.getElementById("cerrarEvento");
const guardarEvento = document.getElementById("guardarEvento");
const tituloEvento = document.getElementById("tituloEvento");
const fechaEvento = document.getElementById("fechaEvento");
const horaEvento = document.getElementById("horaEvento");
const tipoEvento = document.getElementById("tipoEvento");
const descripcionEvento = document.getElementById("descripcionEvento");

const hoy = new Date();
let mesMostrado = hoy.getMonth();
let anioMostrado = hoy.getFullYear();

const idUsuario = Number(localStorage.getItem("idUsuario")) || null;


/* ---------- GRUPO FAMILIAR ---------- */

function leerGrupo() {
    try {
        return JSON.parse(localStorage.getItem("grupoFamiliar")) || {};
    } catch (error) {
        return {};
    }
}

let grupo = leerGrupo();

// Cada grupo tiene su propia agenda en el navegador
function claveEventos() {
    return grupo.idGrupo ? "eventosCompartidos_" + grupo.idGrupo : "eventosCompartidos";
}

function claveEliminados() {
    return claveEventos() + "_eliminados";
}


/* ---------- EVENTOS GUARDADOS ---------- */
/* Formato: [{ id, fecha: "2026-10-15", nombre: "Turno neurólogo", hora, tipo, descripcion }]
   Tipos: turno, estudio, terapia, medicacion, control */

function leerLista(clave) {
    try {
        const lista = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        return [];
    }
}

let eventos = leerLista(claveEventos());

function guardarEventosLocales() {
    localStorage.setItem(claveEventos(), JSON.stringify(eventos));
}

function idDeEvento(evento) {
    return String(evento.id || evento.idLocal || "srv-" + evento.idEvento);
}

function fechaTexto(anio, mes, dia) {
    return anio + "-" + String(mes + 1).padStart(2, "0") + "-" + String(dia).padStart(2, "0");
}


/* ---------- SERVIDOR ---------- */

async function guardarEnServidor(evento) {
    if (!idUsuario) {
        return false;
    }

    try {
        const respuesta = await fetch(URL_API + "/agenda", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                idLocal: evento.id,
                titulo: evento.nombre,
                fecha: evento.fecha,
                hora: evento.hora,
                tipo: evento.tipo,
                descripcion: evento.descripcion,
                compartido: true,
                idGrupo: grupo.idGrupo || null
            })
        });

        return respuesta.ok;
    } catch (error) {
        console.error("No se pudo guardar el evento en el servidor:", error);
        return false;
    }
}

// Trae los eventos compartidos de todos los integrantes del grupo
async function cargarDelServidor() {
    if (!idUsuario) {
        return;
    }

    try {
        // Si no se sabe el grupo, se le pregunta al servidor
        if (!grupo.idGrupo || !Array.isArray(grupo.integrantes)) {
            const respuesta = await fetch(URL_API + "/grupos-familiares/usuario/" + idUsuario);

            if (respuesta.ok) {
                const grupos = await respuesta.json();
                const delServidor = grupos.find(function (g) {
                    return !grupo.idGrupo || g.idGrupo === grupo.idGrupo;
                });

                if (delServidor) {
                    const habiaGrupo = !!grupo.idGrupo;
                    grupo = Object.assign({}, grupo, delServidor);

                    if (!habiaGrupo) {
                        eventos = leerLista(claveEventos());
                    }
                }
            }
        }

        const integrantes = Array.isArray(grupo.integrantes) && grupo.integrantes.length
            ? grupo.integrantes
            : [idUsuario];

        const eliminados = leerLista(claveEliminados());

        for (const integrante of integrantes) {
            const respuesta = await fetch(URL_API + "/agenda/" + integrante);

            if (!respuesta.ok) {
                continue;
            }

            const delIntegrante = await respuesta.json();

            delIntegrante
                .filter(function (evento) {
                    return evento.compartido && (evento.idGrupo || null) === (grupo.idGrupo || null);
                })
                .forEach(function (evento) {
                    const id = idDeEvento(evento);
                    const yaEsta = eventos.some(function (e) { return idDeEvento(e) === id; });

                    if (!yaEsta && !eliminados.includes(id)) {
                        eventos.push({
                            id: evento.idLocal || "srv-" + evento.idEvento,
                            nombre: evento.titulo || "Evento",
                            fecha: evento.fecha,
                            hora: evento.hora || "",
                            tipo: evento.tipo || "turno",
                            descripcion: evento.descripcion || ""
                        });
                    }
                });
        }

        // Los que se guardaron con el servidor apagado se suben ahora
        for (const evento of eventos.filter(function (e) { return e.pendiente; })) {
            if (await guardarEnServidor(evento)) {
                delete evento.pendiente;
            }
        }

        guardarEventosLocales();
        dibujarCalendario();
    } catch (error) {
        console.error("No se pudo conectar con el servidor; se muestran los eventos guardados:", error);
    }
}


/* ---------- DIBUJAR EL CALENDARIO ---------- */

function dibujarCalendario() {

    mesActualCompartida.textContent = MESES[mesMostrado] + " " + anioMostrado;
    diasCompartida.innerHTML = "";

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

        const fecha = fechaTexto(anioMostrado, mesMostrado, dia);

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

        // El número del día es un botón: al tocarlo se agrega un evento ese día
        const botonDia = document.createElement("button");
        botonDia.type = "button";
        botonDia.className = "acomp-dia-boton";
        botonDia.setAttribute("aria-label", "Agregar evento el " + dia + " de " + MESES[mesMostrado]);

        const numero = document.createElement("time");
        numero.className = "acomp-numero";
        numero.dateTime = fecha;
        numero.textContent = dia;

        botonDia.appendChild(numero);
        botonDia.addEventListener("click", function (e) {
            e.stopPropagation();
            abrirFormulario(fecha);
        });

        casillero.appendChild(botonDia);

        eventos
            .filter(function (evento) {
                return evento.fecha === fecha;
            })
            .sort(function (a, b) {
                return (a.hora || "").localeCompare(b.hora || "");
            })
            .forEach(function (evento) {
                const etiqueta = document.createElement("button");
                etiqueta.type = "button";
                etiqueta.className = "acomp-evento tipo-" + (evento.tipo || "turno");
                etiqueta.textContent = evento.nombre || "";
                etiqueta.title = evento.nombre || "";

                etiqueta.addEventListener("click", function (e) {
                    e.stopPropagation();
                    mostrarInformacionEvento(evento);
                });

                casillero.appendChild(etiqueta);
            });

        // Tocar cualquier parte vacía del día también abre el formulario
        casillero.addEventListener("click", function () {
            abrirFormulario(fecha);
        });

        diasCompartida.appendChild(casillero);
    }
}


/* ---------- AGREGAR EVENTO ---------- */

function abrirFormulario(fecha) {
    fechaEvento.value = fecha || fechaTexto(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    ventanaEvento.classList.add("mostrar");
    tituloEvento.focus();
}

function cerrarFormulario() {
    ventanaEvento.classList.remove("mostrar");

    tituloEvento.value = "";
    horaEvento.value = "";
    tipoEvento.value = "";
    descripcionEvento.value = "";
}

botonAgregarEvento.addEventListener("click", function () {
    abrirFormulario();
});

cerrarEvento.addEventListener("click", cerrarFormulario);

guardarEvento.addEventListener("click", async function () {

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
        nombre: tituloEvento.value.trim(),
        fecha: fechaEvento.value,
        hora: horaEvento.value,
        tipo: tipoEvento.value || "turno",
        descripcion: descripcionEvento.value.trim()
    };

    // Se guarda en el navegador apenas se toca "Guardar"
    eventos.push(nuevoEvento);
    guardarEventosLocales();

    // Muestra el mes del evento guardado
    const partes = nuevoEvento.fecha.split("-");
    anioMostrado = Number(partes[0]);
    mesMostrado = Number(partes[1]) - 1;

    cerrarFormulario();
    dibujarCalendario();

    // Y en el servidor, para que lo vea el resto de la familia.
    // Si está apagado, queda pendiente y se sube la próxima vez.
    const guardado = await guardarEnServidor(nuevoEvento);

    if (!guardado) {
        nuevoEvento.pendiente = true;
        guardarEventosLocales();
    }
});


/* ---------- VER Y ELIMINAR UN EVENTO ---------- */

function mostrarInformacionEvento(evento) {
    let mensaje =
        evento.nombre + "\n\n" +
        "Tipo: " + (NOMBRES_TIPO[evento.tipo] || evento.tipo) + "\n" +
        "Fecha: " + evento.fecha.split("-").reverse().join("/");

    if (evento.hora) {
        mensaje += "\nHora: " + evento.hora;
    }

    if (evento.descripcion) {
        mensaje += "\n\n" + evento.descripcion;
    }

    if (!confirm(mensaje + "\n\n¿Querés eliminar este evento?")) {
        return;
    }

    const id = idDeEvento(evento);

    eventos = eventos.filter(function (item) {
        return idDeEvento(item) !== id;
    });
    guardarEventosLocales();

    // El servidor no tiene forma de borrar, así que se recuerda que se eliminó
    const eliminados = leerLista(claveEliminados());
    eliminados.push(id);
    localStorage.setItem(claveEliminados(), JSON.stringify(eliminados));

    dibujarCalendario();
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
cargarDelServidor();
