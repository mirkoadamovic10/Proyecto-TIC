const formulario = document.querySelector("form");


const inputEmail = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

let usuarios = [];

// ==========================================
// BUSCAR EL USUARIO POR EMAIL
// El backend no devuelve el usuario al registrarse ni al iniciar sesión,
// así que se busca con GET /api/usuarios/:id (los id van 1, 2, 3...)
// ==========================================

async function buscarUsuarioPorEmail(emailBuscado) {
    for (let id = 1; id <= 1000; id++) {
        const respuesta = await fetch(`http://localhost:3000/api/usuarios/${id}`);

        if (!respuesta.ok) {
            return null; // ya no hay más usuarios
        }

        const usuario = await respuesta.json();

        if (usuario.email && usuario.email.toLowerCase() === emailBuscado.toLowerCase()) {
            return usuario;
        }
    }

    return null;
}

// Guarda los datos de la sesión para que los usen las demás pantallas
function guardarSesion(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("idUsuario", usuario.idUsuario);
    localStorage.setItem("nombreUsuario", usuario.nombre || "");
    localStorage.setItem("emailUsuario", usuario.email || "");
    localStorage.setItem("rolUsuario", usuario.rol || "");

    if (usuario.tipoInstitucion) {
        localStorage.setItem("tipoInstitucion", usuario.tipoInstitucion);
    }

    if (usuario.tipoProfesional) {
        localStorage.setItem("tipoProfesional", usuario.tipoProfesional);
    }
}

formulario?.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const email = inputEmail?.value.trim() || "";
    const password = inputPassword?.value.trim() || "";

    if (!email || !password) {
        alert("Por favor, completá toda la información.");
        return;
    }

    const datosUsuario = {
        email: email,
        password: password
    };

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosUsuario)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.error || "Error al iniciar sesión.");
            });
        }
        return response.json();
    })
    .then(async data => {
        console.log('Usuario autenticado con éxito:', data);
        
        usuarios = data;

        // Si el backend no manda el usuario, se busca por email
        const usuarioLogueado = data.usuario || await buscarUsuarioPorEmail(email);

        if (usuarioLogueado) {
            // Guardar el ID del usuario para las demás APIs
            guardarSesion(usuarioLogueado);
        }

        alert(data.mensaje || "¡Bienvenido/a!");

        if (usuarioLogueado && usuarioLogueado.rol) {
            const rol = usuarioLogueado.rol;

            if (rol === "personal") {
                window.location.href = "../PERSONAL/personal.html";
                return;
            }

            if (rol === "familia") {
                window.location.href = "../PERSONAL/familia.html";
                return;
            }

            if (rol === "hospital") {
                window.location.href = "../HOSPITAL/hospital.html";
                return;
            }

            if (rol === "institucion") {
                if (usuarioLogueado.tipoInstitucion === "empresa") {
                    window.location.href = "../INSTITUCION/empresa.html";
                    return;
                }
                if (usuarioLogueado.tipoInstitucion === "escuela") {
                    window.location.href = "../INSTITUCION/escuela.html";
                    return;
                }
            }

            if (rol === "profesional") {
                const tipo = usuarioLogueado.tipoProfesional;
                if (tipo === "medico") {
                    window.location.href = "../PROFESIONAL/MEDICO/medico.html";
                    return;
                }
                if (tipo === "terapista") {
                    window.location.href = "../PROFESIONAL/TERAPISTA/terapista.html";
                    return;
                }
                if (tipo === "psicologo") {
                    window.location.href = "../PROFESIONAL/PSICOLOGO/psicologo.html";
                    return;
                }
                if (tipo === "empleado") {
                    window.location.href = "../PROFESIONAL/EMPLEADO/empleado.html";
                    return;
                }
            }
        }

        window.location.href = "../index.html";
    })
    .catch(error => {
        console.error('Hubo un problema al iniciar sesión:', error);
        alert(error.message || "No se pudo conectar con el servidor.");
    });
});