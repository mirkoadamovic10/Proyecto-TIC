const codigoUsuario =
    localStorage.getItem("codigoUsuario");


const form =
    document.getElementById("formPreferencias");

const aprendeMejor =
    document.getElementById("aprendeMejor");

const ayudas =
    document.getElementById("ayudas");

const ambiente =
    document.getElementById("ambiente");

const evaluaciones =
    document.getElementById("evaluaciones");

const observaciones =
    document.getElementById("observaciones");

const compartirEscuela =
    document.getElementById("compartirEscuela");

const mensaje =
    document.getElementById("mensajePreferencias");


function obtenerUsuarios() {

    return JSON.parse(
        localStorage.getItem("usuariosNeuroPassport") || "[]"
    );

}


function guardarUsuarios(usuarios) {

    localStorage.setItem(
        "usuariosNeuroPassport",
        JSON.stringify(usuarios)
    );

}


const usuarios =
    obtenerUsuarios();


const usuario =
    usuarios.find(function(usuario) {

        return usuario.codigo === codigoUsuario;

    });


if (usuario) {

    const preferencias =
        usuario.preferenciasAprendizaje || {};


    aprendeMejor.value =
        preferencias.aprendeMejor || "";

    ayudas.value =
        preferencias.ayudas || "";

    ambiente.value =
        preferencias.ambiente || "";

    evaluaciones.value =
        preferencias.evaluaciones || "";

    observaciones.value =
        preferencias.observaciones || "";


    compartirEscuela.checked =
        usuario.permisosEscuela?.preferenciasAprendizaje || false;

}


form.addEventListener("submit", function(event) {

    event.preventDefault();


    const indice =
        usuarios.findIndex(function(usuario) {

            return usuario.codigo === codigoUsuario;

        });


    if (indice === -1) {

        mensaje.textContent =
            "No se pudo encontrar el usuario.";

        return;

    }


    usuarios[indice].preferenciasAprendizaje = {

        aprendeMejor:
            aprendeMejor.value.trim(),

        ayudas:
            ayudas.value.trim(),

        ambiente:
            ambiente.value.trim(),

        evaluaciones:
            evaluaciones.value.trim(),

        observaciones:
            observaciones.value.trim()

    };


    if (!usuarios[indice].permisosEscuela) {

        usuarios[indice].permisosEscuela = {};

    }


    usuarios[indice]
        .permisosEscuela
        .preferenciasAprendizaje =
            compartirEscuela.checked;


    guardarUsuarios(usuarios);


    mensaje.textContent =
        compartirEscuela.checked
            ? "Preferencias guardadas y compartidas con la escuela."
            : "Preferencias guardadas. La escuela no puede verlas.";


});