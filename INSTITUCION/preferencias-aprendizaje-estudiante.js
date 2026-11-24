// ==========================================
// PREFERENCIAS DE APRENDIZAJE DE UN ESTUDIANTE (lo ve la escuela)
// preferencias-aprendizaje-estudiante.html?id=<id del estudiante en la lista>
// Muestra lo que el estudiante cargó en su pantalla "Preferencias de aprendizaje":
// GET /api/perfil-educativo/:codigo · GET /api/usuarios/:codigo
// ==========================================

const API = "http://localhost:3000/api";
const CLAVE_ESTUDIANTES = "estudiantesInstitucion";

const idEstudiante = new URLSearchParams(window.location.search).get("id") || "";

const SIN_DATO = "Sin completar";


function leerEstudiantes() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_ESTUDIANTES) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

const estudiante = leerEstudiantes().find(function (item) {
    return String(item.id) === String(idEstudiante);
}) || {};

// El código del estudiante es su número de usuario en NeuroPassport
const codigoEstudiante = String(estudiante.codigo || "").replace(/\D/g, "");


/* ---------- TEXTOS DE CADA OPCIÓN ---------- */

const TEXTOS = {
    formaInstrucciones: {
        "escritas": "Instrucciones escritas",
        "orales": "Instrucciones orales",
        "visuales": "Instrucciones con imágenes",
        "paso-a-paso": "Instrucciones cortas paso a paso",
        "combinadas": "Instrucciones combinadas"
    },
    evaluacionesAdaptadas: {
        "orales": "Evaluación oral",
        "escritas-tiempo-extra": "Evaluación escrita con tiempo extra",
        "multiple-opcion": "Evaluación de múltiple opción",
        "trabajos-practicos": "Trabajos prácticos",
        "no-necesito": "Sin evaluaciones adaptadas"
    },
    tiempoDescansos: {
        "tiempo-extra": "Tiempo extra en evaluaciones",
        "pausas": "Pausas cortas frecuentes",
        "ambos": "Tiempo extra y pausas",
        "no-necesito": "Sin adaptación de tiempo"
    },
    ubicacionAula: {
        "adelante": "Asiento adelante",
        "cerca-puerta": "Cerca de la puerta",
        "lejos-ruido": "Lejos de ventanas y ruido",
        "indistinto": "Ubicación indistinta"
    }
};

function texto(campo, valor) {
    return TEXTOS[campo][valor] || "";
}


// Escribe un dato; si no hay, muestra "Sin completar" en gris
function mostrarDato(id, valor) {
    const elemento = document.getElementById(id);
    const contenido = valor === undefined || valor === null ? "" : String(valor).trim();

    elemento.textContent = contenido || SIN_DATO;
    elemento.classList.toggle("ppu-sin-dato", !contenido);
}

function mostrarRecursos(recursos) {
    const lista = document.getElementById("listaRecursos");
    lista.innerHTML = "";

    if (recursos.length === 0) {
        const item = document.createElement("li");
        item.className = "ppu-sin-dato";
        item.textContent = "Sin recursos de apoyo";
        lista.appendChild(item);
        return;
    }

    recursos.forEach(function (recurso) {
        const item = document.createElement("li");
        item.textContent = recurso;
        lista.appendChild(item);
    });
}

function mostrarInformes(informes) {
    const lista = document.getElementById("listaInformes");
    lista.innerHTML = "";

    informes.forEach(function (informe) {
        const item = document.createElement("li");

        const nombre = document.createElement("strong");
        nombre.textContent = informe.nombre || "Informe";

        const detalle = document.createElement("span");
        detalle.textContent = [informe.tamanio, informe.fecha ? "Adjuntado el " + informe.fecha : ""]
            .filter(Boolean)
            .join(" - ");

        item.append(nombre, detalle);
        lista.appendChild(item);
    });

    document.getElementById("sinInformes").hidden = informes.length > 0;
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

async function cargarPreferencias() {
    let usuario = {};
    let perfil = {};

    if (codigoEstudiante) {
        [usuario, perfil] = await Promise.all([
            pedir("/usuarios/" + codigoEstudiante),
            pedir("/perfil-educativo/" + codigoEstudiante)
        ]);
    }

    document.getElementById("nombreEstudiante").textContent =
        estudiante.nombre || usuario.nombre || "Estudiante sin nombre";

    mostrarDato("datoModalidad", perfil.modalidad || perfil.preferenciasAprendizaje);
    mostrarDato("datoInstrucciones", texto("formaInstrucciones", perfil.formaInstrucciones));
    mostrarDato("datoEvaluaciones", texto("evaluacionesAdaptadas", perfil.evaluacionesAdaptadas));
    mostrarDato("datoTiempo", texto("tiempoDescansos", perfil.tiempoDescansos));
    mostrarDato("datoUbicacion", texto("ubicacionAula", perfil.ubicacionAula));
    mostrarDato("datoFortalezas", perfil.fortalezas);
    mostrarDato("datoMaterias", perfil.materiasDificultad);
    mostrarDato("datoApoyos", perfil.apoyosNecesarios);

    const recursos = Array.isArray(perfil.recursos)
        ? perfil.recursos
        : String(perfil.tecnologiaAsistiva || "").split(", ").filter(Boolean);

    mostrarRecursos(recursos);
    mostrarInformes(Array.isArray(perfil.listaInformes) ? perfil.listaInformes : []);
}


/* ---------- DESVINCULAR ---------- */

document.getElementById("botonDesvincular").addEventListener("click", function () {
    const nombre = document.getElementById("nombreEstudiante").textContent;

    if (!window.confirm("¿Querés desvincular a " + nombre + " de la institución?")) {
        return;
    }

    const restantes = leerEstudiantes().filter(function (item) {
        return String(item.id) !== String(idEstudiante);
    });

    localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify(restantes));
    window.location.href = "estudiantes.html";
});


/* ---------- VOLVER Y MENÚ DE PERFIL ---------- */

document.getElementById("botonAtras").addEventListener("click", function () {
    window.location.href = "estudiantes.html";
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


cargarPreferencias();
