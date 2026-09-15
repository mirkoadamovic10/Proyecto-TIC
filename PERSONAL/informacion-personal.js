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

function guardarDatos() {
    const datos = {};

    campos.forEach(function(campo) {
        datos[campo] = document.getElementById(campo).value;
    });

    localStorage.setItem("informacionPersonal", JSON.stringify(datos));
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem("informacionPersonal");

    if (!datosGuardados) {
        return;
    }

    const datos = JSON.parse(datosGuardados);

    campos.forEach(function(campo) {
        const elemento = document.getElementById(campo);

        if (elemento && datos[campo] !== undefined) {
            elemento.value = datos[campo];
        }
    });

    desactivarCampos();

    botonGuardar.style.display = "none";
    botonEditar.style.display = "block";

    mensaje.textContent = "Tu información está guardada.";
}

function desactivarCampos() {
    campos.forEach(function(campo) {
        document.getElementById(campo).disabled = true;
    });
}

function activarCampos() {
    campos.forEach(function(campo) {
        document.getElementById(campo).disabled = false;
    });
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    guardarDatos();

    desactivarCampos();

    botonGuardar.style.display = "none";
    botonEditar.style.display = "block";

    mensaje.textContent = "Información guardada correctamente.";
});

botonEditar.addEventListener("click", function() {
    activarCampos();

    botonGuardar.style.display = "block";
    botonEditar.style.display = "none";

    mensaje.textContent = "";
});

cargarDatos();