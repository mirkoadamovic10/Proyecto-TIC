const botonRegistrarse = document.getElementById("registrarse");

if (botonRegistrarse) {
    botonRegistrarse.addEventListener("click", () => {
        window.location.href = "registrarse.html";
    });
}

fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(datosUsuario) 
  })
  .then(respuesta => {
    return respuesta.json().then(datos => {
      if (!respuesta.ok) {
        throw new Error(datos.message || 'Error en el servidor');
      }
      return datos;
    });
  })
  .then(datos => {
    console.log('Usuario registrado con éxito:', datos);
  })
  .catch(error => {
    console.error('Hubo un problema al registrar:', error.message);
  });