```javascript
// ========================================
// MENÚ PASAPORTE
// ========================================

const botonPasaporte =
    document.getElementById("botonPasaporte");

const submenuPasaporte =
    document.getElementById("submenuPasaporte");


// Abrir y cerrar el menú Pasaporte
if (botonPasaporte && submenuPasaporte) {

    botonPasaporte.addEventListener("click", function () {

        const estaOculto =
            submenuPasaporte.hidden;

        submenuPasaporte.hidden =
            !estaOculto;

        botonPasaporte.setAttribute(
            "aria-expanded",
            String(estaOculto)
        );

    });

}


// ========================================
// BOTONES DEL PASAPORTE
// ========================================

const botonesPasaporte =
    document.querySelectorAll(".boton-pasaporte");


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

    "Preferencias de aprendizaje":
        "preferencias-aprendizaje.html",

    "Formas de comunicación":
        "formas-comunicacion.html"

};


// Navegar a cada pantalla
botonesPasaporte.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const nombrePantalla =
            boton.textContent.trim();

        const pagina =
            pantallas[nombrePantalla];

        if (pagina) {

            window.location.href =
                "./" + pagina;

        }

    });

});
```
