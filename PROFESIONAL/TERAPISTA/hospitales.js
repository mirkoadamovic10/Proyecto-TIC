const codigoHospital =
    document.getElementById(
        "codigoHospital"
    );


const botonVincularHospital =
    document.getElementById(
        "botonVincularHospital"
    );


const hospitalesVinculados =
    document.getElementById(
        "hospitalesVinculados"
    );


let hospitales =
    JSON.parse(
        localStorage.getItem(
            "hospitalesTerapista"
        )
    ) || [];


// ==========================================
// MOSTRAR HOSPITALES
// ==========================================

function mostrarHospitales() {

    hospitalesVinculados.innerHTML =
        "";


    if (
        hospitales.length === 0
    ) {

        hospitalesVinculados.innerHTML =
            "<p>No hay hospitales vinculados todavía.</p>";

        return;

    }


    hospitales.forEach(
        function (hospital) {

            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "tarjeta-paciente";


            tarjeta.innerHTML = `

                <h3>
                    ${hospital.nombre}
                </h3>

                <p>
                    Código: ${hospital.codigo}
                </p>

                <p>
                    Hospital vinculado
                </p>

            `;


            hospitalesVinculados.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================
// VINCULAR HOSPITAL
// ==========================================

botonVincularHospital.addEventListener(
    "click",
    function () {

        const codigo =
            codigoHospital.value.trim();


        if (
            codigo === ""
        ) {

            alert(
                "Ingresá el código del hospital."
            );

            return;

        }


        const hospital = {

            id:
                Date.now(),

            nombre:
                "Hospital vinculado",

            codigo:
                codigo

        };


        hospitales.push(
            hospital
        );


        localStorage.setItem(
            "hospitalesTerapista",
            JSON.stringify(hospitales)
        );


        codigoHospital.value =
            "";


        mostrarHospitales();

    }
);


mostrarHospitales();