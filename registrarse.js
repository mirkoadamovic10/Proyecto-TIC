let usuarios = [];

// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rol = document.getElementById("rol");
const botonRegistrarse = document.querySelector(".register-button");


// ==========================================
// INSTITUCIÓN
// ==========================================

const contenedorTipoInstitucion = document.getElementById("contenedorTipoInstitucion");
const tipoInstitucion = document.getElementById("tipoInstitucion");


// ==========================================
// PROFESIONAL
// ==========================================

const contenedorTipoProfesional = document.getElementById("contenedorTipoProfesional");
const tipoProfesional = document.getElementById("tipoProfesional");


// ==========================================
// CAMBIO DE ROL
// ==========================================

rol?.addEventListener("change", function () {

    // INSTITUCIÓN
    if (rol.value === "institucion") {
        contenedorTipoInstitucion.style.display = "block";
    } else {
        contenedorTipoInstitucion.style.display = "none";
        tipoInstitucion.value = "";
    }

    // PROFESIONAL
    if (rol.value === "profesional") {
        contenedorTipoProfesional.style.display = "block";
    } else {
        contenedorTipoProfesional.style.display = "none";
        tipoProfesional.value = "";
    }
});


// ==========================================
// BOTÓN REGISTRARSE
// ==========================================

botonRegistrarse?.addEventListener("click", function (event) {

    event.preventDefault();

    // 1. COMPROBAR DATOS GENERALES
    if (
        nombre.value.trim() === "" ||
        email.value.trim() === "" ||
        password.value.trim() === "" ||
        rol.value === ""
    ) {
        alert("Por favor, completá todos los datos.");
        return;
    }

    // 2. COMPROBAR INSTITUCIÓN
    if (rol.value === "institucion" && tipoInstitucion.value === "") {
        alert("Seleccioná Escuela / Universidad o Empresa.");
        return;
    }

    // 3. COMPROBAR PROFESIONAL
    if (rol.value === "profesional" && tipoProfesional.value === "") {
        alert("Seleccioná el tipo de profesional.");
        return;
    }

    // 4. ARMAR OBJETO DE DATOS PARA EL FETCH
    const datosUsuario = {
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        rol: rol.value,
        tipoInstitucion: tipoInstitucion ? tipoInstitucion.value : "",
        tipoProfesional: tipoProfesional ? tipoProfesional.value : ""
    };

    // 5. PETICIÓN FETCH AL BACKEND
    fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosUsuario)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.error || "Error al registrar usuario.");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario registrado con éxito:');
        console.log(data);
        
        usuarios = data;

        // GUARDAR DATOS Y MANEJAR REDIRECCIONES SEGÚN EL ROL
        localStorage.setItem("nombreUsuario", datosUsuario.nombre);
        localStorage.setItem("emailUsuario", datosUsuario.email);

        if (rol.value === "personal") {
            window.location.href = "PERSONAL/personal.html";
            return;
        }

        if (rol.value === "familia") {
            window.location.href = "FAMILIA/familia.html";
            return;
        }

        if (rol.value === "hospital") {
            window.location.href = "HOSPITAL/hospital.html";
            return;
        }

        if (rol.value === "institucion") {
            localStorage.setItem("tipoInstitucion", tipoInstitucion.value);

            if (tipoInstitucion.value === "empresa") {
                window.location.href = "INSTITUCION/empresa.html";
                return;
            }

            if (tipoInstitucion.value === "escuela") {
                window.location.href = "INSTITUCION/escuela.html";
                return;
            }
        }

        if (rol.value === "profesional") {
            localStorage.setItem("tipoProfesional", tipoProfesional.value);

            if (tipoProfesional.value === "medico") {
                window.location.href = "PROFESIONAL/MEDICO/medico.html";
                return;
            }

            if (tipoProfesional.value === "terapista") {
                window.location.href = "PROFESIONAL/TERAPISTA/terapista.html";
                return;
            }

            if (tipoProfesional.value === "psicologo") {
                window.location.href = "PROFESIONAL/PSICOLOGO/psicologo.html";
                return;
            }

            if (tipoProfesional.value === "empleado") {
                window.location.href = "PROFESIONAL/EMPLEADO/empleado.html";
                return;
            }
        }
    })
    .catch(error => {
        console.error('Hubo un problema al registrar:', error);
        alert(error.message || "No se pudo completar el registro.");
    });
});