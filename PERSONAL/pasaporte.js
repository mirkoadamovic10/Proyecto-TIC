const API_URL = "http://localhost:3000";

// Obtener el ID del usuario logueado
const usuarioGuardado = localStorage.getItem("usuario") || localStorage.getItem("usuarioLogueado");
const usuarioLogueado = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
const idUsuario = Number(
    localStorage.getItem("idUsuario") ||
    (usuarioLogueado ? usuarioLogueado.idUsuario : 1)
);

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
// 0. A qué API va cada sección
// =========================================================
// - "pasaporte": todo el pasaporte junto  -> /api/pasaportes
// - "perfil":    un solo objeto por usuario (se agrega la lista adentro)
// - "lista":     cada elemento es un registro aparte

function hoy() {
    return new Date().toISOString().slice(0, 10);
}

const rutasApi = {
    adaptaciones: {
        modo: "perfil",
        url: "/api/perfil-sensorial",
        clave: "adaptaciones"
    },
    preferencias: {
        modo: "perfil",
        url: "/api/perfil-educativo",
        clave: "preferencias",
        // El backend tiene el campo de texto "preferenciasAprendizaje"
        texto: function (lista) {
            return lista.map(function (item) { return item.preferencia; }).filter(Boolean).join(", ");
        },
        campoTexto: "preferenciasAprendizaje"
    },
    estudios: {
        modo: "lista",
        url: "/api/documentos",
        aBackend: function (item) {
            return Object.assign({}, item, {
                tipoDocumento: "estudios",
                nombreArchivo: item.estudio || "Estudio",
                fechaCarga: item.fecha || hoy()
            });
        },
        esDeEstaSeccion: function (registro) { return registro.tipoDocumento === "estudios"; }
    },
    certificados: {
        modo: "lista",
        url: "/api/documentos",
        aBackend: function (item) {
            return Object.assign({}, item, {
                tipoDocumento: "certificados",
                nombreArchivo: item.certificado || "Certificado",
                fechaCarga: item.fecha || hoy()
            });
        },
        esDeEstaSeccion: function (registro) { return registro.tipoDocumento === "certificados"; }
    },
    terapias: {
        modo: "lista",
        url: "/api/terapias",
        aBackend: function (item) {
            return Object.assign({}, item, {
                tipo: item.terapia || "",
                profesional: item.profesional || "",
                fecha: hoy()
            });
        },
        desdeBackend: function (registro) {
            return Object.assign({ terapia: registro.tipo }, registro);
        }
    },
    cirugias: {
        modo: "lista",
        url: "/api/historial",
        aBackend: function (item) {
            return Object.assign({}, item, {
                tipoEvento: "cirugia",
                fecha: item.fecha || hoy(),
                descripcion: item.cirugia || item.notas || ""
            });
        },
        esDeEstaSeccion: function (registro) { return registro.tipoEvento === "cirugia"; },
        desdeBackend: function (registro) {
            return Object.assign({ cirugia: registro.descripcion }, registro);
        }
    },
    objetivos: {
        modo: "lista",
        url: "/api/objetivos",
        aBackend: function (item) {
            return Object.assign({}, item, {
                profesional: "",
                objetivo: item.objetivo || "",
                estado: "pendiente",
                progreso: 0
            });
        }
    }
};

const rutaActual = rutasApi[tipo] || { modo: "pasaporte" };

// Perfil completo (sensorial o educativo) para no pisar los otros datos al guardar
let perfilCompleto = { idUsuario: idUsuario };

// GET de las secciones que no usan /api/pasaportes
async function cargarSeccionAparte() {
    const respuesta = await fetch(`${API_URL}${rutaActual.url}/${encodeURIComponent(idUsuario)}`);

    if (respuesta.status === 404) {
        pasaporte[tipo] = [];
        return;
    }

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const data = await respuesta.json();

    if (rutaActual.modo === "perfil") {
        perfilCompleto = data || { idUsuario: idUsuario };
        pasaporte[tipo] = Array.isArray(perfilCompleto[rutaActual.clave]) ? perfilCompleto[rutaActual.clave] : [];
        return;
    }

    let registros = Array.isArray(data) ? data : [];

    if (rutaActual.esDeEstaSeccion) {
        registros = registros.filter(rutaActual.esDeEstaSeccion);
    }

    if (rutaActual.desdeBackend) {
        registros = registros.map(rutaActual.desdeBackend);
    }

    pasaporte[tipo] = registros;
}

// POST de las secciones que no usan /api/pasaportes
async function guardarSeccionAparte(item) {
    let cuerpo;

    if (rutaActual.modo === "perfil") {
        perfilCompleto.idUsuario = idUsuario;
        perfilCompleto[rutaActual.clave] = pasaporte[tipo];

        if (rutaActual.campoTexto) {
            perfilCompleto[rutaActual.campoTexto] = rutaActual.texto(pasaporte[tipo]);
        }

        cuerpo = perfilCompleto;
    } else {
        cuerpo = Object.assign({ idUsuario: idUsuario }, rutaActual.aBackend(item));
    }

    const respuesta = await fetch(`${API_URL}${rutaActual.url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cuerpo)
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al guardar.");
    }
}

// Copia local por si el servidor no está levantado
function guardarCopiaLocal() {
    try {
        const local = JSON.parse(localStorage.getItem("neuropassport_datos")) || {};
        local[tipo] = pasaporte[tipo];
        localStorage.setItem("neuropassport_datos", JSON.stringify(local));
    } catch (e) {
        // sin copia local
    }
}

// =========================================================
// 1. GET: Cargar el pasaporte completo desde la API
// =========================================================

async function cargarPasaporte() {
    if (rutaActual.modo !== "pasaporte") {
        try {
            await cargarSeccionAparte();
            guardarCopiaLocal();
        } catch (error) {
            console.error("No se pudo cargar la sección desde el servidor:", error);

            try {
                const local = JSON.parse(localStorage.getItem("neuropassport_datos"));
                pasaporte[tipo] = local && Array.isArray(local[tipo]) ? local[tipo] : [];
            } catch (e) {
                pasaporte[tipo] = [];
            }
        }
        return;
    }

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

    if (rutaActual.modo === "pasaporte") {
        await guardarPasaporte();
    } else {
        try {
            await guardarSeccionAparte(item);
        } catch (error) {
            console.error("Error al guardar en el servidor:", error);
            alert("No se pudo guardar la información en el servidor.");
        }
        guardarCopiaLocal();
    }

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