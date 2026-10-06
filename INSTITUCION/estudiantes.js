const codigoEstudiante =
    document.getElementById("codigoEstudiante");

const botonLinkearEstudiante =
    document.getElementById("botonLinkearEstudiante");

const estudiantesVinculados =
    document.getElementById("estudiantesVinculados");


let estudiantes = JSON.parse(
    localStorage.getItem("estudiantesLinkeados")
) || [];


// Mostrar estudiantes

function mostrarEstudiantes() {

    estudiantesVinculados.innerHTML = "";


    if (estudiantes.length === 0) {

        estudiantesVinculados.innerHTML =
            "<p>No hay estudiantes vinculados todavía.</p>";

        return;

    }


    estudiantes.forEach(function(estudiante, indice) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-estudiante";


        tarjeta.innerHTML = `

            <h3>
                ${estudiante.nombre}
            </h3>

            <p>
                Estudiante vinculado
            </p>

            <button onclick="verEstudiante(${indice})">
                Preferencias de aprendizaje
            </button>

        `;


        estudiantesVinculados.appendChild(tarjeta);

    });

}


// Linkear estudiante

botonLinkearEstudiante.addEventListener(
    "click",
    function() {

        const codigo =
            codigoEstudiante.value.trim();


        if (codigo === "") {

            alert(
                "Ingresá el código del estudiante."
            );

            return;

        }


        const estudiante = {

            nombre: "Estudiante vinculado",

            codigo: codigo

        };


        estudiantes.push(estudiante);


        localStorage.setItem(
            "estudiantesLinkeados",
            JSON.stringify(estudiantes)
        );


        codigoEstudiante.value = "";


        mostrarEstudiantes();

    }
);


// Ver estudiante

function verEstudiante(indice) {

    localStorage.setItem(
        "estudianteSeleccionado",
        JSON.stringify(estudiantes[indice])
    );


    window.location.href =
        "estudiante.html";

}


mostrarEstudiantes();