const form = document.getElementById("formPreferencias");

const empleado = JSON.parse(
    localStorage.getItem("empleadoSeleccionado")
);

if (empleado) {

    const preferencias = empleado.preferenciasTrabajo || {};

    document.getElementById("formaTrabajo").value =
        preferencias.formaTrabajo || "";

    document.getElementById("ayudasTrabajo").value =
        preferencias.ayudasTrabajo || "";

    document.getElementById("ambienteTrabajo").value =
        preferencias.ambienteTrabajo || "";

    document.getElementById("organizacion").value =
        preferencias.organizacion || "";

    document.getElementById("comunicacionTrabajo").value =
        preferencias.comunicacionTrabajo || "";

    document.getElementById("otras").value =
        preferencias.otras || "";

    document.getElementById("compartirEmpresa").checked =
        empleado.permisosEmpresa?.preferenciasTrabajo || false;
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    empleado.preferenciasTrabajo = {

        formaTrabajo:
            document.getElementById("formaTrabajo").value.trim(),

        ayudasTrabajo:
            document.getElementById("ayudasTrabajo").value.trim(),

        ambienteTrabajo:
            document.getElementById("ambienteTrabajo").value.trim(),

        organizacion:
            document.getElementById("organizacion").value.trim(),

        comunicacionTrabajo:
            document.getElementById("comunicacionTrabajo").value.trim(),

        otras:
            document.getElementById("otras").value.trim()
    };

    empleado.permisosEmpresa = {

        preferenciasTrabajo:
            document.getElementById("compartirEmpresa").checked
    };

    localStorage.setItem(
        "empleadoSeleccionado",
        JSON.stringify(empleado)
    );

    const usuarios =
        JSON.parse(localStorage.getItem("usuariosNeuroPassport")) || [];

    const indice = usuarios.findIndex(
        usuario => usuario.codigo === empleado.codigo
    );

    if (indice !== -1) {

        usuarios[indice] = empleado;

        localStorage.setItem(
            "usuariosNeuroPassport",
            JSON.stringify(usuarios)
        );
    }

    window.location.href = "empleado.html";
});