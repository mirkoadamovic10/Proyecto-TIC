document.addEventListener("DOMContentLoaded", function () {

    const nombreUsuario =
        localStorage.getItem("nombreUsuario");

    const fotoUsuario =
        localStorage.getItem("fotoPerfil");

    const saludoMedico =
        document.getElementById("saludoMedico");

    const perfilMedico =
        document.getElementById("perfilMedico");


    if (nombreUsuario && saludoMedico) {

        saludoMedico.textContent =
            `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

    }


    if (fotoUsuario && perfilMedico) {

        perfilMedico.style.backgroundImage =
            `url("${fotoUsuario}")`;

        perfilMedico.style.backgroundSize =
            "cover";

        perfilMedico.style.backgroundPosition =
            "center";

        perfilMedico.classList.add("tiene-foto");

    }

});