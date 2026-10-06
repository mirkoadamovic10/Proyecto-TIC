const nombreUsuario =
    localStorage.getItem("nombreUsuario");


const saludoInstitucion =
    document.getElementById("saludoInstitucion");


if (nombreUsuario && saludoInstitucion) {

    saludoInstitucion.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}