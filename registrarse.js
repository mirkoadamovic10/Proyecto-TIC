const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rol = document.getElementById("rol");
const botonRegistrarse = document.querySelector(".register-button");

botonRegistrarse.addEventListener("click", function(event) {

    event.preventDefault();

    if (
        nombre.value.trim() === "" ||
        email.value.trim() === "" ||
        password.value.trim() === "" ||
        rol.value === ""
    ) {
        alert("Por favor, completá todos los datos.");
        return;
    }

    if (rol.value === "personal") {
        window.location.href = "PERSONAL/personal.html";
        return;
    }

    alert("Registro realizado correctamente.");

});