const empleado = JSON.parse(
    localStorage.getItem("empleadoSeleccionado")
);

const nombreEmpleado = document.getElementById("nombreEmpleado");
const informacion = document.getElementById("informacionEmpleado");

if (!empleado) {

    informacion.innerHTML = `
        <p class="sin-informacion">
            No se encontró el empleado.
        </p>
    `;

} else {

    nombreEmpleado.textContent = empleado.nombre;

    const permisos = empleado.permisosEmpresa || {};

    if (!permisos.preferenciasTrabajo) {

        informacion.innerHTML = `
            <p class="sin-informacion">
                Este empleado todavía no habilitó información para la empresa.
            </p>
        `;

    } else {

        informacion.innerHTML = `
            <div class="informacion-empleado">
                <h3>Preferencias de Trabajo</h3>

                <p>
                    ${empleado.preferenciasTrabajo?.comoTrabaja || "Sin información"}
                </p>

                <button onclick="location.href='preferencias-trabajo.html'">
                    Preferencias de trabajo
                </button>
            </div>
        `;
    }
}