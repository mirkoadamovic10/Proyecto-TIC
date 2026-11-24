const botonPasaporte = document.getElementById("botonPasaporte");
const submenuPasaporte = document.getElementById("submenuPasaporte");


/* ---------- BOTÓN FAMILIA ---------- */

const botonFamilia = document.querySelector('.menu-personal a[href="./familia.html"]');

if (botonFamilia) {

    botonFamilia.addEventListener("click", function (evento) {

        evento.preventDefault();
        window.location.href = "./familia.html";

    });

}


if (botonPasaporte && submenuPasaporte) {

    botonPasaporte.addEventListener("click", function () {

        const estaOculto = submenuPasaporte.hidden;

        submenuPasaporte.hidden = !estaOculto;

        botonPasaporte.setAttribute(
            "aria-expanded",
            String(estaOculto)
        );

    });

}


const botonesPasaporte = document.querySelectorAll(".boton-pasaporte");

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


botonesPasaporte.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const nombrePantalla = boton.textContent.trim();

        const pagina = pantallas[nombrePantalla];

        if (pagina) {
            submenuPasaporte.hidden = true;
            window.location.href = pagina;
        }

    });

});


const nombreUsuario = localStorage.getItem("nombreUsuario");

const saludoUsuario = document.getElementById("saludoUsuario");

if (nombreUsuario && saludoUsuario) {
    saludoUsuario.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
}


const botonPerfil = document.getElementById("botonPerfil");
const submenuPerfil = document.getElementById("submenuPerfil");

if (botonPerfil && submenuPerfil) {

    botonPerfil.addEventListener("click", function () {

        const abierto = submenuPerfil.classList.toggle("activo");

        botonPerfil.setAttribute(
            "aria-expanded",
            String(abierto)
        );

    });

    const opcionesPerfil = submenuPerfil.querySelectorAll("button");

    opcionesPerfil.forEach(function (opcion) {

        opcion.addEventListener("click", function () {

            const pagina = opcion.getAttribute("data-pagina");

            if (pagina) {
                window.location.href = pagina;
            }

        });

    });

}


const fotoPerfil = localStorage.getItem("fotoPerfil");

if (botonPerfil && fotoPerfil) {

    const imagenPerfil = document.createElement("img");

    imagenPerfil.src = fotoPerfil;
    imagenPerfil.alt = "Foto de perfil";
    imagenPerfil.classList.add("imagen-perfil");

    botonPerfil.appendChild(imagenPerfil);

    const cabeza = botonPerfil.querySelector(".cabeza");
    const cuerpo = botonPerfil.querySelector(".cuerpo");

    if (cabeza) {
        cabeza.style.display = "none";
    }

    if (cuerpo) {
        cuerpo.style.display = "none";
    }

}

if (botonPasaporte && submenuPasaporte && cerrarPasaporte) {

    botonPasaporte.addEventListener("click", () => {
        submenuPasaporte.hidden = false;
        botonPasaporte.setAttribute("aria-expanded", "true");
    });

    cerrarPasaporte.addEventListener("click", () => {
        submenuPasaporte.hidden = true;
        botonPasaporte.setAttribute("aria-expanded", "false");
    });

    submenuPasaporte.addEventListener("click", (evento) => {
        if (evento.target === submenuPasaporte) {
            submenuPasaporte.hidden = true;
            botonPasaporte.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !submenuPasaporte.hidden) {
            submenuPasaporte.hidden = true;
            botonPasaporte.setAttribute("aria-expanded", "false");
        }
    });
}


// ==========================================
// NOTIFICACIONES Y DASHBOARD
// POST /api/notificaciones · GET /api/notificaciones/:idUsuario · PUT /api/notificaciones/:idNotificacion
// (se crean a partir de lo pendiente en la agenda: GET /api/agenda/:idUsuario)
// POST /api/dashboard      · GET /api/dashboard/:idUsuario
// ==========================================

(function () {
    const API = "http://localhost:3000/api";
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

    if (!idUsuario) return;

    // Marca como leídas (en el navegador y, si está prendido, en el servidor)
    async function marcarLeidas(lista) {
        for (const notificacion of lista) {
            await guardarNotificacionLeida(API, idUsuario, notificacion);
        }
    }

    // Muestra un puntito en la campana si hay notificaciones sin leer;
    // al tocar la campana se marcan como leídas
    function mostrarAviso(noLeidas) {
        const campana = document.getElementById("botonNotificaciones");

        if (!campana || noLeidas.length === 0) return;

        campana.style.position = "relative";

        const punto = document.createElement("span");
        punto.className = "punto-notificacion-servidor";
        punto.setAttribute("aria-label", noLeidas.length + " notificaciones sin leer");
        punto.style.cssText = "position:absolute;top:2px;right:0;width:10px;height:10px;border-radius:50%;background:#E05A5A;";
        campana.appendChild(punto);

        campana.addEventListener("click", function () {
            marcarLeidas(noLeidas);
        });
    }

    /* Arma las notificaciones a partir de lo pendiente en la agenda
       (agenda personal y agenda compartida de la familia):
       - lo guardado en este navegador (eventosAgenda_<id>, eventosCompartidos_<grupo>)
       - GET /api/agenda/:idUsuario -> eventos del servidor
       - GET /api/notificaciones/:idUsuario y POST /api/notificaciones -> las del servidor
       Las notificaciones también se guardan en el navegador (notificaciones_<id>),
       así quedan guardadas y se recuerda cuáles se leyeron aunque el servidor esté apagado.
       Devuelve solo las notificaciones de eventos de hoy en adelante. */
    async function sincronizarNotificacionesAgenda(API, idUsuario) {
        var NOMBRES = {
            turno: "Turno médico",
            estudio: "Estudio médico",
            terapia: "Terapia",
            medicacion: "Medicación",
            control: "Control / seguimiento"
        };

        var ahora = new Date();
        var hoy = ahora.getFullYear() + "-" + String(ahora.getMonth() + 1).padStart(2, "0") + "-" + String(ahora.getDate()).padStart(2, "0");

        function leerLista(clave) {
            try {
                var lista = JSON.parse(localStorage.getItem(clave));
                return Array.isArray(lista) ? lista : [];
            } catch (error) {
                return [];
            }
        }

        function armarMensaje(evento) {
            var partes = String(evento.fecha).split("-");
            var fecha = partes.length === 3 ? partes[2] + "/" + partes[1] : evento.fecha;
            var tipo = NOMBRES[evento.tipo] || "Evento";
            var titulo = evento.titulo || evento.nombre || evento.descripcion || "";

            return tipo + (titulo ? ": " + titulo : "") + " — " + fecha + (evento.hora ? " " + evento.hora : "");
        }

        // 1) Eventos guardados en el navegador (agenda personal y compartida)
        var grupo = {};

        try {
            grupo = JSON.parse(localStorage.getItem("grupoFamiliar")) || {};
        } catch (error) {
            grupo = {};
        }

        var claveCompartidos = grupo.idGrupo ? "eventosCompartidos_" + grupo.idGrupo : "eventosCompartidos";

        var eventos = leerLista("eventosAgenda_" + idUsuario)
            .concat(leerLista(claveCompartidos));

        var eliminados = leerLista("eventosAgendaEliminados_" + idUsuario)
            .concat(leerLista(claveCompartidos + "_eliminados"));

        // 2) Eventos del servidor (si está prendido)
        var notificacionesServidor = [];
        var hayServidor = false;

        try {
            var respuestaAgenda = await fetch(API + "/agenda/" + idUsuario);

            if (respuestaAgenda.ok) {
                hayServidor = true;
                eventos = eventos.concat(await respuestaAgenda.json());
            }

            var respuestaNotificaciones = await fetch(API + "/notificaciones/" + idUsuario);

            if (respuestaNotificaciones.ok) {
                notificacionesServidor = await respuestaNotificaciones.json();
            }
        } catch (error) {
            console.error("Servidor apagado: se usan las notificaciones guardadas en el navegador.", error);
        }

        var pendientes = eventos.filter(function (evento) {
            var id = String(evento.id || evento.idLocal || "srv-" + evento.idEvento);
            return evento.fecha && evento.fecha >= hoy && eliminados.indexOf(id) === -1;
        });

        // 3) Una notificación por evento (sin repetir)
        var guardadas = leerLista("notificaciones_" + idUsuario);
        var resultado = [];

        for (var i = 0; i < pendientes.length; i++) {
            var evento = pendientes[i];
            var mensaje = armarMensaje(evento);

            var yaEsta = resultado.some(function (n) { return n.mensaje === mensaje; });

            if (yaEsta) {
                continue;
            }

            var guardada = guardadas.find(function (n) { return n.mensaje === mensaje; }) || {};
            var delServidor = notificacionesServidor.find(function (n) { return n.mensaje === mensaje; });

            // Si el servidor está prendido y todavía no la tiene, se crea
            if (hayServidor && !delServidor) {
                try {
                    var nueva = await fetch(API + "/notificaciones", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idUsuario: idUsuario, mensaje: mensaje, fecha: evento.fecha })
                    });

                    if (nueva.ok) {
                        delServidor = await nueva.json();
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            resultado.push({
                idNotificacion: delServidor ? delServidor.idNotificacion : guardada.idNotificacion,
                mensaje: mensaje,
                fecha: evento.fecha,
                tipo: evento.tipo,
                leida: !!(guardada.leida || (delServidor && delServidor.leida))
            });
        }

        resultado.sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });

        localStorage.setItem("notificaciones_" + idUsuario, JSON.stringify(resultado));

        return resultado;
    }

    // Marca una notificación como leída en el navegador y, si se puede, en el servidor
    async function guardarNotificacionLeida(API, idUsuario, notificacion) {
        var guardadas;

        try {
            guardadas = JSON.parse(localStorage.getItem("notificaciones_" + idUsuario)) || [];
        } catch (error) {
            guardadas = [];
        }

        guardadas.forEach(function (n) {
            if (n.mensaje === notificacion.mensaje) {
                n.leida = true;
            }
        });

        localStorage.setItem("notificaciones_" + idUsuario, JSON.stringify(guardadas));
        notificacion.leida = true;

        if (notificacion.idNotificacion) {
            try {
                await fetch(API + "/notificaciones/" + notificacion.idNotificacion, { method: "PUT" });
            } catch (error) {
                console.error("No se pudo avisar al servidor; queda guardada en el navegador.", error);
            }
        }
    }

    // Solo notificaciones de cosas pendientes en la agenda
    async function cargarNotificaciones() {
        try {
            const lista = await sincronizarNotificacionesAgenda(API, idUsuario);
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
