const emailHospital =
    document.getElementById("emailHospital");

const botonVincularHospital =
    document.getElementById(
        "botonVincularHospital"
    );

const mensajeHospital =
    document.getElementById(
        "mensajeHospital"
    );

const listaHospitales =
    document.getElementById(
        "listaHospitales"
    );


let hospitales =
    JSON.parse(
        localStorage.getItem(
            "hospitalesVinculadosMedico"
        )
    ) || [];


function mostrarHospitales() {

    listaHospitales.innerHTML = "";


    if (hospitales.length === 0) {

        const mensaje =
            document.createElement("p");

        mensaje.textContent =
            "Todavía no estás vinculado a ningún hospital.";

        listaHospitales.appendChild(mensaje);

        return;

    }


    hospitales.forEach(
        function(hospital) {

            const tarjeta =
                document.createElement("article");

            tarjeta.classList.add(
                "tarjeta-hospital"
            );


            const nombre =
                document.createElement("h2");

            nombre.textContent =
                hospital.nombre || "Hospital";


            const email =
                document.createElement("p");

            email.textContent =
                hospital.email;


            const estado =
                document.createElement("span");

            estado.classList.add(
                "estado-vinculado"
            );

            estado.textContent =
                "Vinculado";


            tarjeta.appendChild(nombre);

            tarjeta.appendChild(email);

            tarjeta.appendChild(estado);


            listaHospitales.appendChild(
                tarjeta
            );

        }
    );

}


botonVincularHospital.addEventListener(
    "click",
    function() {

        const email =
            emailHospital.value.trim();


        if (email === "") {

            mensajeHospital.textContent =
                "Ingresá el correo del hospital.";

            return;

        }


        const existe =
            hospitales.some(
                function(hospital) {

                    return hospital.email === email;

                }
            );


        if (existe) {

            mensajeHospital.textContent =
                "Este hospital ya está vinculado.";

            return;

        }


        hospitales.push({

            id: Date.now(),

            email: email,

            nombre: "Hospital"

        });


        localStorage.setItem(
            "hospitalesVinculadosMedico",
            JSON.stringify(hospitales)
        );


        mensajeHospital.textContent =
            "Hospital vinculado correctamente.";

        emailHospital.value = "";


        mostrarHospitales();

    }
);


mostrarHospitales();