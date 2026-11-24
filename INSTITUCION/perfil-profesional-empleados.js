// ==========================================
// PERFIL PROFESIONAL DE UN EMPLEADO (lo ve la empresa)
// perfil-profesional-empleados.html?id=<id del empleado en la lista>
// Muestra lo que el empleado cargó en "Preferencias laborales":
// GET /api/usuarios/:codigo · GET /api/preferencias-trabajo/:codigo
// ==========================================

const API = "http://localhost:3000/api";
const CLAVE_EMPLEADOS = "empleadosInstitucion";

const idEmpleado = new URLSearchParams(window.location.search).get("id") || "";

const SIN_DATO = "Sin completar";


function leerEmpleados() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_EMPLEADOS) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

const empleado = leerEmpleados().find(function (item) {
    return String(item.id) === String(idEmpleado);
}) || {};

// El código del empleado es su número de usuario en NeuroPassport
const codigoEmpleado = String(empleado.codigo || "").trim();


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
    let preferencias = {};

    if (codigoEmpleado) {
        [usuario, preferencias] = await Promise.all([
            pedir("/usuarios/" + encodeURIComponent(codigoEmpleado)),
            pedir("/preferencias-trabajo/" + encodeURIComponent(codigoEmpleado))
        ]);
    }

    document.getElementById("nombreEmpleado").textContent =
        empleado.nombre || usuario.nombre || "Empleado sin nombre";

    mostrarDato("datoModalidad", preferencias.modalidad);
    mostrarDato("datoAmbiente", preferencias.ambienteLaboral || desdeBackend("ambienteTrabajo", preferencias.ambienteTrabajo));
    mostrarDato("datoFormaTrabajo", preferencias.formaTrabajoLaboral || desdeBackend("formaTrabajo", preferencias.formaTrabajo));
    mostrarDato("datoComunicacion", preferencias.comunicacionLaboral || desdeBackend("formaComunicacion", preferencias.formaComunicacion));
    mostrarDato("datoHorario", preferencias.horarioLaboral || preferencias.preferenciaHorario);

    const descripcion = preferencias.enfoque || preferencias.otrasPreferencias;
    mostrarDato("datoDescripcion", descripcion ? "“" + descripcion + "”" : "");
}


/* ---------- DESVINCULAR ---------- */

document.getElementById("botonDesvincular").addEventListener("click", function () {
    const nombre = document.getElementById("nombreEmpleado").textContent;

    if (!window.confirm("¿Querés desvincular a " + nombre + " de la empresa?")) {
        return;
    }

    const restantes = leerEmpleados().filter(function (item) {
        return String(item.id) !== String(idEmpleado);
    });

    localStorage.setItem(CLAVE_EMPLEADOS, JSON.stringify(restantes));
    window.location.href = "empleados.html";
});


/* ---------- VOLVER Y MENÚ DE PERFIL ---------- */

document.getElementById("botonAtras").addEventListener("click", function () {
    window.location.href = "empleados.html";
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
