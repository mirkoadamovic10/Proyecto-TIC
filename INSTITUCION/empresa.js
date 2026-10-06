const nombreUsuario =
    localStorage.getItem("nombreUsuario");


const saludoEmpresa =
    document.getElementById("saludoEmpresa");


if (nombreUsuario && saludoEmpresa) {

    saludoEmpresa.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}