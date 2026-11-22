const tipo = document.body.dataset.tipo;
const nombre = document.body.dataset.nombre;

const botonAgregar = document.getElementById("botonAgregar");
const formulario = document.getElementById("formularioAgregar");
const formularioContenido = document.getElementById("formularioContenido");
const listaItems = document.getElementById("listaItems");

const API_URL = "http://localhost:3000";
const idUsuario = localStorage.getItem("idUsuario");

const claveStorage = "neuropassport_" + tipo;

// Pasaporte completo del usuario: { diagnosticos: [...], medicacion: [...], ... }
let pasaporte = {};




botonAgregar.addEventListener("click", function () {

    formulario.classList.toggle("visible");

});



const campos = {

    diagnosticos: [
        {
            nombre: "diagnostico",
            etiqueta: "Diagnóstico",
            tipo: "text",
            placeholder: "Ingresá el diagnóstico"
        },
        {
            nombre: "fecha",
            etiqueta: "Fecha",
            tipo: "date"
        },
        {
            nombre: "notas",
            etiqueta: "Notas",
            tipo: "textarea",
            placeholder: "Información adicional"
        }
    ],

    medicacion: [
        {
            nombre: "medicamento",
            etiqueta: "Medicamento",
            tipo: "text",
            placeholder: "Nombre del medicamento"
        },
        {
            nombre: "dosis",
            etiqueta: "Dosis",
            tipo: "text",
            placeholder: "Ej: 10 mg"
        },
        {
            nombre: "frecuencia",
            etiqueta: "Frecuencia",
            tipo: "text",
            placeholder: "Ej: una vez por día"
        }
    ],

    alergias: [
        {
            nombre: "alergia",
            etiqueta: "Alergia",
            tipo: "text",
            placeholder: "Ej: alimento, medicamento, material..."
        },
        {
            nombre: "reaccion",
            etiqueta: "Reacción",
            tipo: "text",
            placeholder: "¿Qué reacción produce?"
        },
        {
            nombre: "notas",
            etiqueta: "Notas",
            tipo: "textarea",
            placeholder: "Información adicional"
        }
    ],

    estudios: [
        {
            nombre: "estudio",
            etiqueta: "Estudio",
            tipo: "text",
            placeholder: "Nombre del estudio"
        },
        {
            nombre: "fecha",
            etiqueta: "Fecha",
            tipo: "date"
        },
        {
            nombre: "resultado",
            etiqueta: "Resultado / información",
            tipo: "textarea",
            placeholder: "Ingresá información sobre el estudio"
        }
    ],

    terapias: [
        {
            nombre: "terapia",
            etiqueta: "Tipo de terapia",
            tipo: "text",
            placeholder: "Ej: terapia ocupacional"
        },
        {
            nombre: "profesional",
            etiqueta: "Profesional",
            tipo: "text",
            placeholder: "Nombre del profesional"
        },
        {
            nombre: "frecuencia",
            etiqueta: "Frecuencia",
            tipo: "text",
            placeholder: "Ej: una vez por semana"
        }
    ],

    cirugias: [
        {
            nombre: "cirugia",
            etiqueta: "Cirugía",
            tipo: "text",
            placeholder: "Nombre o tipo de cirugía"
        },
        {
            nombre: "fecha",
            etiqueta: "Fecha",
            tipo: "date"
        },
        {
            nombre: "notas",
            etiqueta: "Información adicional",
            tipo: "textarea",
            placeholder: "Ingresá información sobre la cirugía"
        }
    ],

    contactos: [
        {
            nombre: "persona",
            etiqueta: "Nombre",
            tipo: "text",
            placeholder: "Nombre del contacto"
        },
        {
            nombre: "relacion",
            etiqueta: "Relación / profesión",
            tipo: "text",
            placeholder: "Ej: médico, familiar..."
        },
        {
            nombre: "telefono",
            etiqueta: "Teléfono",
            tipo: "text",
            placeholder: "Número de teléfono"
        }
    ],

    cobertura: [
        {
            nombre: "obraSocial",
            etiqueta: "Obra social / cobertura",
            tipo: "text",
            placeholder: "Nombre de la cobertura"
        },
        {
            nombre: "numero",
            etiqueta: "Número de afiliado",
            tipo: "text",
            placeholder: "Número"
        },
        {
            nombre: "notas",
            etiqueta: "Información adicional",
            tipo: "textarea",
            placeholder: "Información de contacto o cobertura"
        }
    ],

    certificados: [
        {
            nombre: "certificado",
            etiqueta: "Certificado",
            tipo: "text",
            placeholder: "Nombre del certificado"
        },
        {
            nombre: "fecha",
            etiqueta: "Fecha",
            tipo: "date"
        },
        {
            nombre: "notas",
            etiqueta: "Información adicional",
            tipo: "textarea",
            placeholder: "Información sobre el certificado"
        }
    ],

    adaptaciones: [
        {
            nombre: "adaptacion",
            etiqueta: "Adaptación",
            tipo: "text",
            placeholder: "Nombre de la adaptación"
        },
        {
            nombre: "lugar",
            etiqueta: "Lugar / ámbito",
            tipo: "text",
            placeholder: "Ej: escuela, universidad, trabajo..."
        },
        {
            nombre: "notas",
            etiqueta: "Descripción",
            tipo: "textarea",
            placeholder: "Explicá la adaptación"
        }
    ],

    objetivos: [
        {
            nombre: "objetivo",
            etiqueta: "Objetivo",
            tipo: "text",
            placeholder: "¿Cuál es el objetivo?"
        },
        {
            nombre: "fecha",
            etiqueta: "Fecha",
            tipo: "date"
        },
        {
            nombre: "notas",
            etiqueta: "Descripción",
            tipo: "textarea",
            placeholder: "Información adicional"
        }
    ],

    preferencias: [
        {
            nombre: "preferencia",
            etiqueta: "Preferencia de aprendizaje",
            tipo: "text",
            placeholder: "Ej: material visual, explicaciones orales..."
        },
        {
            nombre: "notas",
            etiqueta: "Descripción",
            tipo: "textarea",
            placeholder: "Contanos más sobre esta preferencia"
        }
    ],

    comunicacion: [
        {
            nombre: "forma",
            etiqueta: "Forma de comunicación",
            tipo: "text",
            placeholder: "Ej: lenguaje oral, escrito, pictogramas..."
        },
        {
            nombre: "notas",
            etiqueta: "Descripción",
            tipo: "textarea",
            placeholder: "Información adicional"
        }
    ]

};




/* ---------- API ---------- */

// GET /api/pasaportes/:idUsuario -> carga los datos del pasaporte
async function cargarPasaporte() {

    // Copia local por si el servidor no responde
    try {
        const local = JSON.parse(localStorage.getItem("neuropassport_datos"));
        if (local && typeof local === "object") {
            pasaporte = local;
        }
    } catch (error) {
        pasaporte = {};
    }

    if (!idUsuario) {
        return;
    }

    try {

        const respuesta = await fetch(
            API_URL + "/api/pasaportes/" + encodeURIComponent(idUsuario)
        );

        // 404 = el usuario todavía no tiene pasaporte, se crea al guardar
        if (respuesta.status === 404) {
            return;
        }

        if (!respuesta.ok) {
            throw new Error("Error " + respuesta.status);
        }

        const data = await respuesta.json();

        // Acepta tanto { datos: {...} } como el objeto directo
        pasaporte = data.datos || data;

        localStorage.setItem("neuropassport_datos", JSON.stringify(pasaporte));

    } catch (error) {

        console.error("No se pudo cargar el pasaporte:", error);

    }

}


// POST /api/pasaportes -> crea o guarda el pasaporte
async function guardarPasaporte() {

    localStorage.setItem("neuropassport_datos", JSON.stringify(pasaporte));

    if (!idUsuario) {
        return;
    }

    try {

        const respuesta = await fetch(API_URL + "/api/pasaportes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                datos: pasaporte
            })
        });

        if (!respuesta.ok) {
            throw new Error("Error " + respuesta.status);
        }

    } catch (error) {

        console.error("No se pudo guardar el pasaporte:", error);
        alert("No se pudo guardar en el servidor. Se guardó solo en este dispositivo.");

    }

}




/* ---------- FORMULARIO ---------- */

function crearFormulario() {

    const listaCampos = campos[tipo];

    listaCampos.forEach(function (campo) {

        const label = document.createElement("label");
        label.textContent = campo.etiqueta;

        formularioContenido.appendChild(label);

        let input;

        if (campo.tipo === "textarea") {

            input = document.createElement("textarea");

        } else {

            input = document.createElement("input");
            input.type = campo.tipo;

        }

        input.name = campo.nombre;

        if (campo.placeholder) {
            input.placeholder = campo.placeholder;
        }

        formularioContenido.appendChild(input);

    });

    const botonGuardar = document.createElement("button");

    botonGuardar.type = "button";
    botonGuardar.className = "guardar-item";
    botonGuardar.textContent = "Guardar";

    botonGuardar.addEventListener("click", guardarItem);

    formularioContenido.appendChild(botonGuardar);
}




async function guardarItem() {

    const inputs = formularioContenido.querySelectorAll("input, textarea");

    const item = {};

    let hayInformacion = false;

    inputs.forEach(function (input) {

        if (input.value.trim() !== "") {
            hayInformacion = true;
        }

        item[input.name] = input.value.trim();

    });

    if (!hayInformacion) {

        alert("Completá al menos un campo.");

        return;

    }

    item.id = Date.now();

    if (!Array.isArray(pasaporte[tipo])) {
        pasaporte[tipo] = [];
    }

    pasaporte[tipo].push(item);

    await guardarPasaporte();

    formularioContenido.innerHTML = "";

    formulario.classList.remove("visible");

    crearFormulario();

    mostrarItems();

}




function mostrarItems() {

    listaItems.innerHTML = "";

    const items = Array.isArray(pasaporte[tipo]) ? pasaporte[tipo] : [];

    if (items.length === 0) {

        listaItems.innerHTML = `
            <div class="sin-informacion">
                Todavía no hay información agregada.
            </div>
        `;

        return;

    }

    items.forEach(function (item) {

        const tarjeta = document.createElement("article");

        tarjeta.className = "item-guardado";

        let contenido = "";

        const listaCampos = campos[tipo];

        listaCampos.forEach(function (campo) {

            if (item[campo.nombre]) {

                contenido += `
                    <p>
                        <strong>${campo.etiqueta}:</strong>
                        ${item[campo.nombre]}
                    </p>
                `;

            }

        });

        const fecha = new Date(item.id);

        contenido += `
            <p class="item-fecha">
                Agregado el ${fecha.toLocaleDateString("es-AR")}
            </p>
        `;

        tarjeta.innerHTML = `
            <button class="boton-eliminar" onclick="eliminarItem(${item.id})">
                Eliminar
            </button>

            ${contenido}
        `;

        listaItems.appendChild(tarjeta);

    });

}




async function eliminarItem(id) {

    const items = Array.isArray(pasaporte[tipo]) ? pasaporte[tipo] : [];

    pasaporte[tipo] = items.filter(function (item) {

        return item.id !== id;

    });

    await guardarPasaporte();

    mostrarItems();

}




async function iniciar() {

    await cargarPasaporte();

    crearFormulario();

    mostrarItems();

}

iniciar();


/* ---------- FOTO DE PERFIL ---------- */

const perfil = document.getElementById("botonPerfil");
const fotoPerfil = localStorage.getItem("fotoPerfil");

if (perfil && fotoPerfil) {
    perfil.style.backgroundImage = `url("${fotoPerfil}")`;
    perfil.classList.add("perfil-con-foto");
}