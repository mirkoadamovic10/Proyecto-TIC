```javascript
document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("botonLinkearEmpleado");
    const ventana = document.getElementById("ventanaEmpleado");
    const cerrar = document.getElementById("cerrarModalEmpleado");
    const formulario = document.getElementById("formularioEmpleado");

    const nombreInput = document.getElementById("nombreEmpleado");
    const dniInput = document.getElementById("dniEmpleado");
    const codigoInput = document.getElementById("codigoEmpleado");
    const mensaje = document.getElementById("mensajeEmpleado");

    const lista = document.getElementById("empleadosVinculados");
    const seccionSolicitudes = document.getElementById("seccionSolicitudesEmpleados");
    const listaSolicitudes = document.getElementById("listaSolicitudesEmpleados");

    if (
        !boton || !ventana || !cerrar || !formulario ||
        !nombreInput || !dniInput || !codigoInput ||
        !mensaje || !lista || !seccionSolicitudes || !listaSolicitudes
    ) {
        console.error("Faltan elementos necesarios en empleados.html.");
        return;
    }

    let empleados = JSON.parse(
        localStorage.getItem("empleadosInstitucion")
    ) || [];

    let solicitudes = JSON.parse(
        localStorage.getItem("solicitudesEmpleadosDemo")
    ) || [];

    function guardar() {
        localStorage.setItem("empleadosInstitucion", JSON.stringify(empleados));
        localStorage.setItem("solicitudesEmpleadosDemo", JSON.stringify(solicitudes));
    }

    function iniciales(nombre) {
        return (nombre || "E")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(function (parte) {
                return parte.charAt(0).toUpperCase();
            })
            .join("");
    }

    function mostrarEmpleados() {
        lista.innerHTML = "";

        empleados.forEach(function (empleado) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-hospital";

            const avatar = document.createElement("div");
            avatar.className = "avatar-medico";

            if (empleado.foto) {
                const img = document.createElement("img");
                img.src = empleado.foto;
                img.alt = "Foto de " + empleado.nombre;

                img.addEventListener("error", function () {
                    avatar.textContent = iniciales(empleado.nombre);
                });

                avatar.appendChild(img);
            } else {
                avatar.textContent = iniciales(empleado.nombre);
            }

            const datos = document.createElement("div");
            datos.className = "datos-medico";

            const nombre = document.createElement("h2");
            nombre.textContent = empleado.nombre;

            const estado = document.createElement("span");
            estado.className = "estado-vinculado";
            estado.textContent = "Vinculación aceptada";

            datos.append(nombre, estado);
            tarjeta.append(avatar, datos);
            lista.appendChild(tarjeta);
        });
    }

    function mostrarSolicitudes() {
        listaSolicitudes.innerHTML = "";

        const pendientes = solicitudes.filter(function (solicitud) {
            return solicitud.estado === "pendiente";
        });

        seccionSolicitudes.hidden = pendientes.length === 0;

        pendientes.forEach(function (solicitud) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "solicitud-hospital";

            const datos = document.createElement("div");
            datos.className = "datos-solicitud";

            const nombre = document.createElement("strong");
            nombre.textContent = solicitud.nombre;

            const dni = document.createElement("span");
            dni.textContent = "DNI: " + solicitud.dni;

            const codigo = document.createElement("span");
            codigo.textContent = "Código: " + solicitud.codigo;

            const estado = document.createElement("span");
            estado.textContent = "Estado: pendiente de aceptación";

            datos.append(nombre, dni, codigo, estado);

            const acciones = document.createElement("div");
            acciones.className = "acciones-solicitud";

            const aceptar = document.createElement("button");
            aceptar.type = "button";
            aceptar.className = "aceptar-solicitud";
            aceptar.textContent = "Aceptar";

            aceptar.addEventListener("click", function () {
                const actual = solicitudes.find(function (item) {
                    return item.id === solicitud.id;
                });

                if (!actual || actual.estado !== "pendiente") return;

                actual.estado = "aceptada";

                empleados.push({
                    id: actual.id,
                    nombre: actual.nombre,
                    dni: actual.dni,
                    codigo: actual.codigo,
                    foto: ""
                });

                guardar();
                mostrarEmpleados();
                mostrarSolicitudes();
            });

            const rechazar = document.createElement("button");
            rechazar.type = "button";
            rechazar.className = "rechazar-solicitud";
            rechazar.textContent = "Rechazar";

            rechazar.addEventListener("click", function () {
                const actual = solicitudes.find(function (item) {
                    return item.id === solicitud.id;
                });

                if (!actual || actual.estado !== "pendiente") return;

                actual.estado = "rechazada";
                guardar();
                mostrarSolicitudes();
            });

            acciones.append(aceptar, rechazar);
            tarjeta.append(datos, acciones);
            listaSolicitudes.appendChild(tarjeta);
        });
    }

    function abrirVentana() {
        formulario.reset();
        mensaje.textContent = "";
        ventana.classList.add("mostrar");
        ventana.setAttribute("aria-hidden", "false");
        nombreInput.focus();
    }

    function cerrarVentana() {
        ventana.classList.remove("mostrar");
        ventana.setAttribute("aria-hidden", "true");
        boton.focus();
    }

    // El botón abre la ventana.
    boton.addEventListener("click", abrirVentana);

    // Cerrar mediante la X.
    cerrar.addEventListener("click", cerrarVentana);

    // Cerrar tocando fuera del formulario.
    ventana.addEventListener("click", function (evento) {
        if (evento.target === ventana) {
            cerrarVentana();
        }
    });

    // Cerrar con Escape.
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && ventana.classList.contains("mostrar")) {
            cerrarVentana();
        }
    });

    // Enviar solicitud.
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = nombreInput.value.trim();
        const dni = dniInput.value.trim();
        const codigo = codigoInput.value.trim();

        if (!nombre || !dni || !codigo) {
            mensaje.textContent = "Completá los tres campos.";
            return;
        }

        if (!/^[0-9. -]{7,15}$/.test(dni)) {
            mensaje.textContent = "Revisá el DNI ingresado.";
            return;
        }

        const dniNormalizado = dni.replace(/[. -]/g, "");
        const codigoNormalizado = codigo.toLowerCase();

        const yaExiste = empleados.some(function (empleado) {
            return (
                String(empleado.dni || "").replace(/[. -]/g, "") === dniNormalizado ||
                String(empleado.codigo || "").toLowerCase() === codigoNormalizado
            );
        });

        if (yaExiste) {
            mensaje.textContent = "Este empleado ya está vinculado.";
            return;
        }

        const yaSolicitado = solicitudes.some(function (solicitud) {
            return solicitud.estado === "pendiente" && (
                String(solicitud.dni || "").replace(/[. -]/g, "") === dniNormalizado ||
                String(solicitud.codigo || "").toLowerCase() === codigoNormalizado
            );
        });

        if (yaSolicitado) {
            mensaje.textContent = "Ya existe una solicitud pendiente para este empleado.";
            return;
        }

        solicitudes.push({
            id: Date.now(),
            nombre: nombre,
            dni: dni,
            codigo: codigo,
            estado: "pendiente",
            fecha: new Date().toISOString()
        });

        guardar();
        mostrarSolicitudes();

        mensaje.textContent =
            "Solicitud creada. Podés aceptarla desde la sección de solicitudes.";

        formulario.reset();
    });

    mostrarEmpleados();
    mostrarSolicitudes();
});
```