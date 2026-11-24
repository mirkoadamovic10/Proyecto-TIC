// ==========================================
// PERFIL PROFESIONAL DE UN USUARIO VINCULADO
// perfil-profesional-usuarios.html?id=<código del usuario>
// GET /api/usuarios/:id · GET /api/info-personal/:id · GET /api/preferencias-trabajo/:id
// ==========================================

const API = "http://localhost:3000/api";

const idInstitucionUsuario = Number(localStorage.getItem("idUsuario")) || 0;
const CLAVE_USUARIOS = "usuariosEscuela_" + idInstitucionUsuario;

const codigoProfesional = new URLSearchParams(window.location.search).get("id") || "";



function leerUsuarios() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

const CLAVE_PERFIL = "perfilUsuarioEscuela_" + idInstitucionUsuario + "_" + codigoProfesional;

const CAMPOS = [
    "datoEspecialidad", "datoMatricula", "datoTelefono", "datoCorreo",
    "datoConsultorio", "datoHorarios", "datoModalidad", "datoAmbiente",
    "datoFormaTrabajo", "datoComunicacion", "datoHorario", "datoEnfoque"
];

// Pone un valor en su campo. En los desplegables solo si es una opción válida.
function mostrarDato(id, valor) {
    const campo = document.getElementById(id);
    const texto = valor === undefined || valor === null ? "" : String(valor).trim();

    if (campo.tagName === "SELECT") {
        const existe = Array.from(campo.options).some(function (opcion) {
            return opcion.value === texto;
        });
        campo.value = existe ? texto : "";
        actualizarColor(campo);
    } else {
        campo.value = texto;
    }
}

// Los desplegables sin nada elegido se ven en gris
function actualizarColor(select) {
    select.classList.toggle("ppu-sin-dato", select.value === "");
}

function leerPerfilGuardado() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_PERFIL)) || null;
    } catch (error) {
        return null;
    }
}

const NOMBRES_PROFESION = { medico: "Médico", psicologo: "Psicólogo", terapista: "Terapista", empleado: "Empleado" };

function capitalizar(texto) {
    texto = String(texto || "");
    if (NOMBRES_PROFESION[texto]) return NOMBRES_PROFESION[texto];
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Datos viejos que solo tienen el valor del backend → texto de las opciones
const DESDE_BACKEND = {
    ambienteTrabajo: { "Tranquilo": "Ambiente tranquilo", "Dinámico": "Ambiente dinámico" },
    formaTrabajo: { "Individual": "Prefiero trabajar solo/a", "En equipo": "Prefiero trabajar en equipo", "Mixto": "Me adapto a ambas" },
    formaComunicacion: { "Escrita": "Comunicación escrita", "Verbal": "Comunicación oral" }
};

function desdeBackend(campo, valor) {
    return DESDE_BACKEND[campo][valor] || "";
}

async function pedir(ruta) {
    try {
        const respuesta = await fetch(API + ruta);
        return respuesta.ok ? await respuesta.json() : {};
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return {};
    }
}


/* ---------- CARGAR EL PERFIL ---------- */

async function cargarPerfil() {
    const vinculado = leerUsuarios().find(function (usuario) {
        return String(usuario.codigo) === String(codigoProfesional);
    }) || {};

    let usuario = {};
    let info = {};
    let preferencias = {};

    if (codigoProfesional) {
        [usuario, info, preferencias] = await Promise.all([
            pedir("/usuarios/" + encodeURIComponent(codigoProfesional)),
            pedir("/info-personal/" + encodeURIComponent(codigoProfesional)),
            pedir("/preferencias-trabajo/" + encodeURIComponent(codigoProfesional))
        ]);
    }

    const nombre = usuario.nombre || info.apellidoNombre || vinculado.nombre || "";
    document.getElementById("nombreProfesional").textContent = nombre || "Profesional sin nombre";

    // Lo que se editó en esta pantalla tiene prioridad sobre lo del servidor
    const guardado = leerPerfilGuardado();

    if (guardado) {
        CAMPOS.forEach(function (id) { mostrarDato(id, guardado[id]); });
        return;
    }

    const enfoque = preferencias.enfoque || preferencias.otrasPreferencias;

    mostrarDato("datoEspecialidad", info.especialidad || capitalizar(usuario.tipoProfesional) || vinculado.rol);
    mostrarDato("datoMatricula", info.matricula);
    mostrarDato("datoTelefono", info.telefono || info.telFijo);
    mostrarDato("datoCorreo", info.correoProfesional || usuario.email);
    mostrarDato("datoConsultorio", info.consultorio);
    mostrarDato("datoHorarios", info.horarios);
    mostrarDato("datoModalidad", preferencias.modalidad);
    mostrarDato("datoAmbiente", preferencias.ambienteLaboral || desdeBackend("ambienteTrabajo", preferencias.ambienteTrabajo));
    mostrarDato("datoFormaTrabajo", preferencias.formaTrabajoLaboral || desdeBackend("formaTrabajo", preferencias.formaTrabajo));
    mostrarDato("datoComunicacion", preferencias.comunicacionLaboral || desdeBackend("formaComunicacion", preferencias.formaComunicacion));
    mostrarDato("datoHorario", preferencias.horarioLaboral || preferencias.preferenciaHorario);
    mostrarDato("datoEnfoque", enfoque);
}


/* ---------- GUARDAR LOS CAMBIOS (automático) ---------- */

const mensajeGuardado = document.getElementById("mensajeGuardado");
let temporizadorMensaje = null;

function guardarPerfil() {
    const datos = {};

    CAMPOS.forEach(function (id) {
        datos[id] = document.getElementById(id).value.trim();
    });

    localStorage.setItem(CLAVE_PERFIL, JSON.stringify(datos));

    mensajeGuardado.textContent = "Cambios guardados";
    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(function () {
        mensajeGuardado.textContent = "";
    }, 2000);
}

CAMPOS.forEach(function (id) {
    const campo = document.getElementById(id);

    campo.addEventListener(campo.tagName === "SELECT" ? "change" : "input", function () {
        if (campo.tagName === "SELECT") actualizarColor(campo);
        guardarPerfil();
    });
});


/* ---------- DESVINCULAR ---------- */

document.getElementById("botonDesvincular").addEventListener("click", function () {
    const nombre = document.getElementById("nombreProfesional").textContent;

    if (!window.confirm("¿Querés desvincular a " + nombre + " de la institución?")) {
        return;
    }

    localStorage.removeItem(CLAVE_PERFIL);

    const restantes = leerUsuarios().filter(function (usuario) {
        return String(usuario.codigo) !== String(codigoProfesional);
    });

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(restantes));
    window.location.href = "usuarios-escuela.html";
});


/* ---------- VOLVER Y MENÚ DE PERFIL ---------- */

document.getElementById("botonAtras").addEventListener("click", function () {
    window.location.href = "usuarios-escuela.html";
});

const botonPerfil = document.getElementById("botonPerfil");
const menuPerfil = document.getElementById("menuPerfil");

botonPerfil.addEventListener("click", function (evento) {
    evento.stopPropagation();
    const abierto = menuPerfil.classList.toggle("mostrar");
    botonPerfil.setAttribute("aria-expanded", String(abierto));
});

document.addEventListener("click", function (evento) {
    if (!menuPerfil.contains(evento.target) && !botonPerfil.contains(evento.target)) {
        menuPerfil.classList.remove("mostrar");
        botonPerfil.setAttribute("aria-expanded", "false");
    }
});

document.getElementById("botonCerrarSesion").addEventListener("click", function () {
    window.location.href = "../cerrar-sesion.html";
});


cargarPerfil();
