// ==========================================
// PERFIL SENSORIAL DE UN PACIENTE (lo ve el hospital)
// perfil-sensorial-paciente.html?id=<idUsuario del paciente>
// Muestra lo que el paciente cargó en su pantalla "Perfil sensorial":
// GET /api/perfil-sensorial/:idUsuario · GET /api/usuarios/:idUsuario
// ==========================================

const API = "http://localhost:3000/api";
const CLAVE_PACIENTES = "pacientesHospital";

const idPaciente = new URLSearchParams(window.location.search).get("id") || "";

const SIN_DATO = "Sin completar";


function leerPacientes() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_PACIENTES) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

const paciente = leerPacientes().find(function (item) {
    return String(item.idUsuario || item.id) === String(idPaciente);
}) || {};


/* ---------- NIVELES: texto y color de cada uno ---------- */

const NIVELES = {
    hiper: { texto: "Hipersensibilidad", color: "ppu-rojo" },
    alta: { texto: "Sensibilidad Alta", color: "ppu-naranja" },
    media: { texto: "Sensibilidad Media", color: "ppu-azul" },
    normal: { texto: "Tolerancia Normal", color: "ppu-verde" }
};

const COLORES = ["ppu-rojo", "ppu-naranja", "ppu-azul", "ppu-verde", "ppu-sin-dato"];

function mostrarNivel(id, valor) {
    const elemento = document.getElementById(id);
    const nivel = NIVELES[valor];

    elemento.classList.remove.apply(elemento.classList, COLORES);
    elemento.textContent = nivel ? nivel.texto : SIN_DATO;
    elemento.classList.add(nivel ? nivel.color : "ppu-sin-dato");
}

function mostrarEstrategias(estrategias) {
    const lista = document.getElementById("listaEstrategias");
    lista.innerHTML = "";

    if (estrategias.length === 0) {
        const item = document.createElement("li");
        item.className = "ppu-sin-dato";
        item.textContent = "Sin estrategias cargadas";
        lista.appendChild(item);
        return;
    }

    estrategias.forEach(function (estrategia) {
        const item = document.createElement("li");
        item.textContent = estrategia;
        lista.appendChild(item);
    });
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


/* ---------- CARGAR ---------- */

async function cargarPerfil() {
    let usuario = {};
    let perfil = {};

    if (/^\d+$/.test(idPaciente)) {
        [usuario, perfil] = await Promise.all([
            pedir("/usuarios/" + idPaciente),
            pedir("/perfil-sensorial/" + idPaciente)
        ]);
    }

    document.getElementById("nombrePaciente").textContent =
        usuario.nombre || paciente.nombre || "Paciente sin nombre";

    mostrarNivel("datoRuido", perfil.ruido);
    mostrarNivel("datoLuces", perfil.luces);
    mostrarNivel("datoTexturas", perfil.texturas);
    mostrarNivel("datoOlores", perfil.olores);
    mostrarNivel("datoTemperatura", perfil.temperatura);
    mostrarNivel("datoContacto", perfil.contacto || perfil.contactoFisico);

    const estrategias = Array.isArray(perfil.estrategias)
        ? perfil.estrategias
        : String(perfil.ayudasSobrecarga || "").split(", ").filter(Boolean);

    mostrarEstrategias(estrategias);

    const observaciones = document.getElementById("datoObservaciones");
    observaciones.textContent = perfil.observaciones
        ? "“" + perfil.observaciones + "”"
        : "Sin observaciones";
}


/* ---------- VOLVER Y MENÚ DE PERFIL ---------- */

document.getElementById("botonAtras").addEventListener("click", function () {
    window.location.href = "pacientes.html";
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
