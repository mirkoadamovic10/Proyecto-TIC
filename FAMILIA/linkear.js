const botonLinkear = document.getElementById("botonLinkear");
const codigo = document.getElementById("codigo");
const mensajeLinkear = document.getElementById("mensajeLinkear");

botonLinkear.addEventListener("click", function() {

    const codigoIngresado = codigo.value.trim();

    if (codigoIngresado === "") {
        mensajeLinkear.textContent = "Ingresá un código.";
        return;
    }

    let personasVinculadas =
        JSON.parse(localStorage.getItem("personasVinculadas")) || [];

    const persona = {
        codigo: codigoIngresado,
        nombre: "Persona " + (personasVinculadas.length + 1)
    };

    personasVinculadas.push(persona);

    localStorage.setItem(
        "personasVinculadas",
        JSON.stringify(personasVinculadas)
    );

    mensajeLinkear.textContent =
        "Persona vinculada correctamente.";

    codigo.value = "";

});