const nombreUsuario =
    localStorage.getItem("nombreUsuario");

const saludoPsicologo =
    document.getElementById("saludoPsicologo");

if (
    nombreUsuario &&
    saludoPsicologo
) {

    saludoPsicologo.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}


// ---------------------------------------------------------------
// BOTONES DEL DESPLEGABLE DE PERFIL
// ---------------------------------------------------------------
(function () {
    // RUTAS POSIBLES: prueba una por una y va a la primera que exista.
    // Cuando sepas la ruta exacta, dejá solo esa en cada lista.
    const RUTAS_CONFIGURACION = [
        "../../PERSONAL/configuracion.html",
        "../../INSTITUCION/configuracion.html",
        "../../PROFESIONAL/configuracion.html"
    ];

    const RUTAS_INFORMACION_PERSONAL = [
        "../../PERSONAL/informacion-personal.html",
        "../../INSTITUCION/informacion-personal.html",
        "../../PROFESIONAL/informacion-personal.html"
    ];

    const menuPerfil = document.getElementById("menuDesplegablePerfil");

    if (!menuPerfil) {
        return;
    }

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

    const enlaceConfiguracion = menuPerfil.querySelector('a[href="configuracion.html"]');
    const enlaceInfoPersonal = menuPerfil.querySelector('a[href="informacion-personal.html"]');

    if (enlaceConfiguracion) {
        enlaceConfiguracion.addEventListener("click", function (e) {
            e.preventDefault();
            irAPrimeraRutaQueExista(RUTAS_CONFIGURACION, "configuración");
        });
    }

    if (enlaceInfoPersonal) {
        enlaceInfoPersonal.addEventListener("click", function (e) {
            e.preventDefault();
            irAPrimeraRutaQueExista(RUTAS_INFORMACION_PERSONAL, "información personal");
        });
    }
})();