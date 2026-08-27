const botonIniciarSesion = document.getElementById("iniciarSesion");
const botonRegistrarse = document.getElementById("registrarse");

botonIniciarSesion?.addEventListener("click", () => {
    window.location.href = "iniciar-sesion.html";
});

botonRegistrarse?.addEventListener("click", () => {
    window.location.href = "registrarse.html";
});