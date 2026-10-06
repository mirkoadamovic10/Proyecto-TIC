// Obtener empleado seleccionado

const empleadoGuardado =
    localStorage.getItem("empleadoSeleccionado");


if (!empleadoGuardado) {

    alert("No se encontró el empleado.");

    window.location.href = "empleados.html";

} else {

    const empleado =
        JSON.parse(empleadoGuardado);


    // Nombre del empleado

    const nombreEmpleado =
        document.getElementById("nombreEmpleado");


    if (nombreEmpleado) {

        nombreEmpleado.textContent =
            empleado.nombre || "Empleado";

    }


    // Preferencias de trabajo

    const preferencias =
        empleado.preferenciasTrabajo;


    if (preferencias) {

        document.getElementById("comunicacion").textContent =
            preferencias.comunicacion || "No especificado";


        document.getElementById("ambiente").textContent =
            preferencias.ambiente || "No especificado";


        document.getElementById("organizacion").textContent =
            preferencias.organizacion || "No especificado";


        document.getElementById("adaptaciones").textContent =
            preferencias.adaptaciones || "No especificado";


        document.getElementById("otrasPreferencias").textContent =
            preferencias.otras || "No especificado";

    }

}