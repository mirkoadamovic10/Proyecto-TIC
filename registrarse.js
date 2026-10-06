const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rol = document.getElementById("rol");

const botonRegistrarse =
    document.querySelector(".register-button");

const contenedorTipoInstitucion =
    document.getElementById("contenedorTipoInstitucion");

const tipoInstitucion =
    document.getElementById("tipoInstitucion");


// ==========================================
// MOSTRAR TIPO DE INSTITUCIÓN
// ==========================================

rol.addEventListener("change", function () {

    if (rol.value === "institucion") {

        contenedorTipoInstitucion.style.display = "block";

    } else {

        contenedorTipoInstitucion.style.display = "none";

        tipoInstitucion.value = "";

    }

});


// ==========================================
// REGISTRARSE
// ==========================================

botonRegistrarse.addEventListener("click", function (event) {

    event.preventDefault();


    // Comprobar datos básicos

    if (
        nombre.value.trim() === "" ||
        email.value.trim() === "" ||
        password.value.trim() === "" ||
        rol.value === ""
    ) {

        alert("Por favor, completá todos los datos.");

        return;

    }


    // ==========================================
    // INSTITUCIÓN
    // ==========================================

    if (rol.value === "institucion") {

        // Comprobar que haya elegido
        // Escuela/Universidad o Empresa

        if (tipoInstitucion.value === "") {

            alert(
                "Seleccioná si sos una Escuela / Universidad o una Empresa."
            );

            return;

        }


        // Guardar datos de institución

        localStorage.setItem(
            "nombreUsuario",
            nombre.value.trim()
        );

        localStorage.setItem(
            "emailUsuario",
            email.value.trim()
        );

        localStorage.setItem(
            "tipoInstitucion",
            tipoInstitucion.value
        );


        // EMPRESA

        if (tipoInstitucion.value === "empresa") {

            window.location.href =
                "INSTITUCION/empresa.html";

            return;

        }


        // ESCUELA / UNIVERSIDAD

        if (tipoInstitucion.value === "escuela") {

            window.location.href =
                "INSTITUCION/escuela.html";

            return;

        }

    }


    // ==========================================
    // GUARDAR DATOS DE LOS OTROS ROLES
    // ==========================================

    localStorage.setItem(
        "nombreUsuario",
        nombre.value.trim()
    );

    localStorage.setItem(
        "emailUsuario",
        email.value.trim()
    );


    // PERSONAL

    if (rol.value === "personal") {

        window.location.href =
            "PERSONAL/personal.html";

        return;

    }


    // FAMILIA

    if (rol.value === "familia") {

        window.location.href =
            "FAMILIA/familia.html";

        return;

    }


    // MÉDICO

    if (rol.value === "medico") {

        window.location.href =
            "MEDICO/medico.html";

        return;

    }


    // TERAPISTA

    if (rol.value === "terapista") {

        window.location.href =
            "TERAPISTA/terapista.html";

        return;

    }


    // HOSPITAL

    if (rol.value === "hospital") {

        window.location.href =
            "HOSPITAL/hospital.html";

        return;

    }

});