document.addEventListener("DOMContentLoaded", function () {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    
    const saludoFamilia = document.getElementById("saludoFamilia");
    const perfilAgenda = document.getElementById("perfilAgenda");
    const navCabeza = document.getElementById("navCabeza");
    const navCuerpo = document.getElementById("navCuerpo");

    if (nombreUsuario && saludoFamilia) {
        saludoFamilia.textContent = `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;
    }

    if (fotoGuardada && perfilAgenda) {
        perfilAgenda.style.backgroundImage = `url("${fotoGuardada}")`;
        perfilAgenda.style.backgroundSize = "cover";
        perfilAgenda.style.backgroundPosition = "center";
        
        if (navCabeza) navCabeza.style.display = "none";
        if (navCuerpo) navCuerpo.style.display = "none";
    }
});