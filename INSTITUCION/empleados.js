const codigoEmpleado = document.getElementById("codigoEmpleado");
const botonLinkearEmpleado = document.getElementById("botonLinkearEmpleado");
const empleadosVinculados = document.getElementById("empleadosVinculados");

let empleados = JSON.parse(
    localStorage.getItem("empleadosLinkeados")
) || [];


// Mostrar empleados
function mostrarEmpleados() {

    empleadosVinculados.innerHTML = "";

    if (empleados.length === 0) {

        empleadosVinculados.innerHTML =
            "<p>No hay empleados vinculados todavía.</p>";

        return;
    }


    empleados.forEach(function(empleado, indice) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta-empleado";

        tarjeta.innerHTML = `
            <h3>${empleado.nombre}</h3>

            <p>Empleado vinculado</p>

            <button onclick="verEmpleado(${indice})">
                Ver información
            </button>
        `;

        empleadosVinculados.appendChild(tarjeta);

    });

}


// Linkear empleado
botonLinkearEmpleado.addEventListener("click", function() {

    const codigo = codigoEmpleado.value.trim();

    if (codigo === "") {

        alert("Ingresá el código del empleado.");

        return;
    }


    /*
       Por ahora guardamos el código.
       Después podemos conectarlo con el sistema
       de códigos de NeuroPassport.
    */

    const empleado = {

        nombre: "Empleado vinculado",

        codigo: codigo

    };


    empleados.push(empleado);


    localStorage.setItem(
        "empleadosLinkeados",
        JSON.stringify(empleados)
    );


    codigoEmpleado.value = "";

    mostrarEmpleados();

});


// Abrir empleado
function verEmpleado(indice) {

    localStorage.setItem(
        "empleadoSeleccionado",
        JSON.stringify(empleados[indice])
    );

    window.location.href = "empleado.html";

}


mostrarEmpleados();