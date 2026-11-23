/* ============================= */
/* FAMILIA HOME - NeuroPassport  */
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


/* ---------- TARJETAS ---------- */

document.querySelectorAll(".fhome-boton").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const pagina = boton.getAttribute("data-pagina");

        if (pagina) {
            window.location.href = pagina;
        }
    });
});
