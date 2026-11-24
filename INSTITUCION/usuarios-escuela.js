// ==========================================
// USUARIOS DE LA ESCUELA
// Profesionales vinculados a la institución.
// El "código" de un usuario es su número de usuario en NeuroPassport
// (GET /api/usuarios/:id para comprobar que existe y traer su nombre).
// ==========================================

const API_USUARIOS = "http://localhost:3000/api/usuarios";

const idInstitucionUsuario = Number(localStorage.getItem("idUsuario")) || 0;
const CLAVE_USUARIOS = "usuariosEscuela_" + idInstitucionUsuario;

const listaUsuarios = document.getElementById("listaUsuarios");
const sinUsuarios = document.getElementById("sinUsuarios");

const ventanaUsuario = document.getElementById("ventanaUsuario");
const formularioUsuario = document.getElementById("formularioUsuario");
const nombreInput = document.getElementById("nombreUsuarioVincular");
const codigoInput = document.getElementById("codigoUsuarioVincular");
const mensajeUsuario = document.getElementById("mensajeUsuario");


function leerUsuarios() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

let usuarios = leerUsuarios();

function guardarUsuarios() {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function iniciales(nombre) {
    return String(nombre || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (parte) { return parte.charAt(0).toUpperCase(); })
        .join("");
}


/* ---------- MOSTRAR LA LISTA ---------- */

function mostrarUsuarios() {
    listaUsuarios.innerHTML = "";

    usuarios.forEach(function (usuario) {
        const item = document.createElement("li");

        const tarjeta = document.createElement("button");
        tarjeta.type = "button";
        tarjeta.className = "usu-tarjeta";
        tarjeta.setAttribute("aria-label", "Ver perfil de " + usuario.nombre);

        const avatar = document.createElement("span");
        avatar.className = "usu-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = iniciales(usuario.nombre);

        const datos = document.createElement("span");
        datos.className = "usu-datos";

        const nombre = document.createElement("strong");
        nombre.textContent = usuario.nombre;

        const detalle = document.createElement("span");
        detalle.textContent = usuario.rol
            ? usuario.rol + " · Código " + usuario.codigo
            : "Código " + usuario.codigo;

        datos.append(nombre, detalle);
        tarjeta.append(avatar, datos);

        // Al tocar un usuario se abre su perfil profesional
        tarjeta.addEventListener("click", function () {
            window.location.href = "perfil-profesional-usuarios.html?id=" + encodeURIComponent(usuario.codigo);
        });

        item.appendChild(tarjeta);
        listaUsuarios.appendChild(item);
    });

    sinUsuarios.hidden = usuarios.length > 0;
}


/* ---------- LINKEAR UN USUARIO ---------- */

function abrirVentana() {
    formularioUsuario.reset();
    mensajeUsuario.textContent = "";
    ventanaUsuario.showModal();
    nombreInput.focus();
}

function cerrarVentana() {
    ventanaUsuario.close();
}

document.getElementById("botonLinkearUsuario").addEventListener("click", abrirVentana);
document.getElementById("cerrarVentanaUsuario").addEventListener("click", cerrarVentana);

// Cerrar tocando afuera de la ventana
ventanaUsuario.addEventListener("click", function (evento) {
    if (evento.target === ventanaUsuario) cerrarVentana();
});

const NOMBRES_PROFESION = { medico: "Médico", psicologo: "Psicólogo", terapista: "Terapista", empleado: "Empleado" };

function capitalizar(texto) {
    texto = String(texto || "");
    if (NOMBRES_PROFESION[texto]) return NOMBRES_PROFESION[texto];
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

formularioUsuario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const codigo = codigoInput.value.trim();
    let nombre = nombreInput.value.trim();
    let rol = "";

    if (!codigo) {
        mensajeUsuario.textContent = "Ingresá el código del usuario.";
        return;
    }

    const yaEsta = usuarios.some(function (usuario) {
        return String(usuario.codigo).toLowerCase() === codigo.toLowerCase();
    });

    if (yaEsta) {
        mensajeUsuario.textContent = "Este usuario ya está vinculado.";
        return;
    }

    // Cualquier código sirve. Si el usuario existe en el servidor,
    // se completan su nombre y profesión con los datos reales.
    try {
        const respuesta = await fetch(`${API_USUARIOS}/${encodeURIComponent(codigo)}`);

        if (respuesta.ok) {
            const datos = await respuesta.json();
            nombre = nombre || datos.nombre || "";
            rol = capitalizar(datos.tipoProfesional);
        }
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
    }

    if (!nombre) {
        mensajeUsuario.textContent = "Completá el nombre y apellido.";
        return;
    }

    usuarios.push({
        codigo: codigo,
        nombre: nombre,
        rol: rol
    });

    guardarUsuarios();
    mostrarUsuarios();
    cerrarVentana();
});


/* ---------- VOLVER Y MENÚ DE PERFIL ---------- */

document.getElementById("botonAtras").addEventListener("click", function () {
    window.location.href = "escuela.html";
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


mostrarUsuarios();


// ==========================================
// FOTO DE PERFIL: se muestra en el botón de perfil
// (es la que se elige en Configuración)
// ==========================================
(function () {
    function mostrarFotoPerfil() {
        const foto = localStorage.getItem("fotoPerfil");
        const botonConFoto = document.getElementById("botonPerfil");

        if (!foto || !botonConFoto) {
            return;
        }

        // "important" para ganarle al color de fondo que tiene el botón en el CSS
        botonConFoto.style.setProperty("background-image", 'url("' + foto + '")', "important");
        botonConFoto.style.setProperty("background-size", "cover", "important");
        botonConFoto.style.setProperty("background-position", "center", "important");
        botonConFoto.style.setProperty("background-repeat", "no-repeat", "important");
        botonConFoto.classList.add("con-foto-perfil");

        // Se oculta el muñequito que está adentro del botón
        Array.from(botonConFoto.children).forEach(function (hijo) {
            hijo.style.setProperty("display", "none", "important");
        });
    }

    // Se aplica cuando la página terminó de cargar, después del resto del código
    if (document.readyState === "complete") {
        mostrarFotoPerfil();
    } else {
        window.addEventListener("load", mostrarFotoPerfil);
    }
})();
