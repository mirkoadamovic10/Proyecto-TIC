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
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-hospital";

            const nombre = document.createElement("h2");
            nombre.textContent = paciente.nombre || "Paciente";

            const email = document.createElement("p");
            email.textContent = paciente.email;

            const botonPasaporte = document.createElement("button");
            botonPasaporte.type = "button";
            botonPasaporte.className = "boton-ver-hospital";
            botonPasaporte.textContent = "Ver pasaporte";

            botonPasaporte.addEventListener("click", function () {
                localStorage.setItem(
                    "pacienteSeleccionadoHospital",
                    JSON.stringify(paciente)
                );

                window.location.href = "pasaporte-paciente.html";
            });

            tarjeta.append(nombre, email, botonPasaporte);
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

    formulario.addEventListener("submit", function (evento) {
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

        pacientes.push({
            id: Date.now(),
            email: email,
            nombre: "Paciente"
        });

        localStorage.setItem("pacientesHospital", JSON.stringify(pacientes));

        mostrarPacientes();
        formulario.reset();
        mensaje.textContent = "Paciente vinculado correctamente.";
    });

    mostrarPacientes();
});