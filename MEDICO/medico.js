const nombreUsuario = localStorage.getItem("nombreUsuario");
const saludoMedico = document.getElementById("saludoMedico");

if (nombreUsuario && saludoMedico) {
    saludoMedico.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
}