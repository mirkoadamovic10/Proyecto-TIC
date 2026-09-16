document.addEventListener("DOMContentLoaded", function () {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const fotoUsuario = localStorage.getItem("fotoPerfil");

    const saludoMedico = document.getElementById("saludoMedico");
    const perfilAgenda = document.getElementById("perfilAgenda");

    // Saludo personalizado
    if (nombreUsuario && saludoMedico) {
        saludoMedico.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
    }

    // Cargar foto de perfil en el avatar superior
    if (fotoUsuario && perfilAgenda) {
        perfilAgenda.style.backgroundImage = `url("${fotoUsuario}")`;
        perfilAgenda.style.backgroundSize = "cover";
        perfilAgenda.style.backgroundPosition = "center";
        perfilAgenda.classList.add("tiene-foto");
    }
});