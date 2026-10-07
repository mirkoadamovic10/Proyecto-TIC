// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const nombre =
    document.getElementById("nombre");

const email =
    document.getElementById("email");

const password =
    document.getElementById("password");

const rol =
    document.getElementById("rol");

const botonRegistrarse =
    document.querySelector(".register-button");


// ==========================================
// INSTITUCIÓN
// ==========================================

const contenedorTipoInstitucion =
    document.getElementById(
        "contenedorTipoInstitucion"
    );

const tipoInstitucion =
    document.getElementById(
        "tipoInstitucion"
    );


// ==========================================
// PROFESIONAL
// ==========================================

const contenedorTipoProfesional =
    document.getElementById(
        "contenedorTipoProfesional"
    );

const tipoProfesional =
    document.getElementById(
        "tipoProfesional"
    );


// ==========================================
// CAMBIO DE ROL
// ==========================================

rol.addEventListener(
    "change",
    function () {


        // ======================================
        // INSTITUCIÓN
        // ======================================

        if (rol.value === "institucion") {

            contenedorTipoInstitucion.style.display =
                "block";

        } else {

            contenedorTipoInstitucion.style.display =
                "none";

            tipoInstitucion.value = "";

        }


        // ======================================
        // PROFESIONAL
        // ======================================

        if (rol.value === "profesional") {

            contenedorTipoProfesional.style.display =
                "block";

        } else {

            contenedorTipoProfesional.style.display =
                "none";

            tipoProfesional.value = "";

        }

    }
);


// ==========================================
// BOTÓN REGISTRARSE
// ==========================================

botonRegistrarse.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        // ======================================
        // COMPROBAR DATOS GENERALES
        // ======================================

        if (
            nombre.value.trim() === "" ||
            email.value.trim() === "" ||
            password.value.trim() === "" ||
            rol.value === ""
        ) {

            alert(
                "Por favor, completá todos los datos."
            );

            return;

        }


        // ======================================
        // COMPROBAR INSTITUCIÓN
        // ======================================

        if (rol.value === "institucion") {

            if (tipoInstitucion.value === "") {

                alert(
                    "Seleccioná Escuela / Universidad o Empresa."
                );

                return;

            }

        }


        // ======================================
        // COMPROBAR PROFESIONAL
        // ======================================

        if (rol.value === "profesional") {

            if (tipoProfesional.value === "") {

                alert(
                    "Seleccioná el tipo de profesional."
                );

                return;

            }

        }


        // ======================================
        // GUARDAR DATOS GENERALES
        // ======================================

        localStorage.setItem(
            "nombreUsuario",
            nombre.value.trim()
        );

        localStorage.setItem(
            "emailUsuario",
            email.value.trim()
        );


        // ======================================
        // PERSONAL
        // ======================================

        if (rol.value === "personal") {

            window.location.href =
                "PERSONAL/personal.html";

            return;

        }


        // ======================================
        // FAMILIA
        // ======================================

        if (rol.value === "familia") {

            window.location.href =
                "FAMILIA/familia.html";

            return;

        }


        // ======================================
        // HOSPITAL
        // ======================================

        if (rol.value === "hospital") {

            window.location.href =
                "HOSPITAL/hospital.html";

            return;

        }


        // ======================================
        // INSTITUCIÓN
        // ======================================

        if (rol.value === "institucion") {

            localStorage.setItem(
                "tipoInstitucion",
                tipoInstitucion.value
            );


            // ==================================
            // EMPRESA
            // ==================================

            if (
                tipoInstitucion.value ===
                "empresa"
            ) {

                window.location.href =
                    "INSTITUCION/empresa.html";

                return;

            }


            // ==================================
            // ESCUELA / UNIVERSIDAD
            // ==================================

            if (
                tipoInstitucion.value ===
                "escuela"
            ) {

                window.location.href =
                    "INSTITUCION/escuela.html";

                return;

            }

        }


        // ======================================
        // PROFESIONAL
        // ======================================

        if (rol.value === "profesional") {

            localStorage.setItem(
                "tipoProfesional",
                tipoProfesional.value
            );


            // ==================================
            // MÉDICO
            // ==================================

            if (
                tipoProfesional.value ===
                "medico"
            ) {

                window.location.href =
                    "PROFESIONAL/MEDICO/medico.html";

                return;

            }


            // ==================================
            // TERAPISTA / KINESIÓLOGO
            // ==================================

            if (
                tipoProfesional.value ===
                "terapista"
            ) {

                window.location.href =
                    "PROFESIONAL/TERAPISTA/terapista.html";

                return;

            }


            // ==================================
            // PSICÓLOGO / PSIQUIATRA
            // ==================================

            if (
                tipoProfesional.value ===
                "psicologo"
            ) {

                window.location.href =
                    "PROFESIONAL/PSICOLOGO/psicologo.html";

                return;

            }


            // ==================================
            // EMPLEADO
            // ==================================

            if (
                tipoProfesional.value ===
                "empleado"
            ) {

                window.location.href =
                    "PROFESIONAL/EMPLEADO/empleado.html";

                return;

            }

        }

    }
);