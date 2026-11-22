document.addEventListener("DOMContentLoaded", function () {
    // RUTAS POSIBLES: prueba una por una y va a la primera que exista.
    // Cuando sepas la ruta exacta, dejá solo esa en cada lista.
    const RUTAS_CONFIGURACION = [
        "../PERSONAL/configuracion.html",
        "../INSTITUCION/configuracion.html",
        "../PROFESIONAL/configuracion.html",
        "configuracion.html"
    ];

    const RUTAS_INFORMACION_PERSONAL = [
        "../PERSONAL/informacion-personal.html",
        "../INSTITUCION/informacion-personal.html",
        "../PROFESIONAL/informacion-personal.html",
        "informacion-personal.html"
    ];

    const RUTA_CERRAR_SESION = "../index.html";

    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const fotoUsuario = localStorage.getItem("fotoPerfil");

    const saludoHospital = document.getElementById("saludoHospital");
    const perfilHospital = document.getElementById("perfilHospital");
    const menuPerfil = document.getElementById("menuPerfil");

    if (nombreUsuario && saludoHospital) {
        saludoHospital.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
    }

    if (fotoUsuario && perfilHospital) {
        perfilHospital.style.backgroundImage = `url("${fotoUsuario}")`;
        perfilHospital.style.backgroundSize = "cover";
        perfilHospital.style.backgroundPosition = "center";
        perfilHospital.classList.add("tiene-foto");
    }

    if (!menuPerfil) return;

    // Busca la primera ruta que exista en el servidor y navega hacia ella
    async function irAPrimeraRutaQueExista(rutas, nombrePagina) {
        for (const ruta of rutas) {
            try {
                const respuesta = await fetch(ruta, { method: "HEAD" });

                if (respuesta.ok) {
                    window.location.href = ruta;
                    return;
                }
            } catch (error) {
                // se prueba con la siguiente ruta
            }
        }

        alert(
            "No se encontró la página de " + nombrePagina + ".\n\n" +
            "Rutas probadas:\n" + rutas.join("\n")
        );
    }

    const botones = Array.from(menuPerfil.querySelectorAll("button"));
    const btnConfiguracion = botones.find(b => b.textContent.toLowerCase().includes("configur")) || botones[0];
    const btnInfoPersonal = botones.find(b => b.textContent.toLowerCase().includes("informaci")) || botones[1];
    const btnCerrarSesion = botones.find(b => b.textContent.toLowerCase().includes("cerrar")) || botones[2];

    if (btnConfiguracion) {
        btnConfiguracion.removeAttribute("onclick");
        btnConfiguracion.onclick = null;
        btnConfiguracion.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            menuPerfil.hidden = true;
            irAPrimeraRutaQueExista(RUTAS_CONFIGURACION, "configuración");
        });
    }

    if (btnInfoPersonal) {
        btnInfoPersonal.removeAttribute("onclick");
        btnInfoPersonal.onclick = null;
        btnInfoPersonal.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            menuPerfil.hidden = true;
            irAPrimeraRutaQueExista(RUTAS_INFORMACION_PERSONAL, "información personal");
        });
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.removeAttribute("onclick");
        btnCerrarSesion.onclick = null;
        btnCerrarSesion.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            localStorage.removeItem("idUsuario");
            localStorage.removeItem("nombreUsuario");
            localStorage.removeItem("fotoPerfil");
            window.location.href = RUTA_CERRAR_SESION;
        });
    }
});