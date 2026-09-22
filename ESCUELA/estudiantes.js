const inputCodigo = document.getElementById("codigoEstudiante");
const botonLinkear = document.getElementById("botonLinkear");
const mensaje = document.getElementById("mensajeLinkeo");
const lista = document.getElementById("listaEstudiantes");


function obtenerEstudiantes() {

    const datos =
        localStorage.getItem("estudiantesVinculados");

    if (!datos) {
        return [];
    }

    return JSON.parse(datos);
}


function guardarEstudiantes(estudiantes) {

    localStorage.setItem(
        "estudiantesVinculados",
        JSON.stringify(estudiantes)
    );

}


function mostrarEstudiantes() {

    const estudiantes = obtenerEstudiantes();

    lista.innerHTML = "";

    if (estudiantes.length === 0) {

        lista.innerHTML = `
            <div class="sin-estudiantes">
                <h3>No hay estudiantes vinculados</h3>
                <p>
                    Cuando vincules un estudiante,
                    aparecerá acá.
                </p>
            </div>
        `;

        return;
    }


    estudiantes.forEach(function(estudiante, indice) {

        const tarjeta = document.createElement("button");

        tarjeta.className = "tarjeta-estudiante";

        tarjeta.innerHTML = `
            <div class="avatar-estudiante">
                ${estudiante.nombre.charAt(0).toUpperCase()}
            </div>

            <div>
                <h3>${estudiante.nombre}</h3>

                <p>
                    Estudiante vinculado
                </p>
            </div>
        `;

        tarjeta.addEventListener("click", function() {

            localStorage.setItem(
                "estudianteSeleccionado",
                indice
            );

            window.location.href = "estudiante.html";

        });

        lista.appendChild(tarjeta);

    });

}


botonLinkear.addEventListener("click", function() {

    const codigo = inputCodigo.value.trim();

    if (codigo === "") {

        mensaje.textContent =
            "Ingresá un código de estudiante.";

        return;
    }


    const usuarios =
        JSON.parse(localStorage.getItem("usuariosNeuroPassport") || "[]");


    const estudianteEncontrado =
        usuarios.find(function(usuario) {

            return usuario.codigo === codigo &&
                   usuario.rol === "personal";

        });


    if (!estudianteEncontrado) {

        mensaje.textContent =
            "No encontramos un estudiante con ese código.";

        return;
    }


    const estudiantes = obtenerEstudiantes();


    const yaExiste =
        estudiantes.some(function(estudiante) {

            return estudiante.codigo === codigo;

        });


    if (yaExiste) {

        mensaje.textContent =
            "Este estudiante ya está vinculado.";

        return;
    }


    estudiantes.push({

        nombre: estudianteEncontrado.nombre,

        email: estudianteEncontrado.email,

        codigo: estudianteEncontrado.codigo

    });


    guardarEstudiantes(estudiantes);


    mensaje.textContent =
        "Estudiante vinculado correctamente.";

    inputCodigo.value = "";

    mostrarEstudiantes();

});


mostrarEstudiantes();