// ========================================
// MENÚ PASAPORTE
// ========================================

const botonPasaporte = document.getElementById("botonPasaporte");
const submenuPasaporte = document.getElementById("submenuPasaporte");

if (botonPasaporte && submenuPasaporte) {

    botonPasaporte.addEventListener("click", function () {

        const estaOculto = submenuPasaporte.hidden;

        submenuPasaporte.hidden = !estaOculto;

        botonPasaporte.setAttribute(
            "aria-expanded",
            String(estaOculto)
        );

    });

}


// ========================================
// BOTONES DEL PASAPORTE
// ========================================

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


// ========================================
// NAVEGAR A LAS PANTALLAS
// ========================================

botonesPasaporte.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const nombrePantalla = boton.textContent.trim();

        const pagina = pantallas[nombrePantalla];

        if (pagina) {
            window.location.href = pagina;
        }

    });

});
const nombreUsuario = localStorage.getItem("nombreUsuario");

const saludoUsuario = document.getElementById("saludoUsuario");

if (nombreUsuario && saludoUsuario) {
    saludoUsuario.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
}
const botonPerfil = document.getElementById("botonPerfil");
const submenuPerfil = document.getElementById("submenuPerfil");

if (botonPerfil && submenuPerfil) {
    botonPerfil.addEventListener("click", function () {
        const abierto = submenuPerfil.classList.toggle("activo");
        botonPerfil.setAttribute("aria-expanded", abierto);
    });

    const opcionesPerfil = submenuPerfil.querySelectorAll("button");

    opcionesPerfil.forEach(function (opcion) {
        opcion.addEventListener("click", function () {
            const pagina = opcion.getAttribute("data-pagina");

            if (pagina) {
                window.location.href = pagina;
            }
        });
    });
}