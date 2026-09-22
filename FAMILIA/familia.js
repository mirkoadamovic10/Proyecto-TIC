document.addEventListener("DOMContentLoaded", function () {

    const nombreUsuario =
        localStorage.getItem("nombreUsuario");

    const fotoUsuario =
        localStorage.getItem("fotoPerfil");

    const saludoFamilia =
        document.getElementById("saludoFamilia");

    const perfilFamilia =
        document.getElementById("perfilFamilia");


    if (nombreUsuario && saludoFamilia) {

        saludoFamilia.textContent =
            `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

    }


    if (fotoUsuario && perfilFamilia) {

        perfilFamilia.style.backgroundImage =
            `url("${fotoUsuario}")`;

        perfilFamilia.style.backgroundSize =
            "cover";

        perfilFamilia.style.backgroundPosition =
            "center";

        perfilFamilia.classList.add("tiene-foto");

    }

});