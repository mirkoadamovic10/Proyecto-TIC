const botonIniciarSesion = document.getElementById("iniciarSesion");
const botonRegistrarse = document.getElementById("registrarse");

if (botonIniciarSesion) {
    botonIniciarSesion.addEventListener("click", () => {
        window.location.href = "iniciar-sesion/iniciar-sesion.html";
    });
}

if (botonRegistrarse) {
    botonRegistrarse.addEventListener("click", () => {
        window.location.href = "registrarse.html";
    });
}