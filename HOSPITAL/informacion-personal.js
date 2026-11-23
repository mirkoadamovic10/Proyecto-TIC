document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api/info-personal";

    const formulario = document.getElementById("formularioInfo");
    const botonEditar = document.getElementById("botonEditar");
    const mensaje = document.getElementById("mensaje");

    const campos = [
        "apellidoNombre",
        "documento",
        "fechaNacimiento",
        "edad",
        "sexo",
        "domicilio",
        "telFijo",
        "grupoSanguineo",
        "factorRh",
        "madre",
        "celularMadre",
        "padre",
        "celularPadre"
    ];

    // Respaldo local por si el servidor no está levantado
    const CLAVE = "informacionPersonalHospital";

    function obtenerIdUsuario() {
        const id = localStorage.getItem("idUsuario");

        if (id) {
            return Number(id);
        }

        try {
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            return usuario && usuario.idUsuario ? Number(usuario.idUsuario) : null;
        } catch (error) {
            return null;
        }
    }

    const idUsuario = obtenerIdUsuario();

    // Habilita o deshabilita los campos del formulario.
    function establecerEdicion(habilitado) {
        campos.forEach((id) => {
            const campo = document.getElementById(id);

            if (campo) {
                campo.disabled = !habilitado;
            }
        });

        formulario.querySelector('button[type="submit"]').disabled = !habilitado;
        botonEditar.disabled = habilitado;

        formulario.querySelector('button[type="submit"]').style.opacity =
            habilitado ? "1" : "0.6";

        botonEditar.style.opacity = habilitado ? "0.6" : "1";
    }

    function completarFormulario(datos) {
        campos.forEach((id) => {
            const campo = document.getElementById(id);

            if (campo && datos[id] !== undefined && datos[id] !== null) {
                campo.value = datos[id];
            }
        });
    }

    function mostrarMensaje(texto, error) {
        mensaje.textContent = texto;
        mensaje.style.color = error ? "#B00020" : "#397D8C";
    }

    // GET /api/info-personal/:idUsuario
    async function cargarInformacion() {
        if (idUsuario) {
            try {
                const respuesta = await fetch(`${API_URL}/${idUsuario}`);

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    completarFormulario(datos);
                    localStorage.setItem(CLAVE, JSON.stringify(datos));
                    establecerEdicion(false);
                    mostrarMensaje("Información cargada correctamente.");
                    return;
                }
            } catch (error) {
                console.error("No se pudo conectar con el servidor:", error);
            }
        }

        // Si no hay datos en el servidor, se usa la copia local
        try {
            const guardados = JSON.parse(localStorage.getItem(CLAVE));

            if (guardados) {
                completarFormulario(guardados);
                establecerEdicion(false);
                mostrarMensaje("Información cargada correctamente.");
                return;
            }
        } catch (error) {
            console.error("No se pudo cargar la información:", error);
        }

        establecerEdicion(true);
    }

    // POST /api/info-personal
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const datos = { idUsuario: idUsuario };

        campos.forEach((id) => {
            const campo = document.getElementById(id);

            if (campo) {
                datos[id] = id === "edad"
                    ? (campo.value ? Number(campo.value) : 0)
                    : campo.value.trim();
            }
        });

        localStorage.setItem(CLAVE, JSON.stringify(datos));

        if (!idUsuario) {
            establecerEdicion(false);
            mostrarMensaje("Se guardó en este navegador (no hay sesión iniciada).");
            return;
        }

        try {
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok) {
                throw new Error(resultado.error || "No se pudo guardar la información.");
            }

            establecerEdicion(false);
            mostrarMensaje("¡Información guardada correctamente!");
        } catch (error) {
            console.error("No se pudo guardar la información:", error);
            mostrarMensaje(error.message || "No se pudo guardar la información.", true);
        }
    });

    // Permite volver a editar los datos.
    botonEditar.addEventListener("click", () => {
        establecerEdicion(true);
        mostrarMensaje("Podés editar tu información.");
    });

    cargarInformacion();
});


// ==========================================
// VOLVER: a la pantalla anterior, o al inicio si se entró directo
// ==========================================
document.querySelectorAll("[data-volver]").forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();

        if (document.referrer && window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "hospital.html";
        }
    });
});
