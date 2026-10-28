const formulario = document.querySelector("form");


const inputEmail = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

let usuarios = [];

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
    .then(data => {
        console.log('Usuario autenticado con éxito:', data);
        
        usuarios = data;

        if (data.usuario) {
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            
            if (data.usuario.nombre) {
                localStorage.setItem("nombreUsuario", data.usuario.nombre);
            }
            if (data.usuario.email) {
                localStorage.setItem("emailUsuario", data.usuario.email);
            }
        }

        alert(data.mensaje || "¡Bienvenido/a!");

      
        const usuarioLogueado = data.usuario;

        if (usuarioLogueado && usuarioLogueado.rol) {
            const rol = usuarioLogueado.rol;

            if (rol === "personal") {
                window.location.href = "../PERSONAL/personal.html";
                return;
            }

            if (rol === "familia") {
                window.location.href = "../FAMILIA/familia.html";
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