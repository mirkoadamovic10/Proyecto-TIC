const API_URL = "http://localhost:3000/api/info-personal";

// Obtener el ID del usuario que inició sesión
const usuarioGuardado = localStorage.getItem("usuario");
const usuarioLogueado = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
const idUsuario = Number(
    localStorage.getItem("idUsuario") ||
    (usuarioLogueado ? usuarioLogueado.idUsuario : 1)
);

const formulario = document.getElementById("formularioInfo");
const botonGuardar = document.getElementById("botonGuardar");
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

// Al entrar a la página, cargar los datos guardados
async function cargarDatos() {
    activarCampos();

    if (botonGuardar) botonGuardar.style.display = "block";
    if (botonEditar) botonEditar.style.display = "none";

    try {
        const respuesta = await fetch(`${API_URL}/${idUsuario}`);

        if (!respuesta.ok) {
            console.log("Todavía no hay información personal guardada.");
            return;
        }

        const datos = await respuesta.json();

        campos.forEach(function(campo) {
            const elemento = document.getElementById(campo);

            if (elemento && datos[campo] !== undefined && datos[campo] !== null) {
                elemento.value = datos[campo];
            }
        });

        // Los campos quedan habilitados para poder escribir
        activarCampos();

        if (botonGuardar) botonGuardar.style.display = "block";
        if (botonEditar) botonEditar.style.display = "none";

        if (mensaje) {
            mensaje.textContent = "Información cargada correctamente.";
        }

    } catch (error) {
        console.error("Error al cargar la información:", error);

        activarCampos();

        if (botonGuardar) botonGuardar.style.display = "block";
        if (botonEditar) botonEditar.style.display = "none";
    }
}

// Guardar la información en el backend
async function guardarDatos() {
    const datos = {
        idUsuario: idUsuario
    };

    campos.forEach(function(campo) {
        const elemento = document.getElementById(campo);

        if (elemento) {
            if (campo === "edad") {
                datos[campo] = elemento.value ? Number(elemento.value) : 0;
            } else {
                datos[campo] = elemento.value;
            }
        }
    });

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert("Error al guardar: " + (resultado.error || "No se pudo guardar la información."));
            return;
        }

        if (mensaje) {
            mensaje.textContent = "Información guardada correctamente.";
        }

        // Después de guardar, se pueden seguir editando los campos
        activarCampos();

        if (botonGuardar) botonGuardar.style.display = "block";
        if (botonEditar) botonEditar.style.display = "none";

    } catch (error) {
        console.error("Error al guardar la información:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

// Habilitar todos los campos
function activarCampos() {
    campos.forEach(function(campo) {
        const elemento = document.getElementById(campo);

        if (elemento) {
            elemento.disabled = false;
        }
    });
}

// Deshabilitar todos los campos
function desactivarCampos() {
    campos.forEach(function(campo) {
        const elemento = document.getElementById(campo);

        if (elemento) {
            elemento.disabled = true;
        }
    });
}

// Cuando se envía el formulario, guardar los datos
if (formulario) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();
        await guardarDatos();
    });
}

// Cuando se aprieta Editar, habilitar los campos
if (botonEditar) {
    botonEditar.addEventListener("click", function() {
        activarCampos();

        if (botonGuardar) botonGuardar.style.display = "block";
        if (botonEditar) botonEditar.style.display = "none";

        if (mensaje) mensaje.textContent = "";
    });
}

// Cargar los datos al entrar
cargarDatos();