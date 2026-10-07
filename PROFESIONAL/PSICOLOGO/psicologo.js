// ==========================================
// NOMBRE DEL USUARIO
// ==========================================

const nombreUsuario =
    localStorage.getItem("nombreUsuario");


// ==========================================
// SALUDO
// ==========================================

const saludoPsicologo =
    document.getElementById(
        "saludoPsicologo"
    );


// ==========================================
// MOSTRAR NOMBRE
// ==========================================

if (
    nombreUsuario &&
    saludoPsicologo
) {

    saludoPsicologo.textContent =
        `¡Hola ${nombreUsuario}! Bienvenido a NeuroPassport`;

}