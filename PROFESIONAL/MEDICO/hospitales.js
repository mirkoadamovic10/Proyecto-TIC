// ==========================================
// ELEMENTOS
// ==========================================

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


// ==========================================
// CARGAR HOSPITALES
// ==========================================

let hospitales =
    JSON.parse(
        localStorage.getItem(
            "hospitalesVinculados"
        )
    ) || [];


// ==========================================
// MOSTRAR HOSPITALES
// ==========================================

function mostrarHospitales() {

    hospitalesVinculados.innerHTML = "";


    if (hospitales.length === 0) {

        hospitalesVinculados.innerHTML = `
            <p>
                No hay hospitales vinculados todavía.
            </p>
        `;

        return;

    }


    hospitales.forEach(
        function (hospital) {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "tarjeta-empresa";


            tarjeta.innerHTML = `

                <h3>
                    Hospital vinculado
                </h3>

                <p>
                    Código: ${hospital.codigo}
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


        if (codigo === "") {

            alert(
                "Ingresá el código del hospital."
            );

            return;

        }


        hospitales.push({

            codigo: codigo

        });


        localStorage.setItem(
            "hospitalesVinculados",
            JSON.stringify(hospitales)
        );


        codigoHospital.value = "";


        mostrarHospitales();


        alert(
            "Hospital vinculado correctamente."
        );

    }
);


// ==========================================
// INICIAR
// ==========================================

mostrarHospitales();