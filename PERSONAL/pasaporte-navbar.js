/* ============================= */
/* NAVBAR DE LAS OPCIONES DEL PASAPORTE - NeuroPassport */
/* Va todo adentro de una función para no chocar con pasaporte.js */
/* ============================= */

(function () {

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

        document.addEventListener("click", function (evento) {
            if (!submenuPerfil.contains(evento.target)) {
                submenuPerfil.classList.remove("activo");
                botonPerfil.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* ---------- VOLVER ---------- */

    const botonAtrasOpcion = document.getElementById("botonAtrasOpcion");

    if (botonAtrasOpcion) {
        botonAtrasOpcion.addEventListener("click", function () {
            if (document.referrer && window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "./personal.html";
            }
        });
    }


    /* ---------- FORMULARIO ---------- */
    /* Que apretar Enter en un campo no recargue la página */

    const formularioAgregar = document.getElementById("formularioAgregar");

    if (formularioAgregar) {
        formularioAgregar.addEventListener("submit", function (evento) {
            evento.preventDefault();
        });
    }

})();
