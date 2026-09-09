const formulario = document.querySelector("form");

const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

formulario?.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const usuario = inputUsuario?.value.trim() || "";
    const password = inputPassword?.value.trim() || "";

    if (!usuario || !password) {
        alert("Por favor, completá toda la información.");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.error || "Error al iniciar sesión.");
            return;
        }

        localStorage.setItem("token", data.token);

        alert("¡Bienvenido/a!");

        window.location.href = "../index.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
});