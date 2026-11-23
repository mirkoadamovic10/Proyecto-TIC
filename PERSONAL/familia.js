/* ============================= */
/* FAMILIA - NeuroPassport       */
/* ============================= */

/* ---------- MODAL PASAPORTE ---------- */

const botonPasaporte = document.getElementById("botonPasaporte");
const submenuPasaporte = document.getElementById("submenuPasaporte");
const cerrarPasaporte = document.getElementById("cerrarPasaporte");

function abrirPasaporte() {
    submenuPasaporte.hidden = false;
    botonPasaporte.setAttribute("aria-expanded", "true");
}

function cerrarModalPasaporte() {
    submenuPasaporte.hidden = true;
    botonPasaporte.setAttribute("aria-expanded", "false");
    botonPasaporte.focus();
}

if (botonPasaporte && submenuPasaporte) {

    botonPasaporte.addEventListener("click", function () {
        if (submenuPasaporte.hidden) {
            abrirPasaporte();
        } else {
            cerrarModalPasaporte();
        }
    });

    if (cerrarPasaporte) {
        cerrarPasaporte.addEventListener("click", cerrarModalPasaporte);
    }

    // Cerrar tocando afuera del panel
    submenuPasaporte.addEventListener("click", function (evento) {
        if (evento.target === submenuPasaporte) {
            cerrarModalPasaporte();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !submenuPasaporte.hidden) {
            cerrarModalPasaporte();
        }
    });
}

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

document.querySelectorAll(".boton-pasaporte").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const pagina = pantallas[boton.textContent.trim()];

        if (pagina) {
            submenuPasaporte.hidden = true;
            window.location.href = pagina;
        }
    });
});


/* ---------- SUBMENU PERFIL ---------- */

const botonPerfil = document.getElementById("botonPerfil");
const submenuPerfil = document.getElementById("submenuPerfil");

if (botonPerfil && submenuPerfil) {

    botonPerfil.addEventListener("click", function (evento) {
        evento.stopPropagation();
        const abierto = submenuPerfil.classList.toggle("activo");
        botonPerfil.setAttribute("aria-expanded", String(abierto));
    });

    submenuPerfil.querySelectorAll("button").forEach(function (opcion) {
        opcion.addEventListener("click", function () {
            const pagina = opcion.getAttribute("data-pagina");

            if (pagina) {
                window.location.href = pagina;
            }
        });
    });

    // Cerrar el submenú tocando en cualquier otro lado
    document.addEventListener("click", function (evento) {
        if (!submenuPerfil.contains(evento.target)) {
            submenuPerfil.classList.remove("activo");
            botonPerfil.setAttribute("aria-expanded", "false");
        }
    });
}

// Foto de perfil guardada
const fotoPerfil = localStorage.getItem("fotoPerfil");

if (botonPerfil && fotoPerfil) {
    const imagenPerfil = document.createElement("img");

    imagenPerfil.src = fotoPerfil;
    imagenPerfil.alt = "Foto de perfil";
    imagenPerfil.classList.add("imagen-perfil");

    const cabeza = botonPerfil.querySelector(".perfil-cabeza");
    const cuerpo = botonPerfil.querySelector(".perfil-cuerpo");

    if (cabeza) cabeza.style.display = "none";
    if (cuerpo) cuerpo.style.display = "none";

    botonPerfil.appendChild(imagenPerfil);
}


/* ---------- GRUPO FAMILIAR ---------- */

const botonCrearGrupo = document.getElementById("botonCrearGrupo");
const botonUnirseGrupo = document.getElementById("botonUnirseGrupo");


/* ---------- GRUPOS GUARDADOS ---------- */

// Nombre de la cuenta que está usando la página
function nombreActual() {
    const nombre = (localStorage.getItem("nombreUsuario") || "").trim();

    if (nombre) {
        return nombre;
    }

    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        return usuario && usuario.nombre ? usuario.nombre.trim() : "";
    } catch (error) {
        return "";
    }
}

function leerGruposFamiliares() {
    let grupos = [];

    try {
        const guardados = JSON.parse(localStorage.getItem("gruposFamiliares"));
        if (Array.isArray(guardados)) grupos = guardados;
    } catch (error) {
        grupos = [];
    }

    // Grupos creados antes de este cambio
    try {
        const actual = JSON.parse(localStorage.getItem("grupoFamiliar"));
        if (actual && actual.codigo && actual.nombre && !grupos.some(function (g) { return g.codigo === actual.codigo.toUpperCase(); })) {
            actual.codigo = actual.codigo.toUpperCase();
            grupos.push(actual);
        }
    } catch (error) {
        // nada
    }

    return grupos;
}


/* ---------- API: GRUPOS FAMILIARES ----------
   POST /api/grupos-familiares
   POST /api/grupos-familiares/:idGrupo/unirse
   GET  /api/grupos-familiares/usuario/:idUsuario
   El código de la familia es "FAM-" + idGrupo (ej: FAM-3) */

const API_GRUPOS = "http://localhost:3000/api/grupos-familiares";

function idUsuarioActual() {
    return Number(localStorage.getItem("idUsuario")) || null;
}

function codigoDeGrupo(idGrupo) {
    return "FAM-" + idGrupo;
}

function idDesdeCodigo(codigo) {
    const numero = Number(String(codigo).replace(/\D/g, ""));
    return numero || null;
}

// Si el usuario ya está en un grupo del servidor, queda como su grupo actual
async function cargarGrupoDelServidor() {
    const idUsuario = idUsuarioActual();

    if (!idUsuario) return;

    try {
        const respuesta = await fetch(`${API_GRUPOS}/usuario/${idUsuario}`);

        if (!respuesta.ok) return;

        const grupos = await respuesta.json();

        if (!Array.isArray(grupos) || grupos.length === 0) return;

        const grupo = grupos[grupos.length - 1];
        let actual = null;

        try {
            actual = JSON.parse(localStorage.getItem("grupoFamiliar"));
        } catch (error) {
            actual = null;
        }

        localStorage.setItem("grupoFamiliar", JSON.stringify(Object.assign({}, actual || {}, grupo, {
            codigo: codigoDeGrupo(grupo.idGrupo)
        })));
    } catch (error) {
        console.error("No se pudo cargar el grupo familiar del servidor:", error);
    }
}

cargarGrupoDelServidor();


/* ---------- POP UP CREAR GRUPO ---------- */

const modalCrearGrupo = document.getElementById("modalCrearGrupo");
const formCrearGrupo = document.getElementById("formCrearGrupo");

function abrirCrearGrupo() {
    modalCrearGrupo.hidden = false;
    document.getElementById("nombreGrupo").focus();
}

function cerrarCrearGrupo() {
    modalCrearGrupo.hidden = true;
    botonCrearGrupo.focus();
}

if (botonCrearGrupo && modalCrearGrupo) {

    botonCrearGrupo.addEventListener("click", abrirCrearGrupo);

    // Cerrar tocando afuera del pop up
    modalCrearGrupo.addEventListener("click", function (evento) {
        if (evento.target === modalCrearGrupo) {
            cerrarCrearGrupo();
        }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !modalCrearGrupo.hidden) {
            cerrarCrearGrupo();
        }
    });
}

if (formCrearGrupo) {

    formCrearGrupo.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        let codigo = document.getElementById("codigoGrupo").value.trim().toUpperCase();
        let datosServidor = {};

        // POST /api/grupos-familiares
        if (idUsuarioActual()) {
            try {
                const respuesta = await fetch(API_GRUPOS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idCreador: idUsuarioActual(),
                        nombre: document.getElementById("nombreGrupo").value.trim()
                    })
                });

                if (respuesta.ok) {
                    datosServidor = await respuesta.json();
                    // El código real es el del servidor
                    codigo = codigoDeGrupo(datosServidor.idGrupo);
                } else {
                    const error = await respuesta.json().catch(() => ({}));
                    console.error("No se pudo crear el grupo en el servidor:", error.error);
                }
            } catch (error) {
                console.error("No se pudo conectar con el servidor:", error);
            }
        }

        // Si no escribió un código, se genera uno (ej: FAM-4821)
        if (!codigo) {
            codigo = "FAM-" + Math.floor(1000 + Math.random() * 9000);
        }

        const grupo = {
            nombre: document.getElementById("nombreGrupo").value.trim(),
            descripcion: document.getElementById("descripcionGrupo").value.trim(),
            correo: document.getElementById("correoGrupo").value.trim(),
            codigo: codigo,
            miembros: nombreActual() ? [nombreActual()] : [],
            idGrupo: datosServidor.idGrupo,
            integrantes: datosServidor.integrantes
        };

        // Grupo actual del usuario
        localStorage.setItem("grupoFamiliar", JSON.stringify(grupo));

        // Lista de todos los grupos creados (para poder unirse con el código)
        const grupos = leerGruposFamiliares().filter(function (g) {
            return g.codigo !== codigo;
        });
        grupos.push(grupo);
        localStorage.setItem("gruposFamiliares", JSON.stringify(grupos));

        window.location.href = "./familia-home.html";
    });
}


/* ---------- POP UP UNIRSE A UN GRUPO ---------- */

const modalUnirseGrupo = document.getElementById("modalUnirseGrupo");
const formUnirseGrupo = document.getElementById("formUnirseGrupo");
const codigoInvitacion = document.getElementById("codigoInvitacion");

const errorCodigoInvitacion = document.getElementById("errorCodigoInvitacion");

function mostrarErrorCodigo(mensaje) {
    errorCodigoInvitacion.textContent = mensaje;
    codigoInvitacion.setAttribute("aria-invalid", "true");
    codigoInvitacion.focus();
}

function limpiarErrorCodigo() {
    errorCodigoInvitacion.textContent = "";
    codigoInvitacion.removeAttribute("aria-invalid");
}

function abrirUnirseGrupo() {
    limpiarErrorCodigo();
    codigoInvitacion.value = "";
    modalUnirseGrupo.hidden = false;
    codigoInvitacion.focus();
}

if (codigoInvitacion) {
    codigoInvitacion.addEventListener("input", limpiarErrorCodigo);
}

function cerrarUnirseGrupo() {
    modalUnirseGrupo.hidden = true;
    botonUnirseGrupo.focus();
}

if (botonUnirseGrupo && modalUnirseGrupo) {

    botonUnirseGrupo.addEventListener("click", abrirUnirseGrupo);

    // Cerrar tocando afuera del pop up
    modalUnirseGrupo.addEventListener("click", function (evento) {
        if (evento.target === modalUnirseGrupo) {
            cerrarUnirseGrupo();
        }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !modalUnirseGrupo.hidden) {
            cerrarUnirseGrupo();
        }
    });
}

if (formUnirseGrupo) {

    formUnirseGrupo.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const codigo = codigoInvitacion.value.trim().toUpperCase();

        if (!codigo) {
            mostrarErrorCodigo("Escribí el código de invitación.");
            return;
        }

        // POST /api/grupos-familiares/:idGrupo/unirse
        const idGrupo = idDesdeCodigo(codigo);

        if (idUsuarioActual() && idGrupo) {
            try {
                const respuesta = await fetch(`${API_GRUPOS}/${idGrupo}/unirse`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idUsuario: idUsuarioActual() })
                });

                if (respuesta.status === 404) {
                    // Código incorrecto: no entra a ningún grupo
                    mostrarErrorCodigo("El código no es correcto. Revisalo y probá de nuevo.");
                    return;
                }

                if (respuesta.ok) {
                    const grupo = await respuesta.json();

                    localStorage.setItem("grupoFamiliar", JSON.stringify(Object.assign({}, grupo, {
                        codigo: codigoDeGrupo(grupo.idGrupo)
                    })));

                    window.location.href = "./familia-home.html";
                    return;
                }
            } catch (error) {
                // Sin servidor: se usa lo guardado en este navegador
                console.error("No se pudo conectar con el servidor:", error);
            }
        }

        const grupoEncontrado = leerGruposFamiliares().find(function (grupo) {
            return grupo.codigo === codigo;
        });

        // Código incorrecto: no entra a ningún grupo
        if (!grupoEncontrado) {
            mostrarErrorCodigo("El código no es correcto. Revisalo y probá de nuevo.");
            return;
        }

        // Se suma como integrante del grupo
        const nombre = nombreActual();

        if (!Array.isArray(grupoEncontrado.miembros)) {
            grupoEncontrado.miembros = [];
        }

        const yaEsta = grupoEncontrado.miembros.some(function (miembro) {
            return miembro.toLowerCase() === nombre.toLowerCase();
        });

        if (nombre && !yaEsta) {
            grupoEncontrado.miembros.push(nombre);
        }

        const grupos = leerGruposFamiliares().map(function (g) {
            return g.codigo === grupoEncontrado.codigo ? grupoEncontrado : g;
        });

        localStorage.setItem("gruposFamiliares", JSON.stringify(grupos));
        localStorage.setItem("grupoFamiliar", JSON.stringify(grupoEncontrado));

        window.location.href = "./familia-home.html";
    });
}
