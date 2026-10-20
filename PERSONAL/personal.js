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

        const pagina = pantallas[nombrePantalla];

        if (pagina) {
            submenuPasaporte.hidden = true;
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

        botonPerfil.setAttribute(
            "aria-expanded",
            String(abierto)
        );

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


const fotoPerfil = localStorage.getItem("fotoPerfil");

if (botonPerfil && fotoPerfil) {

    const imagenPerfil = document.createElement("img");

    imagenPerfil.src = fotoPerfil;
    imagenPerfil.alt = "Foto de perfil";
    imagenPerfil.classList.add("imagen-perfil");

    botonPerfil.appendChild(imagenPerfil);

    const cabeza = botonPerfil.querySelector(".cabeza");
    const cuerpo = botonPerfil.querySelector(".cuerpo");

    if (cabeza) {
        cabeza.style.display = "none";
    }

    if (cuerpo) {
        cuerpo.style.display = "none";
    }

}

if (botonPasaporte && submenuPasaporte && cerrarPasaporte) {

    botonPasaporte.addEventListener("click", () => {
        submenuPasaporte.hidden = false;
        botonPasaporte.setAttribute("aria-expanded", "true");
    });

    cerrarPasaporte.addEventListener("click", () => {
        submenuPasaporte.hidden = true;
        botonPasaporte.setAttribute("aria-expanded", "false");
    });

    submenuPasaporte.addEventListener("click", (evento) => {
        if (evento.target === submenuPasaporte) {
            submenuPasaporte.hidden = true;
            botonPasaporte.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !submenuPasaporte.hidden) {
            submenuPasaporte.hidden = true;
            botonPasaporte.setAttribute("aria-expanded", "false");
        }
    });
}