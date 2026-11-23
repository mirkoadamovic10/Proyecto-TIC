/* ============================= */
/* PERSONAS FAMILIA - NeuroPassport */
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

const botonAtras = document.getElementById("botonAtras");

if (botonAtras) {
    botonAtras.addEventListener("click", function () {
        window.location.href = "./familia-home.html";
    });
}


/* ---------- NOMBRE DEL USUARIO ---------- */

function obtenerNombreUsuario() {

    // Nombre de la cuenta actual: se actualiza al registrarse,
    // al iniciar sesión y al cambiarlo en Configuración
    const nombreActual = (localStorage.getItem("nombreUsuario") || "").trim();

    if (nombreActual) {
        return nombreActual;
    }

    // Si no hay, se usan los datos del inicio de sesión
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (usuario && usuario.nombre) {
            return usuario.nombre;
        }
    } catch (error) {
        // sin datos
    }

    return "";
}

const nombreUsuarioFamilia = document.getElementById("nombreUsuarioFamilia");

if (nombreUsuarioFamilia) {
    const nombre = obtenerNombreUsuario().trim();
    nombreUsuarioFamilia.textContent = (nombre || "Vos") + "\u00A0 (Tú)";
}


/* ---------- POP UP CÓDIGO DE FAMILIA ---------- */

const botonCodigoFamilia = document.getElementById("botonCodigoFamilia");
const modalCodigoFamilia = document.getElementById("modalCodigoFamilia");
const codigoFamilia = document.getElementById("codigoFamilia");
const botonCopiarCodigo = document.getElementById("botonCopiarCodigo");
const estadoCopiado = document.getElementById("estadoCopiado");

function leerCodigoFamilia() {
    try {
        const grupo = JSON.parse(localStorage.getItem("grupoFamiliar"));
        return grupo && grupo.codigo ? grupo.codigo : "";
    } catch (error) {
        return "";
    }
}

function abrirCodigoFamilia() {
    codigoFamilia.value = leerCodigoFamilia();
    estadoCopiado.textContent = "";
    modalCodigoFamilia.hidden = false;
    botonCopiarCodigo.focus();
}

function cerrarCodigoFamilia() {
    modalCodigoFamilia.hidden = true;
    botonCodigoFamilia.focus();
}

if (botonCodigoFamilia && modalCodigoFamilia) {

    botonCodigoFamilia.addEventListener("click", abrirCodigoFamilia);

    // Cerrar tocando afuera del pop up
    modalCodigoFamilia.addEventListener("click", function (evento) {
        if (evento.target === modalCodigoFamilia) {
            cerrarCodigoFamilia();
        }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !modalCodigoFamilia.hidden) {
            cerrarCodigoFamilia();
        }
    });
}

// Copiar el código
if (botonCopiarCodigo) {

    botonCopiarCodigo.addEventListener("click", function () {

        const codigo = codigoFamilia.value.trim();

        if (!codigo) {
            estadoCopiado.textContent = "Todavía no hay un código cargado.";
            return;
        }

        function avisarCopiado() {
            estadoCopiado.textContent = "¡Código copiado!";
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(codigo).then(avisarCopiado).catch(function () {
                codigoFamilia.select();
                document.execCommand("copy");
                avisarCopiado();
            });
        } else {
            codigoFamilia.select();
            document.execCommand("copy");
            avisarCopiado();
        }
    });
}
