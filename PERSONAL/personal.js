const botonPasaporte = document.getElementById("botonPasaporte");
const submenuPasaporte = document.getElementById("submenuPasaporte");

if (botonPasaporte && submenuPasaporte) {
    botonPasaporte.addEventListener("click", function () {
        const abierto = submenuPasaporte.style.display === "grid";

        submenuPasaporte.style.display = abierto ? "none" : "grid";
        botonPasaporte.setAttribute("aria-expanded", String(!abierto));
    });
}


const botonesPasaporte = document.querySelectorAll(".boton-pasaporte");

const pantallas = {
    "Diagnósticos": "diagnosticos.html",
    "Medicación": "medicacion.html",
    "Alergias": "alergias.html",
    "Estudios": "estudios.html",
    "Terapias": "terapias.html",
    "Cirugías": "cirugias.html",
    "Contactos": "contactos.html",
    "Cobertura médica": "cobertura.html",
    "Certificados": "certificados.html",
    "Adaptaciones": "adaptaciones.html",
    "Objetivos": "objetivos.html",
    "Preferencias de aprendizaje": "preferencias-aprendizaje.html",
    "Formas de comunicación": "formas-comunicacion.html"
};

botonesPasaporte.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const nombrePantalla = boton.textContent.trim();

        if (pantallas[nombrePantalla]) {
            window.location.href = pantallas[nombrePantalla];
        }

    });

});


const botonAgenda = document.getElementById("botonAgenda");

if (botonAgenda) {

    botonAgenda.addEventListener("click", function () {
        window.location.href = "agenda.html";
    });

}