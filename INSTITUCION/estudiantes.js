// ==========================================
// INSTITUCIÓN DEL USUARIO: POST /api/instituciones
// Se crea una sola vez por usuario y se guarda su idInstitucion
// ==========================================

async function obtenerIdInstitucion() {
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

    if (!idUsuario) {
        return null;
    }

    const clave = "idInstitucion_" + idUsuario;
    const guardado = Number(localStorage.getItem(clave));

    if (guardado) {
        return guardado;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/instituciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                nombre: localStorage.getItem("nombreUsuario") || "Institución",
                tipo: localStorage.getItem("tipoInstitucion") || "escuela"
            })
        });

        if (!respuesta.ok) {
            console.error("No se pudo crear la institución:", respuesta.status);
            return null;
        }

        const institucion = await respuesta.json();
        localStorage.setItem(clave, institucion.idInstitucion);
        return institucion.idInstitucion;
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return null;
    }
}


const botonLinkearEstudiante = document.getElementById("botonLinkearEstudiante");
const ventanaEstudiante = document.getElementById("ventanaEstudiante");
const cerrarEstudiante = document.getElementById("cerrarModalEstudiante");

const formularioEstudiante = document.getElementById("formularioEstudiante");
const nombreEstudiante = document.getElementById("nombreEstudiante");
const dniEstudiante = document.getElementById("dniEstudiante");
const codigoEstudiante = document.getElementById("codigoEstudiante");

const mensajeEstudiante = document.getElementById("mensajeEstudiante");
const listaEstudiantes = document.getElementById("estudiantesVinculados");

// Solicitudes y estudiantes guardados en este navegador.
let estudiantes = JSON.parse(
    localStorage.getItem("estudiantesInstitucion")
) || [];

let solicitudesEstudiantes = JSON.parse(
    localStorage.getItem("solicitudesEstudiantesDemo")
) || [];

// Guardar los datos.
function guardarEstudiantes() {
    localStorage.setItem(
        "estudiantesInstitucion",
        JSON.stringify(estudiantes)
    );

    localStorage.setItem(
        "solicitudesEstudiantesDemo",
        JSON.stringify(solicitudesEstudiantes)
    );
}

// Crear círculo de perfil.
function crearAvatarEstudiante(estudiante) {
    const avatar = document.createElement("div");
    avatar.className = "avatar-medico";

    if (estudiante.foto) {
        const imagen = document.createElement("img");
        imagen.src = estudiante.foto;
        imagen.alt = `Foto de perfil de ${estudiante.nombre || "estudiante"}`;

        imagen.addEventListener("error", function () {
            avatar.textContent = obtenerInicialesEstudiante(estudiante.nombre);
        });

        avatar.appendChild(imagen);
    } else {
        avatar.textContent = obtenerInicialesEstudiante(estudiante.nombre);
        avatar.setAttribute("aria-label", "Foto de perfil no disponible");
    }

    return avatar;
}

// Obtener iniciales.
function obtenerInicialesEstudiante(nombre) {
    return (nombre || "E")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (parte) {
            return parte.charAt(0).toUpperCase();
        })
        .join("");
}

// Mostrar estudiantes aceptados.
function mostrarEstudiantes() {
    listaEstudiantes.innerHTML = "";

    if (estudiantes.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent = "Todavía no hay estudiantes vinculados.";
        listaEstudiantes.appendChild(mensaje);
        return;
    }

    estudiantes.forEach(function (estudiante) {
        // Al tocar la tarjeta se abren sus preferencias de aprendizaje
        const tarjeta = document.createElement("a");
        tarjeta.className = "tarjeta-hospital tarjeta-estudiante";
        tarjeta.href = "preferencias-aprendizaje-estudiante.html?id=" + encodeURIComponent(estudiante.id);
        tarjeta.setAttribute("aria-label", "Ver preferencias de " + (estudiante.nombre || "estudiante"));

        const avatar = crearAvatarEstudiante(estudiante);

        const datos = document.createElement("div");
        datos.className = "datos-medico";

        const nombre = document.createElement("h2");
        nombre.textContent = estudiante.nombre || "Estudiante vinculado";

        const estado = document.createElement("span");
        estado.className = "estado-vinculado";
        estado.textContent = "Vinculación aceptada";

        datos.appendChild(nombre);
        datos.appendChild(estado);

        tarjeta.appendChild(avatar);
        tarjeta.appendChild(datos);

        listaEstudiantes.appendChild(tarjeta);
    });
}

// Crear una sección de solicitudes pendientes.
function crearSeccionSolicitudes() {
    let seccion = document.getElementById("seccionSolicitudesEstudiantes");

    if (!seccion) {
        seccion = document.createElement("section");
        seccion.id = "seccionSolicitudesEstudiantes";
        seccion.className = "seccion-solicitudes";
        seccion.hidden = true;

        const titulo = document.createElement("h2");
        titulo.textContent = "Solicitudes de vinculación (prueba)";

        const lista = document.createElement("div");
        lista.id = "listaSolicitudesEstudiantes";

        seccion.appendChild(titulo);
        seccion.appendChild(lista);

        listaEstudiantes.insertAdjacentElement("afterend", seccion);
    }

    return seccion;
}

// Mostrar solicitudes pendientes.
function mostrarSolicitudesEstudiantes() {
    const seccion = crearSeccionSolicitudes();
    const lista = document.getElementById("listaSolicitudesEstudiantes");

    lista.innerHTML = "";

    const pendientes = solicitudesEstudiantes.filter(function (solicitud) {
        return solicitud.estado === "pendiente";
    });

    seccion.hidden = pendientes.length === 0;

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

        datos.append(nombre, dni, codigo, estado);

        const acciones = document.createElement("div");
        acciones.className = "acciones-solicitud";

        const aceptar = document.createElement("button");
        aceptar.type = "button";
        aceptar.className = "aceptar-solicitud";
        aceptar.textContent = "Aceptar";

        aceptar.addEventListener("click", function () {
            aceptarSolicitudEstudiante(solicitud.id);
        });

        const rechazar = document.createElement("button");
        rechazar.type = "button";
        rechazar.className = "rechazar-solicitud";
        rechazar.textContent = "Rechazar";

        rechazar.addEventListener("click", function () {
            rechazarSolicitudEstudiante(solicitud.id);
        });

        acciones.append(aceptar, rechazar);
        tarjeta.append(datos, acciones);
        lista.appendChild(tarjeta);
    });
}

// Abrir ventana de vinculación.
botonLinkearEstudiante.addEventListener("click", function () {
    formularioEstudiante.reset();
    mensajeEstudiante.textContent = "";

    ventanaEstudiante.classList.add("mostrar");
    ventanaEstudiante.setAttribute("aria-hidden", "false");

    nombreEstudiante.focus();
});

// Cerrar ventana.
function cerrarVentanaEstudiante() {
    ventanaEstudiante.classList.remove("mostrar");
    ventanaEstudiante.setAttribute("aria-hidden", "true");
}

cerrarEstudiante.addEventListener("click", cerrarVentanaEstudiante);

ventanaEstudiante.addEventListener("click", function (evento) {
    if (evento.target === ventanaEstudiante) {
        cerrarVentanaEstudiante();
    }
});

document.addEventListener("keydown", function (evento) {
    if (
        evento.key === "Escape" &&
        ventanaEstudiante.classList.contains("mostrar")
    ) {
        cerrarVentanaEstudiante();
    }
});

// Enviar solicitud de vinculación.
formularioEstudiante.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = nombreEstudiante.value.trim();
    const dni = dniEstudiante.value.trim();
    const codigo = codigoEstudiante.value.trim();

    if (!nombre || !dni || !codigo) {
        mensajeEstudiante.textContent = "Completá los tres campos.";
        return;
    }

    if (!/^[0-9. -]{7,15}$/.test(dni)) {
        mensajeEstudiante.textContent = "Revisá el DNI ingresado.";
        return;
    }

    const dniNormalizado = dni.replace(/[. -]/g, "");
    const codigoNormalizado = codigo.toLowerCase();

    const yaVinculado = estudiantes.some(function (estudiante) {
        return (
            String(estudiante.dni || "").replace(/[. -]/g, "") === dniNormalizado ||
            String(estudiante.codigo || "").toLowerCase() === codigoNormalizado
        );
    });

    if (yaVinculado) {
        mensajeEstudiante.textContent = "Este estudiante ya está vinculado.";
        return;
    }

    const yaSolicitado = solicitudesEstudiantes.some(function (solicitud) {
        return (
            solicitud.estado === "pendiente" &&
            (
                String(solicitud.dni).replace(/[. -]/g, "") === dniNormalizado ||
                String(solicitud.codigo).toLowerCase() === codigoNormalizado
            )
        );
    });

    if (yaSolicitado) {
        mensajeEstudiante.textContent =
            "Ya existe una solicitud pendiente para este estudiante.";
        return;
    }

    solicitudesEstudiantes.push({
        id: Date.now(),
        nombre: nombre,
        dni: dni,
        codigo: codigo,
        estado: "pendiente",
        fecha: new Date().toISOString()
    });

    guardarEstudiantes();
    mostrarSolicitudesEstudiantes();

    mensajeEstudiante.textContent =
        "Solicitud creada. Podés aceptarla desde la sección de solicitudes.";

    formularioEstudiante.reset();
});

// Aceptar solicitud.
function aceptarSolicitudEstudiante(id) {
    const solicitud = solicitudesEstudiantes.find(function (item) {
        return item.id === id;
    });

    if (!solicitud || solicitud.estado !== "pendiente") {
        return;
    }

    solicitud.estado = "aceptada";

    vincularEstudianteEnServidor(solicitud);

    estudiantes.push({
        id: solicitud.id,
        nombre: solicitud.nombre,
        dni: solicitud.dni,
        codigo: solicitud.codigo,
        foto: ""
    });

    guardarEstudiantes();
    mostrarEstudiantes();
    mostrarSolicitudesEstudiantes();
}

// POST /api/instituciones/vincular-estudiante
// El "código" del estudiante es su número de usuario en NeuroPassport
async function vincularEstudianteEnServidor(solicitud) {
    const idInstitucion = await obtenerIdInstitucion();
    const idUsuario = Number(String(solicitud.codigo).replace(/\D/g, ""));

    if (!idInstitucion || !idUsuario) {
        console.warn("No se pudo vincular en el servidor: falta la institución o el código del estudiante.");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/instituciones/vincular-estudiante", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idInstitucion: idInstitucion,
                idUsuario: idUsuario,
                dni: String(solicitud.dni),
                codigoEstudiante: String(solicitud.codigo),
                nombre: solicitud.nombre
            })
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            alert(error.error || "No se pudo vincular al estudiante en el servidor.");
        }
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
    }
}

// GET /api/instituciones/:idInstitucion/estudiantes
async function cargarEstudiantesDelServidor() {
    const idInstitucion = await obtenerIdInstitucion();

    if (!idInstitucion) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/api/instituciones/${idInstitucion}/estudiantes`);

        if (!respuesta.ok) return;

        const vinculos = await respuesta.json();

        vinculos.forEach(function (vinculo) {
            const yaEsta = estudiantes.some(function (estudiante) {
                return String(estudiante.codigo) === String(vinculo.codigoEstudiante) ||
                    String(estudiante.dni) === String(vinculo.dni);
            });

            if (!yaEsta) {
                estudiantes.push({
                    id: vinculo.idVinculo,
                    nombre: vinculo.nombre || "Estudiante",
                    dni: vinculo.dni,
                    codigo: vinculo.codigoEstudiante,
                    foto: ""
                });
            }
        });

        guardarEstudiantes();
        mostrarEstudiantes();
    } catch (error) {
        console.error("No se pudieron cargar los estudiantes del servidor:", error);
    }
}

// Rechazar solicitud.
function rechazarSolicitudEstudiante(id) {
    const solicitud = solicitudesEstudiantes.find(function (item) {
        return item.id === id;
    });

    if (!solicitud || solicitud.estado !== "pendiente") {
        return;
    }

    solicitud.estado = "rechazada";

    guardarEstudiantes();
    mostrarSolicitudesEstudiantes();
}

// Inicializar pantalla.
mostrarEstudiantes();
mostrarSolicitudesEstudiantes();
cargarEstudiantesDelServidor();


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
