const botonPasaporte = document.getElementById("botonPasaporte");
const submenuPasaporte = document.getElementById("submenuPasaporte");

botonPasaporte.addEventListener("click", function () {
    const abierto = submenuPasaporte.style.display === "grid";

    submenuPasaporte.style.display = abierto ? "none" : "grid";
    botonPasaporte.setAttribute("aria-expanded", String(!abierto));
});

const botonesPasaporte = document.querySelectorAll(".boton-pasaporte");

botonesPasaporte.forEach(function (boton) {
    boton.addEventListener("click", function () {
        alert("Seleccionaste: " + boton.textContent.trim());
    });
});