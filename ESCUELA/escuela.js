const nombreEscuela = localStorage.getItem("nombreUsuario");

const saludoEscuela = document.getElementById("saludoEscuela");

if (nombreEscuela && saludoEscuela) {
    saludoEscuela.textContent =
        `¡Hola ${nombreEscuela}! Bienvenido a NeuroPassport`;
}


const botonPerfil = document.getElementById("botonPerfil");
const submenuPerfil = document.getElementById("submenuPerfil");

if (botonPerfil && submenuPerfil) {

    botonPerfil.addEventListener("click", function(event) {

        event.stopPropagation();

        submenuPerfil.hidden = !submenuPerfil.hidden;

    });

    document.addEventListener("click", function() {
        submenuPerfil.hidden = true;
    });

}