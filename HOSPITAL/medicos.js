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
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-hospital";

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