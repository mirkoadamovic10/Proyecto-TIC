const inputUsuario = document.getElementById("usuario") as HTMLInputElement | null;
const inputPassword = document.getElementById("password") as HTMLInputElement | null;
const botonLogin = document.querySelector(".login-button") as HTMLButtonElement | null;

botonLogin?.addEventListener("click", async () => {
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
            body: JSON.stringify({ usuario, password })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.error || "Error al iniciar sesión.");
            return;
        }

        // Guardar token/sesión si corresponde
        localStorage.setItem("token", data.token);

        alert("¡Bienvenido/a!");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
});