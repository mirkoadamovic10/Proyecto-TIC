const API_URL = "http://localhost:3000";

// Obtener el ID del usuario logueado
const usuarioGuardado = localStorage.getItem("usuario") || localStorage.getItem("usuarioLogueado");
const usuarioLogueado = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
const idUsuario = usuarioLogueado ? usuarioLogueado.idUsuario : 1;

const tipo = document.body.dataset.tipo;
const nombre = document.body.dataset.nombre;

const botonAgregar = document.getElementById("botonAgregar");
const formulario = document.getElementById("formularioAgregar");
const formularioContenido = document.getElementById("formularioContenido");
const listaItems = document.getElementById("listaItems");

// Objeto global del pasaporte
let pasaporte = {
    idUsuario: idUsuario
};

// Configuración de los campos según la sección
const campos = {
    diagnosticos: [
        { nombre: "diagnostico", etiqueta: "Diagnóstico", tipo: "text", placeholder: "Ingresá el diagnóstico" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
        { nombre: "notas", etiqueta: "Notas", tipo: "textarea", placeholder: "Información adicional" }
    ],
    medicacion: [
        { nombre: "medicamento", etiqueta: "Medicamento", tipo: "text", placeholder: "Nombre del medicamento" },
        { nombre: "dosis", etiqueta: "Dosis", tipo: "text", placeholder: "Ej: 10 mg" },
        { nombre: "frecuencia", etiqueta: "Frecuencia", tipo: "text", placeholder: "Ej: una vez por día" }
    ],
    alergias: [
        { nombre: "alergia", etiqueta: "Alergia", tipo: "text", placeholder: "Ej: alimento, medicamento, material..." },
        { nombre: "reaccion", etiqueta: "Reacción", tipo: "text", placeholder: "¿Qué reacción produce?" },
        { nombre: "notas", etiqueta: "Notas", tipo: "textarea", placeholder: "Información adicional" }
    ],
    estudios: [
        { nombre: "estudio", etiqueta: "Estudio", tipo: "text", placeholder: "Nombre del estudio" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
        { nombre: "resultado", etiqueta: "Resultado / información", tipo: "textarea", placeholder: "Ingresá información sobre el estudio" }
    ],
    terapias: [
        { nombre: "terapia", etiqueta: "Tipo de terapia", tipo: "text", placeholder: "Ej: terapia ocupacional" },
        { nombre: "profesional", etiqueta: "Profesional", tipo: "text", placeholder: "Nombre del profesional" },
        { nombre: "frecuencia", etiqueta: "Frecuencia", tipo: "text", placeholder: "Ej: una vez por semana" }
    ],
    cirugias: [
        { nombre: "cirugia", etiqueta: "Cirugía", tipo: "text", placeholder: "Nombre o tipo de cirugía" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
        { nombre: "notas", etiqueta: "Información adicional", tipo: "textarea", placeholder: "Ingresá información sobre la cirugía" }
    ],
    contactos: [
        { nombre: "persona", etiqueta: "Nombre", tipo: "text", placeholder: "Nombre del contacto" },
        { nombre: "relacion", etiqueta: "Relación / profesión", tipo: "text", placeholder: "Ej: médico, familiar..." },
        { nombre: "telefono", etiqueta: "Teléfono", tipo: "text", placeholder: "Número de teléfono" }
    ],
    cobertura: [
        { nombre: "obraSocial", etiqueta: "Obra social / cobertura", tipo: "text", placeholder: "Nombre de la cobertura" },
        { nombre: "numero", etiqueta: "Número de afiliado", tipo: "text", placeholder: "Número" },
        { nombre: "notas", etiqueta: "Información adicional", tipo: "textarea", placeholder: "Información de contacto o cobertura" }
    ],
    certificados: [
        { nombre: "certificado", etiqueta: "Certificado", tipo: "text", placeholder: "Nombre del certificado" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
        { nombre: "notas", etiqueta: "Información adicional", tipo: "textarea", placeholder: "Información sobre el certificado" }
    ],
    adaptaciones: [
        { nombre: "adaptacion", etiqueta: "Adaptación", tipo: "text", placeholder: "Nombre de la adaptación" },
        { nombre: "lugar", etiqueta: "Lugar / ámbito", tipo: "text", placeholder: "Ej: escuela, universidad, trabajo..." },
        { nombre: "notas", etiqueta: "Descripción", tipo: "textarea", placeholder: "Explicá la adaptación" }
    ],
    objetivos: [
        { nombre: "objetivo", etiqueta: "Objetivo", tipo: "text", placeholder: "¿Cuál es el objetivo?" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
        { nombre: "notas", etiqueta: "Descripción", tipo: "textarea", placeholder: "Información adicional" }
    ],
    preferencias: [
        { nombre: "preferencia", etiqueta: "Preferencia de aprendizaje", tipo: "text", placeholder: "Ej: material visual, explicaciones orales..." },
        { nombre: "notas", etiqueta: "Descripción", tipo: "textarea", placeholder: "Contanos más sobre esta preferencia" }
    ],
    comunicacion: [
        { nombre: "forma", etiqueta: "Forma de comunicación", tipo: "text", placeholder: "Ej: lenguaje oral, escrito, pictogramas..." },
        { nombre: "notas", etiqueta: "Descripción", tipo: "textarea", placeholder: "Información adicional" }
    ]
};

// =========================================================
// 1. GET: Cargar el pasaporte completo desde la API
// =========================================================

async function cargarPasaporte() {
    try {
        const respuesta = await fetch(`${API_URL}/api/pasaportes/${encodeURIComponent(idUsuario)}`);

        if (respuesta.status === 404) {
            console.log("El usuario aún no tiene un pasaporte guardado en el servidor.");
            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const data = await respuesta.json();

        pasaporte = data.datosDelPasaporte || data.pasaporte || data.datos || data;
        pasaporte.idUsuario = idUsuario;

        // Guardar copia local de respaldo
        localStorage.setItem("neuropassport_datos", JSON.stringify(pasaporte));

    } catch (error) {
        console.error("No se pudo cargar el pasaporte desde el servidor:", error);

        // Respaldo desde localStorage si falla la red
        try {
            const local = JSON.parse(localStorage.getItem("neuropassport_datos"));

            if (local && typeof local === "object") {
                pasaporte = local;
            }
        } catch (e) {
            pasaporte = { idUsuario: idUsuario };
        }
    }
}

// =========================================================
// 2. POST: Guardar el pasaporte actualizado en el servidor
// =========================================================

async function guardarPasaporte() {
    pasaporte.idUsuario = idUsuario;

    try {
        const respuesta = await fetch(`${API_URL}/api/pasaportes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pasaporte)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || "Error al guardar el pasaporte.");
        }

        // Guardar respaldo local
        localStorage.setItem("neuropassport_datos", JSON.stringify(pasaporte));

    } catch (error) {
        console.error("Error al guardar pasaporte en el servidor:", error);
        alert("No se pudo guardar la información en el servidor.");
    }
}

// =========================================================
// 3. Crear el formulario
// =========================================================

function crearFormulario() {
    if (!formularioContenido) return;

    formularioContenido.innerHTML = "";

    const listaCampos = campos[tipo] || [];

    listaCampos.forEach(function(campo) {
        const divCampo = document.createElement("div");
        divCampo.className = "campo";

        const label = document.createElement("label");
        label.textContent = campo.etiqueta;

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

        divCampo.appendChild(label);
        divCampo.appendChild(input);

        formularioContenido.appendChild(divCampo);
    });

    const botonSubmit = document.createElement("button");
    botonSubmit.type = "button";
    botonSubmit.className = "guardar-item";
    botonSubmit.textContent = "Guardar";

    botonSubmit.addEventListener("click", guardarItem);

    formularioContenido.appendChild(botonSubmit);
}

// =========================================================
// 4. Agregar un nuevo elemento al pasaporte
// =========================================================

async function guardarItem() {
    const inputs = formularioContenido.querySelectorAll("input, textarea");

    const item = {};
    let hayInformacion = false;

    inputs.forEach(function(input) {
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

    if (formulario) {
        formulario.classList.remove("visible");
    }

    crearFormulario();
    mostrarItems();
}

// =========================================================
// 5. Eliminar un elemento del pasaporte
// =========================================================

async function eliminarItem(id) {
    if (!Array.isArray(pasaporte[tipo])) return;

    pasaporte[tipo] = pasaporte[tipo].filter(function(item) {
        return item.id !== id;
    });

    await guardarPasaporte();

    mostrarItems();
}

// =========================================================
// 6. Mostrar elementos guardados de la sección activa
// =========================================================

function mostrarItems() {
    if (!listaItems) return;

    listaItems.innerHTML = "";

    const items = Array.isArray(pasaporte[tipo]) ? pasaporte[tipo] : [];

    if (items.length === 0) {
        listaItems.innerHTML = `
            <div>
                Todavía no hay información agregada.
            </div>
        `;
        return;
    }

    items.forEach(function(item) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "item-guardado";

        let contenido = "";

        const listaCampos = campos[tipo] || [];

        listaCampos.forEach(function(campo) {
            if (item[campo.nombre]) {
                contenido += `
                    <p>
                        <strong>${campo.etiqueta}:</strong> ${item[campo.nombre]}
                    </p>
                `;
            }
        });

        const fecha = item.id ? new Date(item.id) : new Date();

        contenido += `
            <p>
                Agregado el ${fecha.toLocaleDateString("es-AR")}
            </p>
        `;

        tarjeta.innerHTML = `
            ${contenido}
        `;

        listaItems.appendChild(tarjeta);
    });
}

// =========================================================
// 7. Eventos y arranque
// =========================================================

if (botonAgregar && formulario) {
    botonAgregar.addEventListener("click", function() {
        formulario.classList.toggle("visible");
    });
}

async function iniciar() {
    await cargarPasaporte();
    crearFormulario();
    mostrarItems();
}

iniciar();

// =========================================================
// 8. Aplicar foto de perfil si existe
// =========================================================

const perfil = document.getElementById("botonPerfil");
const fotoPerfil = localStorage.getItem("fotoPerfil");

if (perfil && fotoPerfil) {
    perfil.style.backgroundImage = `url("${fotoPerfil}")`;
    perfil.classList.add("perfil-con-foto");
}