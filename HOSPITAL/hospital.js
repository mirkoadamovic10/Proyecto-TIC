// ==========================================
// HOSPITAL DEL USUARIO: POST /api/hospitales
// Se crea una sola vez por usuario y se guarda su idHospital
// ==========================================

async function obtenerIdHospital() {
    const idUsuario = Number(localStorage.getItem("idUsuario")) || null;

    if (!idUsuario) {
        return null;
    }

    const clave = "idHospital_" + idUsuario;
    const guardado = Number(localStorage.getItem(clave));

    if (guardado) {
        return guardado;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/hospitales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: idUsuario,
                nombre: localStorage.getItem("nombreUsuario") || "Hospital"
            })
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            console.error("No se pudo crear el hospital:", error.error || respuesta.status);
            return null;
        }

        const hospital = await respuesta.json();
        localStorage.setItem(clave, hospital.idHospital);
        return hospital.idHospital;
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Configuración e Información personal propias de esta sección
    const RUTAS_CONFIGURACION = [
        "configuracion.html"
    ];

    const RUTAS_INFORMACION_PERSONAL = [
        "informacion-personal.html"
    ];

    const RUTA_CERRAR_SESION = "../cerrar-sesion.html";

    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const fotoUsuario = localStorage.getItem("fotoPerfil");

    const saludoHospital = document.getElementById("saludoHospital");
    const perfilHospital = document.getElementById("perfilHospital");
    const menuPerfil = document.getElementById("menuPerfil");

    if (nombreUsuario && saludoHospital) {
        saludoHospital.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
    }

    // Crea (o recupera) el hospital y muestra su código para que se vinculen los médicos
    obtenerIdHospital().then(function (idHospital) {
        const titulo = saludoHospital || document.querySelector("main h1");

        if (!idHospital || !titulo) return;

        const codigo = document.createElement("p");
        codigo.className = "codigo-hospital";
        codigo.textContent = "Código del hospital: " + idHospital;
        codigo.style.textAlign = "center";
        codigo.style.margin = "6px 0 0";
        titulo.insertAdjacentElement("afterend", codigo);
    });

    if (fotoUsuario && perfilHospital) {
        perfilHospital.style.backgroundImage = `url("${fotoUsuario}")`;
        perfilHospital.style.backgroundSize = "cover";
        perfilHospital.style.backgroundPosition = "center";
        perfilHospital.classList.add("tiene-foto");
    }

    if (!menuPerfil) return;

    // Busca la primera ruta que exista en el servidor y navega hacia ella
    async function irAPrimeraRutaQueExista(rutas, nombrePagina) {
        for (const ruta of rutas) {
            try {
                const respuesta = await fetch(ruta, { method: "HEAD" });

                if (respuesta.ok) {
                    window.location.href = ruta;
                    return;
                }
            } catch (error) {
                // se prueba con la siguiente ruta
            }
        }

        alert(
            "No se encontró la página de " + nombrePagina + ".\n\n" +
            "Rutas probadas:\n" + rutas.join("\n")
        );
    }

    const botones = Array.from(menuPerfil.querySelectorAll("button"));
    const btnConfiguracion = botones.find(b => b.textContent.toLowerCase().includes("configur")) || botones[0];
    const btnInfoPersonal = botones.find(b => b.textContent.toLowerCase().includes("informaci")) || botones[1];
    const btnCerrarSesion = botones.find(b => b.textContent.toLowerCase().includes("cerrar")) || botones[2];

    if (btnConfiguracion) {
        btnConfiguracion.removeAttribute("onclick");
        btnConfiguracion.onclick = null;
        btnConfiguracion.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            menuPerfil.hidden = true;
            irAPrimeraRutaQueExista(RUTAS_CONFIGURACION, "configuración");
        });
    }

    if (btnInfoPersonal) {
        btnInfoPersonal.removeAttribute("onclick");
        btnInfoPersonal.onclick = null;
        btnInfoPersonal.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            menuPerfil.hidden = true;
            irAPrimeraRutaQueExista(RUTAS_INFORMACION_PERSONAL, "información personal");
        });
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.removeAttribute("onclick");
        btnCerrarSesion.onclick = null;
        btnCerrarSesion.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            localStorage.removeItem("idUsuario");
            localStorage.removeItem("nombreUsuario");
            localStorage.removeItem("fotoPerfil");
            window.location.href = RUTA_CERRAR_SESION;
        });
    }
});