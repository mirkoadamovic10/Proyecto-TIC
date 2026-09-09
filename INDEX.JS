const botonRegistrarse = document.getElementById("registrarse");

if (botonRegistrarse) {
    botonRegistrarse.addEventListener("click", () => {
        window.location.href = "registrarse.html";
    });
}