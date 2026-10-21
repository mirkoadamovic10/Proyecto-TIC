
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
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-hospital";

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
