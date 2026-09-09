```javascript
// ========================================
// ALERTAS
// ========================================

const formularioAlerta =
    document.getElementById("formularioAlerta");

const listaAlertas =
    document.getElementById("listaAlertas");

const mensajeSinAlertas =
    document.getElementById("mensajeSinAlertas");


// ========================================
// GUARDAR ALERTA
// ========================================

if (formularioAlerta && listaAlertas) {

    formularioAlerta.addEventListener(
        "submit",
        function (evento) {

            // Evitar que la página se recargue
            evento.preventDefault();


            // Obtener los datos
            const tipo =
                document
                    .getElementById("tipoAlerta")
                    .value;

            const detalle =
                document
                    .getElementById("detalleAlerta")
                    .value;

            const fecha =
                document
                    .getElementById("fechaAlerta")
                    .value;

            const hora =
                document
                    .getElementById("horaAlerta")
                    .value;


            // Crear alerta
            const alerta =
                document.createElement("article");


            alerta.classList.add(
                "alerta-guardada"
            );


            // Crear contenido
            alerta.innerHTML = `

                <h3>${tipo}</h3>

                <p>
                    <strong>Detalle:</strong>
                    ${detalle}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${fecha}
                </p>

                <p>
                    <strong>Hora:</strong>
                    ${hora}
                </p>

                <button
                    type="button"
                    class="boton-eliminar-alerta">

                    Eliminar alerta

                </button>

            `;


            // Quitar mensaje inicial
            if (mensajeSinAlertas) {

                mensajeSinAlertas.remove();

            }


            // Agregar alerta a la lista
            listaAlertas.appendChild(
                alerta
            );


            // Buscar botón eliminar
            const botonEliminar =
                alerta.querySelector(
                    ".boton-eliminar-alerta"
                );


            // Eliminar alerta
            if (botonEliminar) {

                botonEliminar.addEventListener(
                    "click",
                    function () {

                        alerta.remove();


                        // Si ya no quedan alertas,
                        // mostrar mensaje nuevamente
                        if (
                            listaAlertas
                                .querySelectorAll(
                                    ".alerta-guardada"
                                )
                                .length === 0
                        ) {

                            const mensaje =
                                document.createElement("p");

                            mensaje.id =
                                "mensajeSinAlertas";

                            mensaje.textContent =
                                "No hay alertas guardadas.";

                            listaAlertas.appendChild(
                                mensaje
                            );

                        }

                    }
                );

            }


            // Limpiar formulario
            formularioAlerta.reset();

        }
    );

}
```
