const nombreUsuario = localStorage.getItem("nombreUsuario");
const saludoFamilia = document.getElementById("saludoFamilia");

if (nombreUsuario && saludoFamilia) {
    saludoFamilia.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
}