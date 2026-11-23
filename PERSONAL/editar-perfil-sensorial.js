/* ============================= */
/* EDITAR PERFIL SENSORIAL - NeuroPassport */
/* ============================= */

const CAMPOS = ["ruido", "luces", "texturas", "olores", "temperatura", "contacto"];

const formPerfilSensorial = document.getElementById("formPerfilSensorial");
const observacionesPerfil = document.getElementById("observacionesPerfil");
const botonesEstrategia = document.querySelectorAll(".epsen-estrategia");
const botonAtrasEditar = document.getElementById("botonAtrasEditar");

// Nombre de la cuenta actual
function nombreUsuarioActual() {
    const nombre = (localStorage.getItem("nombreUsuario") || "").trim();

    if (nombre) {
        return nombre;
    }

    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        return usuario && usuario.nombre ? usuario.nombre.trim() : "";
    } catch (error) {
        return "";
    }
}

function leerPerfiles() {
    try {
        return JSON.parse(localStorage.getItem("perfilesSensoriales")) || {};
    } catch (error) {
        return {};
    }
}

const nombre = nombreUsuarioActual();
const clave = nombre.toLowerCase();


/* ---------- SELECTORES ---------- */

function actualizarColorSelect(select) {
    select.classList.toggle("sin-valor", select.value === "");
}

CAMPOS.forEach(function (campo) {
    const select = document.getElementById("nivel-" + campo);
    select.addEventListener("change", function () {
        actualizarColorSelect(select);
    });
});


/* ---------- ESTRATEGIAS (se prenden y apagan al tocarlas) ---------- */

botonesEstrategia.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const activo = boton.getAttribute("aria-pressed") === "true";
        boton.setAttribute("aria-pressed", String(!activo));
    });
});


/* ---------- CARGAR LO QUE YA ESTABA GUARDADO ---------- */

const guardado = leerPerfiles()[clave];

CAMPOS.forEach(function (campo) {
    const select = document.getElementById("nivel-" + campo);

    if (guardado && guardado[campo]) {
        select.value = guardado[campo];
    }

    actualizarColorSelect(select);
});

if (guardado) {
    const elegidas = Array.isArray(guardado.estrategias) ? guardado.estrategias : [];

    botonesEstrategia.forEach(function (boton) {
        boton.setAttribute("aria-pressed", String(elegidas.includes(boton.textContent.trim())));
    });

    observacionesPerfil.value = guardado.observaciones || "";
}


/* ---------- API: /api/perfil-sensorial ---------- */

const API_PERFIL = "http://localhost:3000/api/perfil-sensorial";
const idUsuarioActual = Number(localStorage.getItem("idUsuario")) || null;

// Perfil que ya está en el servidor (para no pisar las adaptaciones del pasaporte)
let perfilServidor = null;

async function cargarDesdeServidor() {
    if (!idUsuarioActual) return;

    try {
        const respuesta = await fetch(`${API_PERFIL}/${idUsuarioActual}`);

        if (!respuesta.ok) return;

        perfilServidor = await respuesta.json();

        // El backend usa "contactoFisico"; la pantalla usa "contacto"
        const datos = Object.assign({}, perfilServidor, {
            contacto: perfilServidor.contacto || perfilServidor.contactoFisico || ""
        });

        CAMPOS.forEach(function (campo) {
            const select = document.getElementById("nivel-" + campo);

            if (datos[campo]) {
                select.value = datos[campo];
            }

            actualizarColorSelect(select);
        });

        const elegidas = Array.isArray(datos.estrategias)
            ? datos.estrategias
            : String(datos.ayudasSobrecarga || "").split(", ").filter(Boolean);

        botonesEstrategia.forEach(function (boton) {
            boton.setAttribute("aria-pressed", String(elegidas.includes(boton.textContent.trim())));
        });

        if (datos.observaciones) {
            observacionesPerfil.value = datos.observaciones;
        }
    } catch (error) {
        console.error("No se pudo cargar el perfil sensorial del servidor:", error);
    }
}

async function guardarEnServidor(datos) {
    if (!idUsuarioActual) return;

    const cuerpo = Object.assign({}, perfilServidor || {}, datos, {
        idUsuario: idUsuarioActual,
        contactoFisico: datos.contacto,
        ayudasSobrecarga: datos.estrategias.join(", ")
    });

    const respuesta = await fetch(API_PERFIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo guardar el perfil sensorial en el servidor.");
    }
}

cargarDesdeServidor();


/* ---------- GUARDAR ---------- */

formPerfilSensorial.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const datos = {
        nombre: nombre,
        estrategias: [],
        observaciones: observacionesPerfil.value.trim()
    };

    CAMPOS.forEach(function (campo) {
        datos[campo] = document.getElementById("nivel-" + campo).value;
    });

    botonesEstrategia.forEach(function (boton) {
        if (boton.getAttribute("aria-pressed") === "true") {
            datos.estrategias.push(boton.textContent.trim());
        }
    });

    const perfiles = leerPerfiles();
    perfiles[clave] = datos;
    localStorage.setItem("perfilesSensoriales", JSON.stringify(perfiles));

    try {
        await guardarEnServidor(datos);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }

    // Muestra cómo quedó el perfil
    window.location.href = "./perfil-sensorial.html" + (nombre ? "?nombre=" + encodeURIComponent(nombre) : "");
});


/* ---------- VOLVER ---------- */

// Vuelve a la pantalla desde donde se abrió (Personal o Familia)
botonAtrasEditar.addEventListener("click", function () {
    if (document.referrer && window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "./personal.html";
    }
});
