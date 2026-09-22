document.addEventListener("DOMContentLoaded", function () {

    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const fotoUsuario = localStorage.getItem("fotoPerfil");

    const saludoTerapista =
        document.getElementById("saludoTerapista");

    const perfilTerapista =
        document.getElementById("perfilTerapista");


    if (nombreUsuario && saludoTerapista) {

        saludoTerapista.textContent =
            `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

    }


    if (fotoUsuario && perfilTerapista) {

        perfilTerapista.style.backgroundImage =
            `url("${fotoUsuario}")`;

        perfilTerapista.style.backgroundSize = "cover";

        perfilTerapista.style.backgroundPosition = "center";

        perfilTerapista.classList.add("tiene-foto");

    }

});