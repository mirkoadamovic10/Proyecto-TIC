const botonAgregarMedico =
    document.getElementById("botonAgregarMedico");

const ventanaMedico =
    document.getElementById("ventanaMedico");

const cerrarMedico =
    document.getElementById("cerrarMedico");

const guardarMedico =
    document.getElementById("guardarMedico");

const emailMedico =
    document.getElementById("emailMedico");

const mensajeMedico =
    document.getElementById("mensajeMedico");

const listaMedicos =
    document.getElementById("listaMedicos");


let medicos =
    JSON.parse(
        localStorage.getItem("medicosHospital")
    ) || [];


function mostrarMedicos() {

    listaMedicos.innerHTML = "";


    if (medicos.length === 0) {

        const mensaje =
            document.createElement("p");

        mensaje.textContent =
            "Todavía no hay médicos vinculados a este hospital.";

        listaMedicos.appendChild(mensaje);

        return;
    }


    medicos.forEach(function(medico) {

        const tarjeta =
            document.createElement("article");

        tarjeta.classList.add(
            "tarjeta-hospital"
        );


        const nombre =
            document.createElement("h2");

        nombre.textContent =
            medico.nombre || "Médico";


        const email =
            document.createElement("p");

        email.textContent =
            medico.email;


        const estado =
            document.createElement("span");

        estado.classList.add(
            "estado-vinculado"
        );

        estado.textContent =
            "Médico vinculado";


        tarjeta.appendChild(nombre);

        tarjeta.appendChild(email);

        tarjeta.appendChild(estado);


        listaMedicos.appendChild(tarjeta);

    });

}


botonAgregarMedico.addEventListener(
    "click",
    function() {

        emailMedico.value = "";

        mensajeMedico.textContent = "";

        ventanaMedico.classList.add("mostrar");

    }
);


cerrarMedico.addEventListener(
    "click",
    function() {

        ventanaMedico.classList.remove("mostrar");

    }
);


ventanaMedico.addEventListener(
    "click",
    function(evento) {

        if (evento.target === ventanaMedico) {

            ventanaMedico.classList.remove("mostrar");

        }

    }
);


guardarMedico.addEventListener(
    "click",
    function() {

        const email =
            emailMedico.value.trim();


        if (email === "") {

            mensajeMedico.textContent =
                "Ingresá el correo del médico.";

            return;

        }


        const existe =
            medicos.some(
                function(medico) {

                    return medico.email === email;

                }
            );


        if (existe) {

            mensajeMedico.textContent =
                "Este médico ya está vinculado.";

            return;

        }


        medicos.push({

            id: Date.now(),

            email: email,

            nombre: "Médico"

        });


        localStorage.setItem(
            "medicosHospital",
            JSON.stringify(medicos)
        );


        mensajeMedico.textContent =
            "Médico agregado correctamente.";

        emailMedico.value = "";

        mostrarMedicos();

    }
);


mostrarMedicos();