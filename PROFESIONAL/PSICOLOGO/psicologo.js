const nombreUsuario =
    localStorage.getItem("nombreUsuario");

const saludoPsicologo =
    document.getElementById("saludoPsicologo");

if (
    nombreUsuario &&
    saludoPsicologo
) {

    saludoPsicologo.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}