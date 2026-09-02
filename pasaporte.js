let paginaActual = 0;

const paginas = document.querySelectorAll(".pagina-pasaporte");
const botonAnterior = document.getElementById("anterior");
const botonSiguiente = document.getElementById("siguiente");
const numeroPagina = document.getElementById("numero-pagina");


// CAMBIAR DE PÁGINA

function mostrarPagina(numero) {

    paginas.forEach((pagina, indice) => {
        pagina.classList.remove("activa");

        if (indice === numero) {
            pagina.classList.add("activa");
        }
    });

    numeroPagina.textContent = `${numero + 1} / ${paginas.length}`;

    botonAnterior.disabled = numero === 0;
    botonSiguiente.disabled = numero === paginas.length - 1;
}


// BOTÓN ANTERIOR

botonAnterior.addEventListener("click", () => {

    if (paginaActual > 0) {
        paginaActual--;
        mostrarPagina(paginaActual);
    }

});


// BOTÓN SIGUIENTE

botonSiguiente.addEventListener("click", () => {

    if (paginaActual < paginas.length - 1) {
        paginaActual++;
        mostrarPagina(paginaActual);
    }

});


// FUNCIÓN PARA GUARDAR INFORMACIÓN

function guardarInformacion(clave, campos) {

    const informacion = {};

    campos.forEach(id => {

        const elemento = document.getElementById(id);

        if (elemento) {
            informacion[id] = elemento.value;
        }

    });

    localStorage.setItem(clave, JSON.stringify(informacion));

    alert("¡Información guardada!");
}


// FUNCIÓN PARA CARGAR INFORMACIÓN

function cargarInformacion(clave, campos) {

    const datosGuardados = localStorage.getItem(clave);

    if (!datosGuardados) {
        return;
    }

    const informacion = JSON.parse(datosGuardados);

    campos.forEach(id => {

        const elemento = document.getElementById(id);

        if (elemento && informacion[id] !== undefined) {
            elemento.value = informacion[id];
        }

    });

}


// DIAGNÓSTICOS

document.getElementById("agregar-diagnostico").addEventListener("click", () => {

    guardarInformacion("diagnostico", [
        "diagnostico",
        "fecha-diagnostico",
        "observaciones-diagnostico"
    ]);

});


// MEDICACIÓN

document.getElementById("agregar-medicacion").addEventListener("click", () => {

    guardarInformacion("medicacion", [
        "medicacion",
        "dosis",
        "frecuencia"
    ]);

});


// ALERGIAS

document.getElementById("agregar-alergia").addEventListener("click", () => {

    guardarInformacion("alergia", [
        "alergia",
        "reaccion",
        "observaciones-alergia"
    ]);

});


// ESTUDIOS

document.getElementById("agregar-estudio").addEventListener("click", () => {

    guardarInformacion("estudio", [
        "estudio",
        "fecha-estudio",
        "resultado-estudio"
    ]);

});


// TERAPIAS

document.getElementById("agregar-terapia").addEventListener("click", () => {

    guardarInformacion("terapia", [
        "terapia",
        "profesional-terapia",
        "frecuencia-terapia"
    ]);

});


// CIRUGÍAS

document.getElementById("agregar-cirugia").addEventListener("click", () => {

    guardarInformacion("cirugia", [
        "cirugia",
        "fecha-cirugia",
        "observaciones-cirugia"
    ]);

});


// CONTACTOS

document.getElementById("agregar-contacto").addEventListener("click", () => {

    guardarInformacion("contacto", [
        "nombre-contacto",
        "telefono-contacto",
        "relacion-contacto"
    ]);

});


// COBERTURA MÉDICA

document.getElementById("guardar-cobertura").addEventListener("click", () => {

    guardarInformacion("cobertura", [
        "cobertura",
        "numero-afiliado",
        "plan-medico"
    ]);

});


// CERTIFICADOS

document.getElementById("agregar-certificado").addEventListener("click", () => {

    guardarInformacion("certificado", [
        "certificado",
        "fecha-certificado",
        "observaciones-certificado"
    ]);

});


// ADAPTACIONES

document.getElementById("agregar-adaptacion").addEventListener("click", () => {

    guardarInformacion("adaptacion", [
        "adaptacion",
        "lugar-adaptacion",
        "detalle-adaptacion"
    ]);

});


// OBJETIVOS

document.getElementById("agregar-objetivo").addEventListener("click", () => {

    guardarInformacion("objetivo", [
        "objetivo"
    ]);

});


// PREFERENCIAS DE APRENDIZAJE

document.getElementById("guardar-aprendizaje").addEventListener("click", () => {

    guardarInformacion("aprendizaje", [
        "aprendizaje",
        "ayudas-aprendizaje"
    ]);

});


// FORMAS DE COMUNICACIÓN

document.getElementById("guardar-comunicacion").addEventListener("click", () => {

    guardarInformacion("comunicacion", [
        "comunicacion",
        "necesidades-comunicacion"
    ]);

});


// CARGAR LOS DATOS GUARDADOS

cargarInformacion("diagnostico", [
    "diagnostico",
    "fecha-diagnostico",
    "observaciones-diagnostico"
]);

cargarInformacion("medicacion", [
    "medicacion",
    "dosis",
    "frecuencia"
]);

cargarInformacion("alergia", [
    "alergia",
    "reaccion",
    "observaciones-alergia"
]);

cargarInformacion("estudio", [
    "estudio",
    "fecha-estudio",
    "resultado-estudio"
]);

cargarInformacion("terapia", [
    "terapia",
    "profesional-terapia",
    "frecuencia-terapia"
]);

cargarInformacion("cirugia", [
    "cirugia",
    "fecha-cirugia",
    "observaciones-cirugia"
]);

cargarInformacion("contacto", [
    "nombre-contacto",
    "telefono-contacto",
    "relacion-contacto"
]);

cargarInformacion("cobertura", [
    "cobertura",
    "numero-afiliado",
    "plan-medico"
]);

cargarInformacion("certificado", [
    "certificado",
    "fecha-certificado",
    "observaciones-certificado"
]);

cargarInformacion("adaptacion", [
    "adaptacion",
    "lugar-adaptacion",
    "detalle-adaptacion"
]);

cargarInformacion("objetivo", [
    "objetivo"
]);

cargarInformacion("aprendizaje", [
    "aprendizaje",
    "ayudas-aprendizaje"
]);

cargarInformacion("comunicacion", [
    "comunicacion",
    "necesidades-comunicacion"
]);


// MOSTRAR LA PRIMERA PÁGINA

mostrarPagina(paginaActual);