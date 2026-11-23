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


// ==========================================
// NOTIFICACIONES Y DASHBOARD
// POST /api/notificaciones · GET /api/notificaciones/:idUsuario · PUT /api/notificaciones/:idNotificacion
// POST /api/dashboard      · GET /api/dashboard/:idUsuario
// ==========================================

(function () {
    const API = "http://localhost:3000/api";
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

    if (!idUsuario) return;

    // PUT /api/notificaciones/:idNotificacion (marcar como leída)
    async function marcarLeidas(lista) {
        await Promise.all(lista.map(function (notificacion) {
            return fetch(`${API}/notificaciones/${notificacion.idNotificacion}`, { method: "PUT" })
                .catch(function (error) { console.error(error); });
        }));
    }

    // Muestra un aviso arriba con las notificaciones sin leer;
    // al tocar "Entendido" se marcan como leídas
    function mostrarAviso(noLeidas) {
        const principal = document.querySelector("main");

        if (!principal || noLeidas.length === 0) return;

        const aviso = document.createElement("aside");
        aviso.className = "aviso-notificaciones";
        aviso.setAttribute("role", "status");
        aviso.style.cssText = "max-width:700px;margin:16px auto;padding:14px 18px;background:#FFFFFF;border:2px solid #B7E4C7;border-radius:12px;color:#2F7185;font-size:14px;text-align:left;";

        const titulo = document.createElement("strong");
        titulo.textContent = "Notificaciones nuevas (" + noLeidas.length + ")";

        const lista = document.createElement("ul");
        lista.style.cssText = "margin:8px 0;padding-left:18px;color:#333333;";

        noLeidas.forEach(function (notificacion) {
            const item = document.createElement("li");
            item.textContent = notificacion.mensaje;
            lista.appendChild(item);
        });

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Entendido";
        boton.style.cssText = "padding:6px 14px;border:none;border-radius:8px;background:#2F7185;color:#FFFFFF;font-weight:600;cursor:pointer;";

        boton.addEventListener("click", async function () {
            await marcarLeidas(noLeidas);
            aviso.remove();
        });

        aviso.append(titulo, lista, boton);
        principal.prepend(aviso);
    }

    async function cargarNotificaciones() {
        try {
            const respuesta = await fetch(`${API}/notificaciones/${idUsuario}`);

            if (!respuesta.ok) return;

            let lista = await respuesta.json();

            // La primera vez se crea una notificación de bienvenida
            if (lista.length === 0 && !localStorage.getItem("bienvenidaEnviada_" + idUsuario)) {
                const nueva = await fetch(`${API}/notificaciones`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idUsuario: idUsuario,
                        mensaje: "¡Bienvenido/a a NeuroPassport!",
                        fecha: new Date().toISOString().slice(0, 10)
                    })
                });

                if (nueva.ok) {
                    localStorage.setItem("bienvenidaEnviada_" + idUsuario, "si");
                    lista = [await nueva.json()];
                }
            }

            mostrarAviso(lista.filter(function (notificacion) { return !notificacion.leida; }));
        } catch (error) {
            console.error("No se pudieron cargar las notificaciones:", error);
        }
    }

    async function cargarDashboard() {
        try {
            const respuesta = await fetch(`${API}/dashboard/${idUsuario}`);

            if (respuesta.ok) {
                const dashboard = await respuesta.json();
                localStorage.setItem("dashboard", JSON.stringify(dashboard));
                return;
            }

            if (respuesta.status !== 404) return;

            // Si todavía no existe, se arma con los objetivos y terapias guardados
            const [objetivos, terapias] = await Promise.all([
                fetch(`${API}/objetivos/${idUsuario}`).then(function (r) { return r.ok ? r.json() : []; }),
                fetch(`${API}/terapias/${idUsuario}`).then(function (r) { return r.ok ? r.json() : []; })
            ]);

            const cumplidos = objetivos.filter(function (objetivo) {
                return objetivo.estado === "cumplido" || objetivo.progreso >= 100;
            }).length;

            const dashboard = {
                idUsuario: idUsuario,
                evolucionLenguaje: 0,
                asistenciaTerapias: terapias.length,
                cumplimientoObjetivos: objetivos.length ? Math.round((cumplidos / objetivos.length) * 100) : 0
            };

            const guardado = await fetch(`${API}/dashboard`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dashboard)
            });

            if (guardado.ok) {
                localStorage.setItem("dashboard", JSON.stringify(dashboard));
            }
        } catch (error) {
            console.error("No se pudo cargar el dashboard:", error);
        }
    }

    cargarNotificaciones();
    cargarDashboard();
})();
