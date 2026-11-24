// ==========================================
// PERFIL PROFESIONAL DE UN MÉDICO (lo ve el hospital)
// perfil-profesional-medicos.html?id=<id de la persona en la lista>
// Muestra lo que el médico cargó en "Preferencias laborales":
// GET /api/usuarios/:codigo · GET /api/info-personal/:codigo · GET /api/preferencias-trabajo/:codigo
// ==========================================

const API = "http://localhost:3000/api";
const CLAVE_MEDICOS = "medicosHospital";

const idMedico = new URLSearchParams(window.location.search).get("id") || "";

const SIN_DATO = "Sin completar";

const NOMBRES_PROFESION = { medico: "Médico", psicologo: "Psicólogo", terapista: "Terapista", empleado: "Empleado" };


function leerMedicos() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_MEDICOS) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

const medico = leerMedicos().find(function (item) {
    return String(item.id) === String(idMedico);
}) || {};

// El código de la persona es su número de usuario en NeuroPassport
const codigoMedico = String(medico.codigo || "").trim();


// Escribe un dato; si no hay, muestra "Sin completar" en gris
function mostrarDato(id, valor) {
    const elemento = document.getElementById(id);
    const texto = valor === undefined || valor === null ? "" : String(valor).trim();

    elemento.textContent = texto || SIN_DATO;
    elemento.classList.toggle("ppu-sin-dato", !texto);
}

// Datos viejos que solo tienen el valor del backend → texto de las opciones
const DESDE_BACKEND = {
    ambienteTrabajo: { "Tranquilo": "Ambiente tranquilo", "Dinámico": "Ambiente dinámico" },
    formaTrabajo: { "Individual": "Prefiero trabajar solo/a", "En equipo": "Prefiero trabajar en equipo", "Mixto": "Me adapto a ambas" },
    formaComunicacion: { "Escrita": "Comunicación escrita", "Verbal": "Comunicación oral" }
};

function desdeBackend(campo, valor) {
    return DESDE_BACKEND[campo][valor] || "";
}

async function pedir(ruta) {
    try {
        const respuesta = await fetch(API + ruta);
        return respuesta.ok ? await respuesta.json() : {};
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return {};
    }
}


/* ---------- CARGAR EL PERFIL ---------- */

async function cargarPerfil() {
    let usuario = {};
    let info = {};
    let preferencias = {};

    if (codigoMedico) {
        [usuario, info, preferencias] = await Promise.all([
            pedir("/usuarios/" + encodeURIComponent(codigoMedico)),
            pedir("/info-personal/" + encodeURIComponent(codigoMedico)),
            pedir("/preferencias-trabajo/" + encodeURIComponent(codigoMedico))
        ]);
    }

    document.getElementById("nombreMedico").textContent =
        medico.nombre || usuario.nombre || "Profesional sin nombre";

    // Datos profesionales
    mostrarDato("datoEspecialidad", info.especialidad || NOMBRES_PROFESION[usuario.tipoProfesional]);
    mostrarDato("datoMatricula", info.matricula);
    mostrarDato("datoTelefono", info.telefono || info.telFijo);
    mostrarDato("datoCorreo", info.correoProfesional || usuario.email);
    mostrarDato("datoConsultorio", info.consultorio);
    mostrarDato("datoHorarios", info.horarios);

    mostrarDato("datoModalidad", preferencias.modalidad);
    mostrarDato("datoAmbiente", preferencias.ambienteLaboral || desdeBackend("ambienteTrabajo", preferencias.ambienteTrabajo));
    mostrarDato("datoFormaTrabajo", preferencias.formaTrabajoLaboral || desdeBackend("formaTrabajo", preferencias.formaTrabajo));
    mostrarDato("datoComunicacion", preferencias.comunicacionLaboral || desdeBackend("formaComunicacion", preferencias.formaComunicacion));
    mostrarDato("datoHorario", preferencias.horarioLaboral || preferencias.preferenciaHorario);

    const enfoque = preferencias.enfoque || preferencias.otrasPreferencias;
    mostrarDato("datoEnfoque", enfoque ? "“" + enfoque + "”" : "");
}


/* ---------- DESVINCULAR ---------- */

document.getElementById("botonDesvincular").addEventListener("click", function () {
    const nombre = document.getElementById("nombreMedico").textContent;

    if (!window.confirm("¿Querés desvincular a " + nombre + " de la institución?")) {
        return;
    }

    const restantes = leerMedicos().filter(function (item) {
        return String(item.id) !== String(idMedico);
    });

    localStorage.setItem(CLAVE_MEDICOS, JSON.stringify(restantes));
    window.location.href = "medicos.html";
});


/* ---------- VOLVER Y MENÚ DE PERFIL ---------- */

document.getElementById("botonAtras").addEventListener("click", function () {
    window.location.href = "medicos.html";
});

const botonPerfil = document.getElementById("botonPerfil");
const menuPerfil = document.getElementById("menuPerfil");

botonPerfil.addEventListener("click", function (evento) {
    evento.stopPropagation();
    const abierto = menuPerfil.classList.toggle("mostrar");
    botonPerfil.setAttribute("aria-expanded", String(abierto));
});

document.addEventListener("click", function (evento) {
    if (!menuPerfil.contains(evento.target) && !botonPerfil.contains(evento.target)) {
        menuPerfil.classList.remove("mostrar");
        botonPerfil.setAttribute("aria-expanded", "false");
    }
});

document.getElementById("botonCerrarSesion").addEventListener("click", function () {
    window.location.href = "../cerrar-sesion.html";
});


cargarPerfil();


// ==========================================
// FOTO DE PERFIL: se muestra en el botón de perfil
// (es la que se elige en Configuración)
// ==========================================
(function () {
    function mostrarFotoPerfil() {
        const foto = localStorage.getItem("fotoPerfil");
        const botonConFoto = document.getElementById("botonPerfil");

        if (!foto || !botonConFoto) {
            return;
        }

        // "important" para ganarle al color de fondo que tiene el botón en el CSS
        botonConFoto.style.setProperty("background-image", 'url("' + foto + '")', "important");
        botonConFoto.style.setProperty("background-size", "cover", "important");
        botonConFoto.style.setProperty("background-position", "center", "important");
        botonConFoto.style.setProperty("background-repeat", "no-repeat", "important");
        botonConFoto.classList.add("con-foto-perfil");

        // Se oculta el muñequito que está adentro del botón
        Array.from(botonConFoto.children).forEach(function (hijo) {
            hijo.style.setProperty("display", "none", "important");
        });
    }

    // Se aplica cuando la página terminó de cargar, después del resto del código
    if (document.readyState === "complete") {
        mostrarFotoPerfil();
    } else {
        window.addEventListener("load", mostrarFotoPerfil);
    }
})();
