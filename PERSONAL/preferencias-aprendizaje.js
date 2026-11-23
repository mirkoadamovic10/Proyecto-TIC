/* ============================= */
/* PREFERENCIAS DE APRENDIZAJE - NeuroPassport */
/* POST /api/perfil-educativo · GET /api/perfil-educativo/:idUsuario */
/* ============================= */

const API_PERFIL_EDUCATIVO = "http://localhost:3000/api/perfil-educativo";
const CLAVE_LOCAL = "preferenciasAprendizaje";

const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

const formPreferencias = document.getElementById("formPreferencias");
const botonesModalidad = document.querySelectorAll(".papr-opcion-modalidad");
const botonesRecurso = document.querySelectorAll(".papr-opcion-recurso");
const mensajePreferencias = document.getElementById("mensajePreferencias");

const SELECTS = ["formaInstrucciones", "evaluacionesAdaptadas", "tiempoDescansos", "ubicacionAula"];
const TEXTOS = ["fortalezas", "materiasDificultad", "apoyosNecesarios"];

// Perfil que ya está en el servidor (para no pisar otros datos al guardar)
let perfilServidor = {};
let informes = [];


/* ---------- MODALIDAD (una sola) Y RECURSOS (varios) ---------- */

botonesModalidad.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const yaEstaba = boton.getAttribute("aria-pressed") === "true";

        botonesModalidad.forEach(function (otro) {
            otro.setAttribute("aria-pressed", "false");
        });

        boton.setAttribute("aria-pressed", String(!yaEstaba));
    });
});

botonesRecurso.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const activo = boton.getAttribute("aria-pressed") === "true";
        boton.setAttribute("aria-pressed", String(!activo));
    });
});


/* ---------- SELECTORES: gris cuando no hay nada elegido ---------- */

function actualizarColorSelect(select) {
    select.classList.toggle("sin-valor", select.value === "");
}

SELECTS.forEach(function (id) {
    const select = document.getElementById(id);
    select.addEventListener("change", function () { actualizarColorSelect(select); });
    actualizarColorSelect(select);
});


/* ---------- INFORMES ADJUNTOS ---------- */
/* Se guarda el nombre, tamaño y fecha de cada archivo */

const botonAdjuntar = document.getElementById("botonAdjuntar");
const inputInforme = document.getElementById("inputInforme");
const listaInformes = document.getElementById("listaInformes");
const sinInformes = document.getElementById("sinInformes");

function tamanioLegible(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + "MB";
    return Math.max(1, Math.round(bytes / 1024)) + "KB";
}

function mostrarInformes() {
    listaInformes.innerHTML = "";

    informes.forEach(function (informe, indice) {
        const item = document.createElement("li");
        item.className = "papr-archivo";

        const nombre = document.createElement("strong");
        nombre.textContent = informe.nombre;

        const detalle = document.createElement("span");
        detalle.textContent = informe.tamanio + " - Adjuntado el " + informe.fecha;

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "papr-quitar";
        quitar.textContent = "X";
        quitar.setAttribute("aria-label", "Quitar " + informe.nombre);

        quitar.addEventListener("click", function () {
            informes.splice(indice, 1);
            mostrarInformes();
        });

        item.append(nombre, detalle, quitar);
        listaInformes.appendChild(item);
    });

    sinInformes.hidden = informes.length > 0;
}

botonAdjuntar.addEventListener("click", function () {
    inputInforme.click();
});

inputInforme.addEventListener("change", function () {
    Array.from(inputInforme.files).forEach(function (archivo) {
        informes.push({
            nombre: archivo.name,
            tamanio: tamanioLegible(archivo.size),
            fecha: new Date().toLocaleDateString("es-AR")
        });
    });

    inputInforme.value = "";
    mostrarInformes();
});


/* ---------- CARGAR LO GUARDADO ---------- */

function completarFormulario(datos) {
    botonesModalidad.forEach(function (boton) {
        boton.setAttribute("aria-pressed", String(boton.textContent.trim() === datos.modalidad));
    });

    const recursos = Array.isArray(datos.recursos)
        ? datos.recursos
        : String(datos.tecnologiaAsistiva || "").split(", ").filter(Boolean);

    botonesRecurso.forEach(function (boton) {
        boton.setAttribute("aria-pressed", String(recursos.includes(boton.textContent.trim())));
    });

    SELECTS.forEach(function (id) {
        const select = document.getElementById(id);
        if (datos[id]) select.value = datos[id];
        actualizarColorSelect(select);
    });

    TEXTOS.forEach(function (id) {
        if (datos[id]) document.getElementById(id).value = datos[id];
    });

    if (Array.isArray(datos.listaInformes)) {
        informes = datos.listaInformes;
    }

    mostrarInformes();
}

async function cargarPreferencias() {
    if (idUsuario) {
        try {
            const respuesta = await fetch(`${API_PERFIL_EDUCATIVO}/${idUsuario}`);

            if (respuesta.ok) {
                perfilServidor = await respuesta.json();
                completarFormulario(perfilServidor);
                return;
            }
        } catch (error) {
            console.error("No se pudieron cargar las preferencias del servidor:", error);
        }
    }

    // Sin servidor: lo guardado en este navegador
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_LOCAL));
        if (guardado) completarFormulario(guardado);
        else mostrarInformes();
    } catch (error) {
        mostrarInformes();
    }
}


/* ---------- GUARDAR ---------- */

formPreferencias.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const modalidad = Array.from(botonesModalidad).find(function (boton) {
        return boton.getAttribute("aria-pressed") === "true";
    });

    const recursos = Array.from(botonesRecurso)
        .filter(function (boton) { return boton.getAttribute("aria-pressed") === "true"; })
        .map(function (boton) { return boton.textContent.trim(); });

    const datos = {
        modalidad: modalidad ? modalidad.textContent.trim() : "",
        recursos: recursos,
        listaInformes: informes
    };

    SELECTS.forEach(function (id) { datos[id] = document.getElementById(id).value; });
    TEXTOS.forEach(function (id) { datos[id] = document.getElementById(id).value.trim(); });

    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(datos));

    if (!idUsuario) {
        mensajePreferencias.textContent = "Preferencias guardadas en este navegador (no hay sesión iniciada).";
        return;
    }

    // Campos del backend (PerfilEducativo) + lo de esta pantalla
    const cuerpo = Object.assign({}, perfilServidor, datos, {
        idUsuario: idUsuario,
        preferenciasAprendizaje: datos.modalidad,
        evaluacionesAdaptadas: datos.evaluacionesAdaptadas,
        tiempoExtra: datos.tiempoDescansos === "tiempo-extra" || datos.tiempoDescansos === "ambos",
        tecnologiaAsistiva: recursos.join(", "),
        fortalezas: datos.fortalezas,
        materiasDificultad: datos.materiasDificultad,
        apoyosNecesarios: datos.apoyosNecesarios,
        informes: informes.map(function (informe) { return informe.nombre; }).join(", ")
    });

    try {
        const respuesta = await fetch(API_PERFIL_EDUCATIVO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpo)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            throw new Error(error.error || "No se pudieron guardar las preferencias.");
        }

        perfilServidor = cuerpo;
        mensajePreferencias.textContent = "¡Preferencias guardadas correctamente!";
    } catch (error) {
        console.error(error);
        mensajePreferencias.textContent = error.message || "No se pudo conectar con el servidor.";
    }
});


/* ---------- VOLVER ---------- */

document.getElementById("botonAtrasPreferencias").addEventListener("click", function () {
    if (document.referrer && window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "./personal.html";
    }
});


cargarPreferencias();
