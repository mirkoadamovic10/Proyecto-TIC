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

    const nombreUsuario = nombre.value.trim();

    localStorage.setItem("nombreUsuario", nombreUsuario);
    localStorage.setItem("emailUsuario", email.value.trim());
    localStorage.setItem("rolUsuario", rol.value);

    if (rol.value === "personal") {
        window.location.href = "PERSONAL/personal.html";
        return;
    }

    if (rol.value === "familia") {
        window.location.href = "FAMILIA/familia.html";
        return;
    }

    if (rol.value === "medico") {
        window.location.href = "MEDICO/medico.html";
        return;
    }

    if (rol.value === "escuela") {
        window.location.href = "ESCUELA/escuela.html";
        return;
    }

    if (rol.value === "empresa") {
        window.location.href = "EMPRESA/empresa.html";
        return;
    }

    alert("Registro realizado correctamente.");
});