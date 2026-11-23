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


/* ---------- GUARDAR ---------- */

formPerfilSensorial.addEventListener("submit", function (evento) {
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
