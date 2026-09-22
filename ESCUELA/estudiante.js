const indice =
    localStorage.getItem("estudianteSeleccionado");


const estudiantes =
    JSON.parse(
        localStorage.getItem("estudiantesVinculados") || "[]"
    );


if (
    indice === null ||
    !estudiantes[indice]
) {

    window.location.href =
        "estudiantes.html";

}


const estudiante =
    estudiantes[indice];


const nombre =
    document.getElementById("nombreEstudiante");

const avatar =
    document.getElementById("avatarEstudiante");

const contenido =
    document.getElementById("contenidoHabilitado");

const sinInformacion =
    document.getElementById("sinInformacion");


nombre.textContent =
    estudiante.nombre;


avatar.textContent =
    estudiante.nombre
        .charAt(0)
        .toUpperCase();


const usuarios =
    JSON.parse(
        localStorage.getItem("usuariosNeuroPassport") || "[]"
    );


const usuarioCompleto =
    usuarios.find(function(usuario) {

        return usuario.codigo === estudiante.codigo;

    });


if (!usuarioCompleto) {

    sinInformacion.hidden = false;

} else {

    const permisos =
        usuarioCompleto.permisosEscuela || {};

    const preferencias =
        usuarioCompleto.preferenciasAprendizaje || {};


    let hayInformacion = false;


    if (
        permisos.preferenciasAprendizaje &&
        Object.keys(preferencias).length > 0
    ) {

        hayInformacion = true;


        const tarjeta =
            document.createElement("button");

        tarjeta.className =
            "informacion-habilitada-boton";

        tarjeta.innerHTML = `
            <div>
                <h3>Preferencias de aprendizaje</h3>

                <p>
                    Ver cómo aprende mejor este estudiante
                </p>
            </div>

            <span>→</span>
        `;


        tarjeta.addEventListener("click", function() {

            localStorage.setItem(
                "estudiantePerfilCodigo",
                estudiante.codigo
            );

            window.location.href =
                "preferencias-aprendizaje.html";

        });


        contenido.appendChild(tarjeta);

    }


    if (
        permisos.adaptaciones
    ) {

        hayInformacion = true;


        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "informacion-simple";

        tarjeta.innerHTML = `
            <h3>Adaptaciones</h3>
            <p>
                El estudiante habilitó esta información.
            </p>
        `;

        contenido.appendChild(tarjeta);

    }


    if (
        permisos.comunicacion
    ) {

        hayInformacion = true;


        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "informacion-simple";

        tarjeta.innerHTML = `
            <h3>Formas de comunicación</h3>
            <p>
                El estudiante habilitó esta información.
            </p>
        `;

        contenido.appendChild(tarjeta);

    }


    if (!hayInformacion) {

        sinInformacion.hidden = false;

    }

}