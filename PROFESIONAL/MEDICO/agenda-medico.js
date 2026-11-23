
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
    let fechasConAlerta = [];

    // =====================================
    // API: AGENDA Y ALERTAS
    // POST /api/agenda  · GET /api/agenda/:idUsuario
    // POST /api/alertas · GET /api/alertas/:idUsuario
    // =====================================

    const URL_API = "http://localhost:3000/api";

    function idUsuarioActual() {
        return Number(localStorage.getItem("idUsuario")) || 1;
    }

    async function guardarTurnoEnServidor(fecha, turno) {
        const idUsuario = idUsuarioActual();

        try {
            await fetch(`${URL_API}/agenda`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario,
                    fecha,
                    hora: turno.hora,
                    tipo: turno.tipo,
                    descripcion: turno.motivo,
                    titulo: turno.paciente
                })
            });

            await fetch(`${URL_API}/alertas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario,
                    tipoAlerta: turno.tipo,
                    fecha,
                    estado: "pendiente",
                    mensaje: `${turno.paciente} a las ${turno.hora}`
                })
            });

            fechasConAlerta.push(fecha);
            renderizarCalendario();
        } catch (error) {
            console.error("No se pudo guardar el turno en el servidor:", error);
        }
    }

    async function cargarDesdeServidor() {
        const idUsuario = idUsuarioActual();

        try {
            const respuestaAgenda = await fetch(`${URL_API}/agenda/${idUsuario}`);

            if (respuestaAgenda.ok) {
                const eventos = await respuestaAgenda.json();
                const turnos = obtenerTurnos();

                // Suma los turnos del servidor que no estén en este navegador
                eventos.forEach((evento) => {
                    const lista = turnos[evento.fecha] || [];
                    const yaEsta = lista.some((turno) =>
                        turno.hora === evento.hora && turno.paciente === evento.titulo
                    );

                    if (!yaEsta) {
                        lista.push({
                            paciente: evento.titulo || "Evento",
                            hora: evento.hora,
                            motivo: evento.descripcion || "",
                            tipo: evento.tipo
                        });
                        lista.sort((a, b) => a.hora.localeCompare(b.hora));
                        turnos[evento.fecha] = lista;
                    }
                });

                guardarTurnos(turnos);
            }

            const respuestaAlertas = await fetch(`${URL_API}/alertas/${idUsuario}`);

            if (respuestaAlertas.ok) {
                const alertas = await respuestaAlertas.json();
                fechasConAlerta = alertas
                    .filter((alerta) => alerta.estado !== "vista")
                    .map((alerta) => alerta.fecha);
            }

            renderizarCalendario();
        } catch (error) {
            console.error("No se pudo cargar la agenda del servidor:", error);
        }
    }

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

        const nombreMes = new Date(anio, mes, 1)
            .toLocaleDateString("es-AR", { month: "long" });

        // "Octubre 2026"
        mesActual.textContent =
            nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1) + " " + anio;

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

            if (fechasConAlerta.includes(claveFecha)) {
                botonDia.classList.add("con-alerta");
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
        marcarFecha();
        renderizarTurnosDelDia();

        modalAgenda.hidden = false;
        nombrePaciente.focus();
    }

    // Muestra en el formulario la fecha del turno
    function marcarFecha() {
        const campoFecha = document.getElementById("fechaEvento");

        if (campoFecha) {
            campoFecha.value = fechaElegida;
        }
    }

    // Para el botón "+ Agregar evento" y el campo Fecha del formulario
    window.abrirModalMedico = abrirModal;

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
            "turno": "Turno médico",
            "estudio": "Estudio médico",
            "terapia": "Terapia",
            "medicacion": "Medicación",
            "primera-consulta": "Primera consulta",
            "sesion": "Sesión",
            "seguimiento": "Seguimiento",
            "control": "Control / seguimiento"
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
            alert("Completá el nombre del evento, la hora y el tipo de evento.");
            return;
        }

        const turnos = obtenerTurnos();

        if (!turnos[fechaElegida]) {
            turnos[fechaElegida] = [];
        }

        const nuevoTurno = {
            paciente,
            hora,
            motivo: motivoConsulta.value.trim(),
            tipo
        };

        turnos[fechaElegida].push(nuevoTurno);

        turnos[fechaElegida].sort((a, b) =>
            a.hora.localeCompare(b.hora)
        );

        guardarTurnos(turnos);
        guardarTurnoEnServidor(fechaElegida, nuevoTurno);
        renderizarCalendario();
        renderizarTurnosDelDia();
        formularioTurno.reset();
        marcarFecha();
    });

    renderizarCalendario();
    cargarDesdeServidor();
});
