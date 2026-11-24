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

// Busca un usuario por email con GET /api/usuarios/:id (los id van 1, 2, 3...)
async function buscarUsuarioPorEmail(emailBuscado) {
    for (let id = 1; id <= 1000; id++) {
        const respuesta = await fetch(`http://localhost:3000/api/usuarios/${id}`);

        if (!respuesta.ok) {
            return null;
        }

        const usuario = await respuesta.json();

        if (usuario.email && usuario.email.toLowerCase() === emailBuscado.toLowerCase()) {
            return usuario;
        }
    }

    return null;
}

document.addEventListener("DOMContentLoaded", function () {
    const botonAgregar = document.getElementById("botonAgregarPaciente");
    const ventana = document.getElementById("ventanaPaciente");
    const botonCerrar = document.getElementById("cerrarPaciente");
    const formulario = document.getElementById("formularioPaciente");
    const emailInput = document.getElementById("emailPaciente");
    const mensaje = document.getElementById("mensajePaciente");
    const lista = document.getElementById("listaPacientes");

    if (!botonAgregar || !ventana || !botonCerrar ||
        !formulario || !emailInput || !mensaje || !lista) {
        console.error("Revisá los IDs de pacientes.html: falta algún elemento.");
        return;
    }

    let pacientes = [];

    try {
        pacientes = JSON.parse(
            localStorage.getItem("pacientesHospital")
        ) || [];
    } catch (error) {
        pacientes = [];
    }

    function abrirVentana() {
        formulario.reset();
        mensaje.textContent = "";
        ventana.classList.add("mostrar");
        ventana.setAttribute("aria-hidden", "false");
        emailInput.focus();
    }

    function cerrarVentana() {
        ventana.classList.remove("mostrar");
        ventana.setAttribute("aria-hidden", "true");
    }

    function mostrarPacientes() {
        lista.innerHTML = "";

        if (pacientes.length === 0) {
            const texto = document.createElement("p");
            texto.className = "mensaje-vacio";
            texto.textContent = "Todavía no hay pacientes vinculados.";
            lista.appendChild(texto);
            return;
        }

        pacientes.forEach(function (paciente) {
            // Al tocar la tarjeta se abre el perfil sensorial del paciente
            const tarjeta = document.createElement("a");
            tarjeta.className = "tarjeta-hospital tarjeta-paciente";
            tarjeta.href = "perfil-sensorial-paciente.html?id=" +
                encodeURIComponent(paciente.idUsuario || paciente.id);
            tarjeta.setAttribute("aria-label", "Ver perfil sensorial de " + (paciente.nombre || "paciente"));

            const avatar = document.createElement("div");
            avatar.className = "avatar-medico";
            avatar.setAttribute("aria-hidden", "true");
            avatar.textContent = (paciente.nombre || "P")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(function (parte) { return parte.charAt(0).toUpperCase(); })
                .join("");

            const datos = document.createElement("div");
            datos.className = "datos-medico";

            const nombre = document.createElement("h2");
            nombre.textContent = paciente.nombre || "Paciente";

            const email = document.createElement("span");
            email.className = "estado-vinculado";
            email.textContent = paciente.email || "";

            datos.append(nombre, email);
            tarjeta.append(avatar, datos);
            lista.appendChild(tarjeta);
        });
    }

    botonAgregar.addEventListener("click", abrirVentana);
    botonCerrar.addEventListener("click", cerrarVentana);

    ventana.addEventListener("click", function (evento) {
        if (evento.target === ventana) {
            cerrarVentana();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && ventana.classList.contains("mostrar")) {
            cerrarVentana();
        }
    });

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            mensaje.textContent = "Ingresá el correo del paciente.";
            return;
        }

        const existe = pacientes.some(function (paciente) {
            return paciente.email.toLowerCase() === email.toLowerCase();
        });

        if (existe) {
            mensaje.textContent = "Este paciente ya está vinculado.";
            return;
        }

        // POST /api/hospitales/vincular-paciente
        let usuarioPaciente = null;

        try {
            mensaje.textContent = "Buscando al paciente...";
            usuarioPaciente = await buscarUsuarioPorEmail(email);
            const idHospital = await obtenerIdHospital();

            if (usuarioPaciente && idHospital) {
                const respuesta = await fetch("http://localhost:3000/api/hospitales/vincular-paciente", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idHospital: idHospital,
                        idPaciente: usuarioPaciente.idUsuario
                    })
                });

                if (!respuesta.ok) {
                    const error = await respuesta.json().catch(() => ({}));
                    mensaje.textContent = error.error || "No se pudo vincular al paciente.";
                    return;
                }
            } else if (!usuarioPaciente) {
                mensaje.textContent = "No hay ningún usuario registrado con ese correo.";
                return;
            }
        } catch (error) {
            console.error("No se pudo conectar con el servidor:", error);
        }

        pacientes.push({
            id: Date.now(),
            idUsuario: usuarioPaciente ? usuarioPaciente.idUsuario : null,
            email: email,
            nombre: usuarioPaciente ? usuarioPaciente.nombre : "Paciente"
        });

        localStorage.setItem("pacientesHospital", JSON.stringify(pacientes));

        mostrarPacientes();
        formulario.reset();
        mensaje.textContent = "Paciente vinculado correctamente.";
    });

    mostrarPacientes();

    // GET /api/hospitales/:idHospital/pacientes
    async function cargarPacientesDelServidor() {
        const idHospital = await obtenerIdHospital();

        if (!idHospital) return;

        try {
            const respuesta = await fetch(`http://localhost:3000/api/hospitales/${idHospital}/pacientes`);

            if (!respuesta.ok) return;

            const lista = await respuesta.json();

            pacientes = lista.map(function (usuario) {
                return {
                    id: usuario.idUsuario,
                    idUsuario: usuario.idUsuario,
                    email: usuario.email,
                    nombre: usuario.nombre
                };
            });

            localStorage.setItem("pacientesHospital", JSON.stringify(pacientes));
            mostrarPacientes();
        } catch (error) {
            console.error("No se pudieron cargar los pacientes del servidor:", error);
        }
    }

    cargarPacientesDelServidor();
});


// ==========================================
// FOTO DE PERFIL: se muestra en el botón de perfil
// (es la que se elige en Configuración)
// ==========================================
(function () {
    function mostrarFotoPerfil() {
        const foto = localStorage.getItem("fotoPerfil");
        const botonConFoto = document.getElementById("botonPerfilPacientes");

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
