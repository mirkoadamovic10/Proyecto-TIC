```javascript
document.addEventListener("DOMContentLoaded", () => {
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

    const CLAVE = "informacionPersonalMedico";

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

    // Carga la información guardada.
    function cargarInformacion() {
        const datosGuardados = localStorage.getItem(CLAVE);

        if (!datosGuardados) {
            establecerEdicion(true);
            return;
        }

        try {
            const datos = JSON.parse(datosGuardados);

            campos.forEach((id) => {
                const campo = document.getElementById(id);

                if (campo && datos[id] !== undefined) {
                    campo.value = datos[id];
                }
            });

            establecerEdicion(false);
            mensaje.textContent = "Información cargada correctamente.";
            mensaje.style.color = "#397D8C";
        } catch (error) {
            console.error("No se pudo cargar la información:", error);
            establecerEdicion(true);
        }
    }

    // Guarda los datos del formulario.
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const datos = {};

        campos.forEach((id) => {
            const campo = document.getElementById(id);

            if (campo) {
                datos[id] = campo.value.trim();
            }
        });

        try {
            localStorage.setItem(CLAVE, JSON.stringify(datos));

            establecerEdicion(false);
            mensaje.textContent = "¡Información guardada correctamente!";
            mensaje.style.color = "#397D8C";
        } catch (error) {
            console.error("No se pudo guardar la información:", error);
            mensaje.textContent = "No se pudo guardar la información.";
            mensaje.style.color = "#B00020";
        }
    });

    // Permite volver a editar los datos.
    botonEditar.addEventListener("click", () => {
        establecerEdicion(true);

        mensaje.textContent = "Podés editar tu información.";
        mensaje.style.color = "#397D8C";
    });

    cargarInformacion();
});
```