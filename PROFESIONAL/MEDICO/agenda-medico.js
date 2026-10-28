
document.addEventListener("DOMContentLoaded", () => {
    const mesActual = document.getElementById("mesActual");
    const calendarioDias = document.getElementById("calendarioDias");
    const mesAnterior = document.getElementById("mesAnterior");
    const mesSiguiente = document.getElementById("mesSiguiente");

    const modalAgenda = document.getElementById("modalAgenda");
    const cerrarModal = document.getElementById("cerrarModal");
    const fechaSeleccionada = document.getElementById("fechaSeleccionada");
    const turnosDelDia = document.getElementById("turnosDelDia");
    const formularioTurno = document.getElementById("formularioTurno");

    const nombrePaciente = document.getElementById("nombrePaciente");
    const horaTurno = document.getElementById("horaTurno");
    const motivoConsulta = document.getElementById("motivoConsulta");
    const tipoTurno = document.getElementById("tipoTurno");

    const CLAVE_TURNOS = "agendaTurnosMedico";

    let fechaVisible = new Date();
    let fechaElegida = "";

    function obtenerTurnos() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || {};
        } catch (error) {
            return {};
        }
    }

    function guardarTurnos(turnos) {
        localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
    }

    function fechaISO(anio, mes, dia) {
        return [
            anio,
            String(mes + 1).padStart(2, "0"),
            String(dia).padStart(2, "0")
        ].join("-");
    }

    function renderizarCalendario() {
        const anio = fechaVisible.getFullYear();
        const mes = fechaVisible.getMonth();

        mesActual.textContent = new Date(anio, mes, 1)
            .toLocaleDateString("es-AR", {
                month: "long",
                year: "numeric"
            });

        calendarioDias.replaceChildren();

        // JavaScript usa domingo = 0. El calendario comienza el lunes.
        const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;
        const cantidadDias = new Date(anio, mes + 1, 0).getDate();

        for (let i = 0; i < primerDia; i++) {
            const espacio = document.createElement("div");
            espacio.className = "dia-calendario vacio";
            espacio.setAttribute("aria-hidden", "true");
            calendarioDias.appendChild(espacio);
        }

        const hoy = new Date();
        const claveHoy = fechaISO(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        );

        const turnos = obtenerTurnos();

        for (let dia = 1; dia <= cantidadDias; dia++) {
            const claveFecha = fechaISO(anio, mes, dia);
            const botonDia = document.createElement("button");

            botonDia.type = "button";
            botonDia.className = "dia-calendario";

            if (claveFecha === claveHoy) {
                botonDia.classList.add("hoy");
            }

            const numero = document.createElement("span");
            numero.className = "numero-dia";
            numero.textContent = dia;
            botonDia.appendChild(numero);

            const turnosFecha = turnos[claveFecha] || [];

            turnosFecha.forEach((turno) => {
                const indicador = document.createElement("span");
                indicador.className = "indicador-turno";
                indicador.textContent = `${turno.hora} ${turno.paciente}`;
                botonDia.appendChild(indicador);
            });

            botonDia.addEventListener("click", () => {
                abrirModal(claveFecha);
            });

            calendarioDias.appendChild(botonDia);
        }
    }

    function abrirModal(claveFecha) {
        fechaElegida = claveFecha;

        const [anio, mes, dia] = claveFecha.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, dia);

        fechaSeleccionada.textContent = fecha.toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        formularioTurno.reset();
        renderizarTurnosDelDia();

        modalAgenda.hidden = false;
        nombrePaciente.focus();
    }

    function cerrarVentana() {
        modalAgenda.hidden = true;
        fechaElegida = "";
    }

    function renderizarTurnosDelDia() {
        turnosDelDia.replaceChildren();

        const turnos = obtenerTurnos();
        const lista = turnos[fechaElegida] || [];

        if (lista.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No hay turnos para este día.";
            turnosDelDia.appendChild(mensaje);
            return;
        }

        lista.forEach((turno, indice) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "turno-guardado";

            const detalle = document.createElement("div");
            const titulo = document.createElement("strong");
            titulo.textContent = `${turno.hora} — ${turno.paciente}`;

            const motivo = document.createElement("p");
            motivo.textContent = turno.motivo || "Sin motivo especificado.";

            const tipo = document.createElement("p");
            tipo.textContent = `Tipo: ${etiquetaTipo(turno.tipo)}`;

            detalle.append(titulo, motivo, tipo);

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "eliminar-turno";
            eliminar.textContent = "Eliminar";
            eliminar.setAttribute("aria-label", `Eliminar turno de ${turno.paciente}`);

            eliminar.addEventListener("click", () => {
                const turnosActuales = obtenerTurnos();
                turnosActuales[fechaElegida].splice(indice, 1);

                if (turnosActuales[fechaElegida].length === 0) {
                    delete turnosActuales[fechaElegida];
                }

                guardarTurnos(turnosActuales);
                renderizarCalendario();
                renderizarTurnosDelDia();
            });

            tarjeta.append(eliminar, detalle);
            turnosDelDia.appendChild(tarjeta);
        });
    }

    function etiquetaTipo(tipo) {
        const etiquetas = {
            "primera-consulta": "Primera consulta",
            "sesion": "Sesión",
            "seguimiento": "Seguimiento",
            "control": "Control"
        };

        return etiquetas[tipo] || tipo;
    }

    mesAnterior.addEventListener("click", () => {
        fechaVisible = new Date(
            fechaVisible.getFullYear(),
            fechaVisible.getMonth() - 1,
            1
        );

        renderizarCalendario();
    });

    mesSiguiente.addEventListener("click", () => {
        fechaVisible = new Date(
            fechaVisible.getFullYear(),
            fechaVisible.getMonth() + 1,
            1
        );

        renderizarCalendario();
    });

    cerrarModal.addEventListener("click", cerrarVentana);

    modalAgenda.addEventListener("click", (evento) => {
        if (evento.target === modalAgenda) {
            cerrarVentana();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !modalAgenda.hidden) {
            cerrarVentana();
        }
    });

    formularioTurno.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!fechaElegida) return;

        const paciente = nombrePaciente.value.trim();
        const hora = horaTurno.value;
        const tipo = tipoTurno.value;

        if (!paciente || !hora || !tipo) {
            alert("Completá el paciente, la hora y el tipo de turno.");
            return;
        }

        const turnos = obtenerTurnos();

        if (!turnos[fechaElegida]) {
            turnos[fechaElegida] = [];
        }

        turnos[fechaElegida].push({
            paciente,
            hora,
            motivo: motivoConsulta.value.trim(),
            tipo
        });

        turnos[fechaElegida].sort((a, b) =>
            a.hora.localeCompare(b.hora)
        );

        guardarTurnos(turnos);
        renderizarCalendario();
        renderizarTurnosDelDia();
        formularioTurno.reset();
    });

    renderizarCalendario();
});
