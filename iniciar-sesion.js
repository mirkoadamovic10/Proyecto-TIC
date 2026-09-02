const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const botonLogin = document.querySelector(".login-button");

botonLogin.addEventListener("click", async () => {

    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value.trim();

    if (!usuario || !password) {
        alert("Por favor, completá ambos campos.");
        return;
    }

    if (usuario === "admin" && password === "123456") {
        alert("¡Bienvenido/a!");
        window.location.href = "pasaporte.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }

});

