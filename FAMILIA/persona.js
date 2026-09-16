const listaPersonas =
    document.getElementById("listaPersonas");

let personasVinculadas =
    JSON.parse(
        localStorage.getItem("personasVinculadas")
    ) || [];

if (personasVinculadas.length === 0) {

    const mensaje = document.createElement("p");

    mensaje.textContent =
        "Todavía no tenés ninguna persona vinculada.";

    listaPersonas.appendChild(mensaje);

} else {

    personasVinculadas.forEach(function(persona, indice) {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.classList.add("persona-vinculada");

        boton.textContent = persona.nombre;

        boton.addEventListener("click", function() {

            localStorage.setItem(
                "personaSeleccionada",
                String(indice)
            );

            window.location.href =
                "datos-persona.html";

        });

        listaPersonas.appendChild(boton);

    });

}