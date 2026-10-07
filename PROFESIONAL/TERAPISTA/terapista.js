const nombreUsuario =
    localStorage.getItem("nombreUsuario");

const saludoTerapista =
    document.getElementById("saludoTerapista");

if (
    nombreUsuario &&
    saludoTerapista
) {
    saludoTerapista.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
}