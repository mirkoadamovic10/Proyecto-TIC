document.addEventListener("DOMContentLoaded", function () {

    const nombreUsuario =
        localStorage.getItem("nombreUsuario");

    const fotoUsuario =
        localStorage.getItem("fotoPerfil");

    const saludoHospital =
        document.getElementById("saludoHospital");

    const perfilHospital =
        document.getElementById("perfilHospital");


    if (nombreUsuario && saludoHospital) {

        saludoHospital.textContent =
            `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

    }


    if (fotoUsuario && perfilHospital) {

        perfilHospital.style.backgroundImage =
            `url("${fotoUsuario}")`;

        perfilHospital.style.backgroundSize = "cover";

        perfilHospital.style.backgroundPosition = "center";

        perfilHospital.classList.add("tiene-foto");

    }

});