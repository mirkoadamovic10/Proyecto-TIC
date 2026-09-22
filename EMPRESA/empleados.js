const inputCodigo = document.getElementById("codigoEmpleado");
const botonLinkear = document.getElementById("botonLinkearEmpleado");
const lista = document.getElementById("empleadosVinculados");

let empleadosVinculados =
    JSON.parse(localStorage.getItem("empleadosVinculados")) || [];

function mostrarEmpleados() {

    lista.innerHTML = "";

    if (empleadosVinculados.length === 0) {
        lista.innerHTML = `
            <p class="sin-empleados">
                Todavía no hay empleados vinculados.
            </p>
        `;
        return;
    }

    empleadosVinculados.forEach((empleado, index) => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta-empleado";

        tarjeta.innerHTML = `
            <div>
                <h3>${empleado.nombre}</h3>
                <p>Código: ${empleado.codigo}</p>
            </div>

            <button onclick="verEmpleado(${index})">
                Ver perfil
            </button>
        `;

        lista.appendChild(tarjeta);
    });
}

botonLinkear.addEventListener("click", function() {

    const codigo = inputCodigo.value.trim();

    if (codigo === "") {
        return;
    }

    const usuarios =
        JSON.parse(localStorage.getItem("usuariosNeuroPassport")) || [];

    const empleado = usuarios.find(
        usuario =>
            usuario.codigo === codigo &&
            usuario.rol === "personal"
    );

    if (!empleado) {
        return;
    }

    const yaVinculado = empleadosVinculados.some(
        persona => persona.codigo === empleado.codigo
    );

    if (yaVinculado) {
        return;
    }

    empleadosVinculados.push(empleado);

    localStorage.setItem(
        "empleadosVinculados",
        JSON.stringify(empleadosVinculados)
    );

    inputCodigo.value = "";

    mostrarEmpleados();
});

function verEmpleado(index) {

    localStorage.setItem(
        "empleadoSeleccionado",
        JSON.stringify(empleadosVinculados[index])
    );

    window.location.href = "empleado.html";
}

mostrarEmpleados();