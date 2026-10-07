```javascript
const guardarPreferencias =
    document.getElementById("guardarPreferencias");

guardarPreferencias.addEventListener("click", () => {

    const preferencias = {

        ambienteTrabajo:
            document.getElementById("ambienteTrabajo").value,

        trabajoEquipo:
            document.getElementById("trabajoEquipo").value,

        comunicacion:
            document.getElementById("comunicacion").value,

        horario:
            document.getElementById("horario").value,

        sensibilidad:
            document.getElementById("sensibilidad").value,

        adaptaciones:
            document.getElementById("adaptaciones").value,

        otrasPreferencias:
            document.getElementById("otrasPreferencias").value
    };


    localStorage.setItem(
        "preferenciasTrabajo",
        JSON.stringify(preferencias)
    );


    mostrarToast(
        "✓ Preferencias de trabajo guardadas correctamente"
    );
});


function mostrarToast(mensaje) {

    const toast = document.createElement("div");

    toast.className = "toast-neuropassport";

    toast.textContent = mensaje;

    document.body.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3000);
}
```