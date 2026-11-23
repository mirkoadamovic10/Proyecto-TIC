// ==========================================
// PERFIL PROFESIONAL DE UN USUARIO VINCULADO
// perfil-profesional-usuarios.html?id=<código del usuario>
// GET /api/usuarios/:id · GET /api/info-personal/:id · GET /api/preferencias-trabajo/:id
// ==========================================

const API = "http://localhost:3000/api";

const idInstitucionUsuario = Number(localStorage.getItem("idUsuario")) || 0;
const CLAVE_USUARIOS = "usuariosEscuela_" + idInstitucionUsuario;

const codigoProfesional = new URLSearchParams(window.location.search).get("id") || "";

const SIN_DATO = "Sin completar";


function leerUsuarios() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

// Escribe un dato en pantalla; si no hay, muestra "Sin completar" en gris
function mostrarDato(id, valor) {
    const elemento = document.getElementById(id);
    const texto = valor === undefined || valor === null ? "" : String(valor).trim();

    elemento.textContent = texto || SIN_DATO;
    elemento.classList.toggle("ppu-sin-dato", !texto);
}

const NOMBRES_PROFESION = { medico: "Médico", psicologo: "Psicólogo", terapista: "Terapista", empleado: "Empleado" };

function capitalizar(texto) {
    texto = String(texto || "");
    if (NOMBRES_PROFESION[texto]) return NOMBRES_PROFESION[texto];
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Textos que se muestran para los valores guardados en preferencias de trabajo
function textoAmbiente(valor) {
    return valor ? "Ambiente " + valor.toLowerCase() : "";
}

function textoFormaTrabajo(valor) {
    const textos = {
        "Individual": "Prefiero trabajar solo",
        "En equipo": "Prefiero trabajar en equipo",
        "Mixto": "Solo o en equipo"
    };
    return textos[valor] || valor || "";
}

function textoHorario(valor) {
    if (!valor) return "";
    return valor === "Horario flexible" ? valor : "Turno " + valor.toLowerCase();
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

    // Datos profesionales
    mostrarDato("datoEspecialidad", info.especialidad || capitalizar(usuario.tipoProfesional) || vinculado.rol);
    mostrarDato("datoMatricula", info.matricula);
    mostrarDato("datoTelefono", info.telefono || info.telFijo);
    mostrarDato("datoCorreo", info.correoProfesional || usuario.email);
    mostrarDato("datoConsultorio", info.consultorio);
    mostrarDato("datoHorarios", info.horarios);

    // Modalidad y entorno de trabajo
    mostrarDato("datoModalidad", preferencias.modalidad);
    mostrarDato("datoAmbiente", textoAmbiente(preferencias.ambienteTrabajo));
    mostrarDato("datoFormaTrabajo", textoFormaTrabajo(preferencias.formaTrabajo));
    mostrarDato("datoComunicacion", preferencias.formaComunicacion);
    mostrarDato("datoHorario", textoHorario(preferencias.preferenciaHorario));

    // Enfoque de trabajo
    const enfoque = preferencias.enfoque || preferencias.otrasPreferencias;
    mostrarDato("datoEnfoque", enfoque ? "“" + enfoque + "”" : "");
}


/* ---------- DESVINCULAR ---------- */

document.getElementById("botonDesvincular").addEventListener("click", function () {
    const nombre = document.getElementById("nombreProfesional").textContent;

    if (!window.confirm("¿Querés desvincular a " + nombre + " de la institución?")) {
        return;
    }

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
