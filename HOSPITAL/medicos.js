// ==========================================
// HOSPITAL DEL USUARIO: POST /api/hospitales
// Se crea una sola vez por usuario y se guarda su idHospital
// ==========================================

async function obtenerIdHospital() {
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

    if (!idUsuario) {
        return null;
    }

    const clave = "idHospital_" + idUsuario;
    const guardado = Number(localStorage.getItem(clave));

    if (guardado) {
        return guardado;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/hospitales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                nombre: localStorage.getItem("nombreUsuario") || "Hospital"
            })
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            console.error("No se pudo crear el hospital:", error.error || respuesta.status);
            return null;
        }

        const hospital = await respuesta.json();
        localStorage.setItem(clave, hospital.idHospital);
        return hospital.idHospital;
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return null;
    }
}

const botonAgregarMedico = document.getElementById("botonAgregarMedico");
const ventanaMedico = document.getElementById("ventanaMedico");
const cerrarMedico = document.getElementById("cerrarMedico");

const formularioMedico = document.getElementById("formularioMedico");
const nombrePersona = document.getElementById("nombrePersona");
const dniPersona = document.getElementById("dniPersona");
const codigoPersona = document.getElementById("codigoPersona");

const mensajeMedico = document.getElementById("mensajeMedico");
const listaMedicos = document.getElementById("listaMedicos");
const seccionSolicitudes = document.getElementById("seccionSolicitudes");
const listaSolicitudes = document.getElementById("listaSolicitudes");

// Datos de prueba guardados en este navegador.
let medicos = JSON.parse(
    localStorage.getItem("medicosHospital")
) || [];

let solicitudes = JSON.parse(
    localStorage.getItem("solicitudesVinculacionDemo")
) || [];

// Guardar los datos.
function guardarDatos() {
    localStorage.setItem("medicosHospital", JSON.stringify(medicos));
    localStorage.setItem(
        "solicitudesVinculacionDemo",
        JSON.stringify(solicitudes)
    );
}

// Crear una foto de perfil de respaldo.
// Cuando exista una foto real en medico.foto, se mostrará esa imagen.
function crearAvatar(persona) {
    const avatar = document.createElement("div");
    avatar.className = "avatar-medico";

    if (persona.foto) {
        const imagen = document.createElement("img");
        imagen.src = persona.foto;
        imagen.alt = `Foto de perfil de ${persona.nombre || "la persona"}`;

        imagen.addEventListener("error", function () {
            avatar.textContent = obtenerIniciales(persona.nombre);
        });

        avatar.appendChild(imagen);
    } else {
        avatar.textContent = obtenerIniciales(persona.nombre);
        avatar.setAttribute("aria-label", "Foto de perfil no disponible");
    }

    return avatar;
}

function obtenerIniciales(nombre) {
    return (nombre || "P")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (parte) {
            return parte.charAt(0).toUpperCase();
        })
        .join("");
}

// Mostrar personas vinculadas.
function mostrarMedicos() {
    listaMedicos.innerHTML = "";

    if (medicos.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent = "Todavía no hay personas vinculadas.";
        listaMedicos.appendChild(mensaje);
        return;
    }

    medicos.forEach(function (medico) {
        // Al tocar la tarjeta se abre el perfil profesional
        const tarjeta = document.createElement("a");
        tarjeta.className = "tarjeta-hospital tarjeta-medico";
        tarjeta.href = "perfil-profesional-medicos.html?id=" + encodeURIComponent(medico.id);
        tarjeta.setAttribute("aria-label", "Ver perfil de " + (medico.nombre || "persona vinculada"));

        const avatar = crearAvatar(medico);

        const datos = document.createElement("div");
        datos.className = "datos-medico";

        const nombre = document.createElement("h2");
        nombre.textContent = medico.nombre || "Persona vinculada";

        const estado = document.createElement("span");
        estado.className = "estado-vinculado";
        estado.textContent = "Vinculación aceptada";

        datos.appendChild(nombre);
        datos.appendChild(estado);

        tarjeta.appendChild(avatar);
        tarjeta.appendChild(datos);

        listaMedicos.appendChild(tarjeta);
    });
}

// Mostrar solicitudes pendientes.
// Esta sección permite probar la aceptación en el mismo navegador.
function mostrarSolicitudes() {
    listaSolicitudes.innerHTML = "";

    const pendientes = solicitudes.filter(function (solicitud) {
        return solicitud.estado === "pendiente";
    });

    seccionSolicitudes.hidden = pendientes.length === 0;

    pendientes.forEach(function (solicitud) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "solicitud-hospital";

        const datos = document.createElement("div");
        datos.className = "datos-solicitud";

        const nombre = document.createElement("strong");
        nombre.textContent = solicitud.nombre;

        const dni = document.createElement("span");
        dni.textContent = "DNI: " + solicitud.dni;

        const codigo = document.createElement("span");
        codigo.textContent = "Código: " + solicitud.codigo;

        const estado = document.createElement("span");
        estado.textContent = "Estado: pendiente de aceptación";

        datos.appendChild(nombre);
        datos.appendChild(dni);
        datos.appendChild(codigo);
        datos.appendChild(estado);

        const acciones = document.createElement("div");
        acciones.className = "acciones-solicitud";

        const aceptar = document.createElement("button");
        aceptar.type = "button";
        aceptar.className = "aceptar-solicitud";
        aceptar.textContent = "Aceptar";

        aceptar.addEventListener("click", function () {
            aceptarSolicitud(solicitud.id);
        });

        const rechazar = document.createElement("button");
        rechazar.type = "button";
        rechazar.className = "rechazar-solicitud";
        rechazar.textContent = "Rechazar";

        rechazar.addEventListener("click", function () {
            rechazarSolicitud(solicitud.id);
        });

        acciones.appendChild(aceptar);
        acciones.appendChild(rechazar);

        tarjeta.appendChild(datos);
        tarjeta.appendChild(acciones);

        listaSolicitudes.appendChild(tarjeta);
    });
}

// Abrir ventana de vinculación.
botonAgregarMedico.addEventListener("click", function () {
    formularioMedico.reset();
    mensajeMedico.textContent = "";

    ventanaMedico.classList.add("mostrar");
    ventanaMedico.setAttribute("aria-hidden", "false");

    nombrePersona.focus();
});

// Cerrar ventana.
function cerrarVentana() {
    ventanaMedico.classList.remove("mostrar");
    ventanaMedico.setAttribute("aria-hidden", "true");
}

cerrarMedico.addEventListener("click", cerrarVentana);

ventanaMedico.addEventListener("click", function (evento) {
    if (evento.target === ventanaMedico) {
        cerrarVentana();
    }
});

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && ventanaMedico.classList.contains("mostrar")) {
        cerrarVentana();
    }
});

// Enviar una solicitud de vinculación.
formularioMedico.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = nombrePersona.value.trim();
    const dni = dniPersona.value.trim();
    const codigo = codigoPersona.value.trim();

    if (!nombre || !dni || !codigo) {
        mensajeMedico.textContent = "Completá los tres campos.";
        return;
    }

    if (!/^[0-9. -]{7,15}$/.test(dni)) {
        mensajeMedico.textContent = "Revisá el DNI ingresado.";
        return;
    }

    const codigoNormalizado = codigo.toLowerCase();
    const dniNormalizado = dni.replace(/[. -]/g, "");

    const yaVinculada = medicos.some(function (persona) {
        return (
            String(persona.dni || "").replace(/[. -]/g, "") === dniNormalizado ||
            String(persona.codigo || "").toLowerCase() === codigoNormalizado
        );
    });

    if (yaVinculada) {
        mensajeMedico.textContent = "Esta persona ya está vinculada.";
        return;
    }

    const yaSolicitada = solicitudes.some(function (solicitud) {
        return (
            solicitud.estado === "pendiente" &&
            (
                String(solicitud.dni).replace(/[. -]/g, "") === dniNormalizado ||
                String(solicitud.codigo).toLowerCase() === codigoNormalizado
            )
        );
    });

    if (yaSolicitada) {
        mensajeMedico.textContent = "Ya existe una solicitud pendiente para esta persona.";
        return;
    }

    solicitudes.push({
        id: Date.now(),
        nombre: nombre,
        dni: dni,
        codigo: codigo,
        estado: "pendiente",
        fecha: new Date().toISOString()
    });

    guardarDatos();
    mostrarSolicitudes();

    mensajeMedico.textContent =
        "Solicitud creada. En esta versión de prueba podés aceptarla desde la sección de solicitudes.";

    formularioMedico.reset();
});

// Aceptar solicitud.
function aceptarSolicitud(id) {
    const solicitud = solicitudes.find(function (item) {
        return item.id === id;
    });

    if (!solicitud || solicitud.estado !== "pendiente") {
        return;
    }

    solicitud.estado = "aceptada";

    vincularMedicoEnServidor(solicitud);

    medicos.push({
        id: solicitud.id,
        nombre: solicitud.nombre,
        dni: solicitud.dni,
        codigo: solicitud.codigo,
        foto: ""
    });

    guardarDatos();
    mostrarMedicos();
    mostrarSolicitudes();
}

// POST /api/hospitales/vincular-medico
// El "código" del médico es su número de usuario en NeuroPassport
async function vincularMedicoEnServidor(solicitud) {
    const idHospital = await obtenerIdHospital();
    const idMedico = Number(String(solicitud.codigo).replace(/\D/g, ""));

    if (!idHospital || !idMedico) {
        console.warn("No se pudo vincular en el servidor: falta el hospital o el código del médico.");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/hospitales/vincular-medico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idHospital: idHospital, idMedico: idMedico })
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            alert(error.error || "No se pudo vincular al médico en el servidor.");
        }
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
    }
}

// Rechazar solicitud.
function rechazarSolicitud(id) {
    const solicitud = solicitudes.find(function (item) {
        return item.id === id;
    });

    if (!solicitud || solicitud.estado !== "pendiente") {
        return;
    }

    solicitud.estado = "rechazada";

    guardarDatos();
    mostrarSolicitudes();
}

// Inicializar pantalla.
mostrarMedicos();
mostrarSolicitudes();


// ---------------------------------------------------------------
// DESPLEGABLE DEL PERFIL
// ---------------------------------------------------------------
(function () {
    // Configuración e Información personal propias de esta sección
    const RUTAS_CONFIGURACION = [
        "configuracion.html"
    ];

    const RUTAS_INFORMACION_PERSONAL = [
        "informacion-personal.html"
    ];

    const RUTA_CERRAR_SESION = "../cerrar-sesion.html";

    const fotoUsuario = localStorage.getItem("fotoPerfil");
    const perfilMedicos = document.getElementById("botonPerfilMedicos");
    const menuPerfil = document.getElementById("menuPerfilMedicos");

    if (fotoUsuario && perfilMedicos) {
        perfilMedicos.style.backgroundImage = `url("${fotoUsuario}")`;
        perfilMedicos.style.backgroundSize = "cover";
        perfilMedicos.style.backgroundPosition = "center";
        perfilMedicos.classList.add("tiene-foto");
    }

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

    const botones = Array.from(menuPerfil.querySelectorAll("button"));
    const btnConfiguracion = botones.find(function (b) {
        return b.textContent.toLowerCase().includes("configur");
    }) || botones[0];
    const btnInfoPersonal = botones.find(function (b) {
        return b.textContent.toLowerCase().includes("informaci");
    }) || botones[1];
    const btnCerrarSesion = botones.find(function (b) {
        return b.textContent.toLowerCase().includes("cerrar");
    }) || botones[2];

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
})();