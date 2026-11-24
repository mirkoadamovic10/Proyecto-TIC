/* ============================= */
/* PERFIL SENSORIAL - NeuroPassport */
/* ============================= */

/* ---------- MODAL PASAPORTE ---------- */

const botonPasaporte = document.getElementById("botonPasaporte");
const submenuPasaporte = document.getElementById("submenuPasaporte");
const cerrarPasaporte = document.getElementById("cerrarPasaporte");

function abrirPasaporte() {
    submenuPasaporte.hidden = false;
    botonPasaporte.setAttribute("aria-expanded", "true");
}

function cerrarModalPasaporte() {
    submenuPasaporte.hidden = true;
    botonPasaporte.setAttribute("aria-expanded", "false");
    botonPasaporte.focus();
}

if (botonPasaporte && submenuPasaporte) {

    botonPasaporte.addEventListener("click", function () {
        if (submenuPasaporte.hidden) {
            abrirPasaporte();
        } else {
            cerrarModalPasaporte();
        }
    });

    if (cerrarPasaporte) {
        cerrarPasaporte.addEventListener("click", cerrarModalPasaporte);
    }

    // Cerrar tocando afuera del panel
    submenuPasaporte.addEventListener("click", function (evento) {
        if (evento.target === submenuPasaporte) {
            cerrarModalPasaporte();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !submenuPasaporte.hidden) {
            cerrarModalPasaporte();
        }
    });
}

const pantallas = {
    "Diagnósticos": "diagnosticos.html",
    "Medicación": "medicacion.html",
    "Alergias": "alergias.html",
    "Estudios": "estudios.html",
    "Terapias": "terapias.html",
    "Cirugías": "cirugias.html",
    "Contactos": "contactos.html",
    "Cobertura médica": "cobertura.html",
    "Certificados": "certificados.html",
    "Adaptaciones": "adaptaciones.html",
    "Objetivos": "objetivos.html",
    "Preferencias de aprendizaje": "preferencias-aprendizaje.html",
    "Formas de comunicación": "formas-comunicacion.html"
};

document.querySelectorAll(".boton-pasaporte").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const pagina = pantallas[boton.textContent.trim()];

        if (pagina) {
            submenuPasaporte.hidden = true;
            window.location.href = pagina;
        }
    });
});


/* ---------- SUBMENU PERFIL ---------- */

const botonPerfil = document.getElementById("botonPerfil");
const submenuPerfil = document.getElementById("submenuPerfil");

if (botonPerfil && submenuPerfil) {

    botonPerfil.addEventListener("click", function (evento) {
        evento.stopPropagation();
        const abierto = submenuPerfil.classList.toggle("activo");
        botonPerfil.setAttribute("aria-expanded", String(abierto));
    });

    submenuPerfil.querySelectorAll("button").forEach(function (opcion) {
        opcion.addEventListener("click", function () {
            const pagina = opcion.getAttribute("data-pagina");

            if (pagina) {
                window.location.href = pagina;
            }
        });
    });

    // Cerrar el submenú tocando en cualquier otro lado
    document.addEventListener("click", function (evento) {
        if (!submenuPerfil.contains(evento.target)) {
            submenuPerfil.classList.remove("activo");
            botonPerfil.setAttribute("aria-expanded", "false");
        }
    });
}

// Foto de perfil guardada
const fotoPerfil = localStorage.getItem("fotoPerfil");

if (botonPerfil && fotoPerfil) {
    const imagenPerfil = document.createElement("img");

    imagenPerfil.src = fotoPerfil;
    imagenPerfil.alt = "Foto de perfil";
    imagenPerfil.classList.add("imagen-perfil");

    const cabeza = botonPerfil.querySelector(".perfil-cabeza");
    const cuerpo = botonPerfil.querySelector(".perfil-cuerpo");

    if (cabeza) cabeza.style.display = "none";
    if (cuerpo) cuerpo.style.display = "none";

    botonPerfil.appendChild(imagenPerfil);
}


/* ---------- VOLVER ---------- */

const botonAtrasPerfil = document.getElementById("botonAtrasPerfil");

if (botonAtrasPerfil) {
    botonAtrasPerfil.addEventListener("click", function () {
        window.location.href = "./personas-familia.html";
    });
}


/* ---------- NOMBRE DE LA PERSONA ---------- */
/* Llega en la dirección: perfil-sensorial.html?nombre=Juan */

const parametros = new URLSearchParams(window.location.search);

// Si no viene un nombre (por ejemplo, desde el menú de perfil), es el propio usuario
const nombrePersona = (
    parametros.get("nombre") ||
    localStorage.getItem("nombreUsuario") ||
    ""
).trim();
const nombrePerfilSensorial = document.getElementById("nombrePerfilSensorial");

if (nombrePerfilSensorial && nombrePersona) {
    nombrePerfilSensorial.textContent = nombrePersona;
    document.title = "NeuroPassport - Perfil sensorial de " + nombrePersona;
}


/* ---------- DATOS DEL PERFIL SENSORIAL ---------- */
/* Se cargan desde "Perfil sensorial" en el menú de perfil de Personal */

const NIVELES = {
    hiper: { texto: "Hipersensibilidad", clase: "nivel-hiper" },
    alta: { texto: "Sensibilidad Alta", clase: "nivel-alta" },
    media: { texto: "Sensibilidad Media", clase: "nivel-media" },
    normal: { texto: "Tolerancia Normal", clase: "nivel-normal" }
};

function leerPerfilSensorial(nombre) {
    try {
        const perfiles = JSON.parse(localStorage.getItem("perfilesSensoriales")) || {};
        return perfiles[nombre.trim().toLowerCase()] || null;
    } catch (error) {
        return null;
    }
}

let perfil = nombrePersona ? leerPerfilSensorial(nombrePersona) : null;

function mostrarPerfil() {
    // Niveles de sensibilidad
    document.querySelectorAll("[data-campo]").forEach(function (casilla) {
        const nivel = perfil && NIVELES[perfil[casilla.dataset.campo]];

        if (nivel) {
            casilla.textContent = nivel.texto;
            casilla.className = "psen-nivel " + nivel.clase;
        }
    });

    // Estrategias
    const listaEstrategias = document.getElementById("listaEstrategias");
    const sinEstrategias = document.getElementById("sinEstrategias");
    const estrategias = perfil && Array.isArray(perfil.estrategias) ? perfil.estrategias : [];

    listaEstrategias.innerHTML = "";

    estrategias.forEach(function (estrategia) {
        const item = document.createElement("li");
        const etiqueta = document.createElement("span");

        etiqueta.className = "psen-estrategia";
        etiqueta.textContent = estrategia;

        item.appendChild(etiqueta);
        listaEstrategias.appendChild(item);
    });

    listaEstrategias.hidden = estrategias.length === 0;
    sinEstrategias.hidden = estrategias.length > 0;

    // Observaciones
    const textoObservaciones = document.getElementById("textoObservaciones");

    if (perfil && perfil.observaciones) {
        textoObservaciones.textContent = '"' + perfil.observaciones + '"';
    }
}

mostrarPerfil();

// Si es el perfil propio, se trae la versión guardada en el servidor (GET /api/perfil-sensorial/:idUsuario)
(async function () {
    const idPropio = Number(localStorage.getItem("idUsuario")) || null;
    const nombrePropio = (localStorage.getItem("nombreUsuario") || "").trim().toLowerCase();

    if (!idPropio || nombrePersona.toLowerCase() !== nombrePropio) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/api/perfil-sensorial/${idPropio}`);

        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        perfil = Object.assign({}, datos, {
            contacto: datos.contacto || datos.contactoFisico || "",
            estrategias: Array.isArray(datos.estrategias)
                ? datos.estrategias
                : String(datos.ayudasSobrecarga || "").split(", ").filter(Boolean)
        });

        mostrarPerfil();
    } catch (error) {
        console.error("No se pudo cargar el perfil sensorial del servidor:", error);
    }
})();


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
