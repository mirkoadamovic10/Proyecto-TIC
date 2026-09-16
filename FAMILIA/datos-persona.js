const nombrePersona =
    document.getElementById("nombrePersona");

const informacionPersonal =
    document.getElementById("informacionPersonal");

const informacionPasaporte =
    document.getElementById("informacionPasaporte");

const indiceSeleccionado =
    Number(
        localStorage.getItem("personaSeleccionada")
    );

const personasVinculadas =
    JSON.parse(
        localStorage.getItem("personasVinculadas")
    ) || [];

const persona =
    personasVinculadas[indiceSeleccionado];

if (!persona) {

    nombrePersona.textContent =
        "Persona no encontrada";

} else {

    nombrePersona.textContent =
        persona.nombre;

    const mensajePersonal =
        document.createElement("p");

    mensajePersonal.textContent =
        "Acá aparecerá la información personal de esta persona.";

    informacionPersonal.appendChild(
        mensajePersonal
    );

    const mensajePasaporte =
        document.createElement("p");

    mensajePasaporte.textContent =
        "Acá aparecerá su Pasaporte.";

    informacionPasaporte.appendChild(
        mensajePasaporte
    );

}