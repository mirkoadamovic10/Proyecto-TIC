// ==========================================
// PREFERENCIAS LABORALES (médico, psicólogo y empleado)
// Datos profesionales  → /api/info-personal       (se suman a lo que ya había)
// Modalidad y entorno  → /api/preferencias-trabajo (se suman a lo que ya había)
// ==========================================

const API = "http://localhost:3000/api";
const CLAVE_LOCAL = "preferenciasLaborales";

const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

const formulario = document.getElementById("formLaborales");
const mensaje = document.getElementById("mensajeLaborales");
const botonesModalidad = document.querySelectorAll(".plab-modalidad");

const CAMPOS_PROFESIONALES = ["especialidad", "matricula", "telefono", "correoProfesional", "consultorio", "horarios"];
const SELECTS_ENTORNO = ["ambienteTrabajo", "formaTrabajo", "formaComunicacion", "preferenciaHorario"];

// Lo que ya está guardado en el servidor, para no borrar otros datos al guardar
let infoServidor = {};
let preferenciasServidor = {};


/* ---------- EQUIVALENCIAS CON EL BACKEND ---------- */
/* El backend solo acepta ciertos valores; lo elegido en pantalla se guarda aparte */

const A_BACKEND = {
    ambienteTrabajo: { "Ambiente tranquilo": "Tranquilo", "Ambiente dinámico": "Dinámico" },
    formaTrabajo: { "Prefiero trabajar solo/a": "Individual", "Prefiero trabajar en equipo": "En equipo", "Me adapto a ambas": "Mixto" },
    formaComunicacion: { "Comunicación escrita": "Escrita", "Comunicación oral": "Verbal" },
    preferenciaHorario: { "Mañana": "Mañana", "Tarde": "Tarde", "Noche": "Noche", "Horario flexible": "Horario flexible" }
};

// Para leer datos viejos que solo tienen el valor del backend
function desdeBackend(campo, valor) {
    const equivalencias = A_BACKEND[campo];

    return Object.keys(equivalencias).find(function (texto) {
        return equivalencias[texto] === valor;
    }) || "";
}


/* ---------- MODALIDAD (una sola) ---------- */

botonesModalidad.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const yaEstaba = boton.getAttribute("aria-pressed") === "true";

        botonesModalidad.forEach(function (otro) {
            otro.setAttribute("aria-pressed", "false");
        });

        boton.setAttribute("aria-pressed", String(!yaEstaba));
    });
});

function modalidadElegida() {
    const boton = Array.from(botonesModalidad).find(function (b) {
        return b.getAttribute("aria-pressed") === "true";
    });
    return boton ? boton.textContent.trim() : "";
}


/* ---------- DESPLEGABLES: gris si no hay nada elegido ---------- */

function actualizarColor(select) {
    select.classList.toggle("sin-valor", select.value === "");
}

document.querySelectorAll(".plab-campo select").forEach(function (select) {
    select.addEventListener("change", function () { actualizarColor(select); });
    actualizarColor(select);
});

function ponerValor(id, valor) {
    const campo = document.getElementById(id);
    const texto = valor === undefined || valor === null ? "" : String(valor);

    if (campo.tagName === "SELECT") {
        const existe = Array.from(campo.options).some(function (opcion) { return opcion.value === texto; });
        campo.value = existe ? texto : "";
        actualizarColor(campo);
    } else {
        campo.value = texto;
    }
}


/* ---------- CARGAR LO GUARDADO ---------- */

function completarFormulario(datos) {
    CAMPOS_PROFESIONALES.forEach(function (id) { ponerValor(id, datos[id]); });
    SELECTS_ENTORNO.forEach(function (id) { ponerValor(id, datos[id]); });
    ponerValor("enfoque", datos.enfoque);

    botonesModalidad.forEach(function (boton) {
        boton.setAttribute("aria-pressed", String(boton.textContent.trim() === datos.modalidad));
    });
}

async function pedir(ruta) {
    const respuesta = await fetch(API + ruta);
    return respuesta.ok ? respuesta.json() : {};
}

async function cargar() {
    let local = {};

    try {
        local = JSON.parse(localStorage.getItem(CLAVE_LOCAL)) || {};
    } catch (error) {
        local = {};
    }

    if (!idUsuario) {
        completarFormulario(local);
        return;
    }

    try {
        const [usuario, info, preferencias] = await Promise.all([
            pedir("/usuarios/" + idUsuario),
            pedir("/info-personal/" + idUsuario),
            pedir("/preferencias-trabajo/" + idUsuario)
        ]);

        infoServidor = info;
        preferenciasServidor = preferencias;

        completarFormulario({
            especialidad: info.especialidad,
            matricula: info.matricula,
            telefono: info.telefono || info.telFijo,
            correoProfesional: info.correoProfesional || usuario.email,
            consultorio: info.consultorio,
            horarios: info.horarios,
            modalidad: preferencias.modalidad,
            ambienteTrabajo: preferencias.ambienteLaboral || desdeBackend("ambienteTrabajo", preferencias.ambienteTrabajo),
            formaTrabajo: preferencias.formaTrabajoLaboral || desdeBackend("formaTrabajo", preferencias.formaTrabajo),
            formaComunicacion: preferencias.comunicacionLaboral || desdeBackend("formaComunicacion", preferencias.formaComunicacion),
            preferenciaHorario: preferencias.horarioLaboral || desdeBackend("preferenciaHorario", preferencias.preferenciaHorario),
            enfoque: preferencias.enfoque || preferencias.otrasPreferencias
        });
    } catch (error) {
        console.error("No se pudieron cargar las preferencias del servidor:", error);
        completarFormulario(local);
    }
}


/* ---------- GUARDAR ---------- */

async function enviar(ruta, cuerpo) {
    const respuesta = await fetch(API + ruta, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}));
        throw new Error(error.error || "No se pudo guardar la información.");
    }
}

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const datos = { modalidad: modalidadElegida() };

    CAMPOS_PROFESIONALES.concat(SELECTS_ENTORNO, ["enfoque"]).forEach(function (id) {
        datos[id] = document.getElementById(id).value.trim();
    });

    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(datos));

    if (!idUsuario) {
        mensaje.textContent = "Información guardada en este navegador (no hay sesión iniciada).";
        return;
    }

    const info = Object.assign({}, infoServidor, {
        idUsuario: idUsuario,
        especialidad: datos.especialidad,
        matricula: datos.matricula,
        telefono: datos.telefono,
        correoProfesional: datos.correoProfesional,
        consultorio: datos.consultorio,
        horarios: datos.horarios
    });

    const preferencias = Object.assign({}, preferenciasServidor, {
        idUsuario: idUsuario,

        // Campos del backend
        ambienteTrabajo: A_BACKEND.ambienteTrabajo[datos.ambienteTrabajo] || "",
        formaTrabajo: A_BACKEND.formaTrabajo[datos.formaTrabajo] || "",
        formaComunicacion: A_BACKEND.formaComunicacion[datos.formaComunicacion] || "",
        preferenciaHorario: A_BACKEND.preferenciaHorario[datos.preferenciaHorario] || "",

        // Lo elegido en esta pantalla, tal cual
        modalidad: datos.modalidad,
        ambienteLaboral: datos.ambienteTrabajo,
        formaTrabajoLaboral: datos.formaTrabajo,
        comunicacionLaboral: datos.formaComunicacion,
        horarioLaboral: datos.preferenciaHorario,
        enfoque: datos.enfoque
    });

    try {
        await enviar("/info-personal", info);
        await enviar("/preferencias-trabajo", preferencias);

        infoServidor = info;
        preferenciasServidor = preferencias;
        mensaje.textContent = "¡Información guardada correctamente!";
    } catch (error) {
        console.error(error);
        mensaje.textContent = error.message || "No se pudo conectar con el servidor.";
    }
});


/* ---------- VOLVER ---------- */

document.getElementById("botonAtrasLaborales").addEventListener("click", function () {
    if (document.referrer && window.history.length > 1) {
        window.history.back();
        return;
    }

    const inicios = {
        medico: "MEDICO/medico.html",
        psicologo: "PSICOLOGO/psicologo.html",
        empleado: "EMPLEADO/empleado.html"
    };

    window.location.href = inicios[localStorage.getItem("tipoProfesional")] || "MEDICO/medico.html";
});


cargar();
