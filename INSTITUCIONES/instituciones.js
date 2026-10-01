const nombre = localStorage.getItem("nombreUsuario");

const bienvenida = document.getElementById("bienvenidaEmpresa");

if (nombre) {
    bienvenida.textContent = `¡Hola ${nombre}! Bienvenido a NeuroPassport`;
}

const perfil = document.querySelector(".perfil-empresa");
const submenu = document.querySelector(".submenu-perfil-empresa");

if (perfil && submenu) {
    perfil.addEventListener("click", function(event) {
        event.stopPropagation();
        submenu.classList.toggle("mostrar");
    });

    document.addEventListener("click", function() {
        submenu.classList.remove("mostrar");
    });
}