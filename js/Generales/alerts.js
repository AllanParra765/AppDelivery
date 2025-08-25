//console.log("Script cargado alerta");

 // Función para mostrar alerta según el tipo y timer de campos
 function mostrarAlerta(mensaje,tipo) {
    switch (tipo) {
        case 'success':
            Swal.fire({
                title: "Realizar movimiento",
                text: mensaje || "Movimiento realizado",
                icon: "success"
            });
            break;
        case 'error':
            Swal.fire({
                title: "Realizar movimiento",
                text: mensaje || "Movimiento no realizado",
                icon: "error"
            });
            break;
        case 'info':
            Swal.fire({
                title: "Información",
                text:  mensaje || "Este es un mensaje informativo.",
                icon: "info"
            });
            break;
        case 'warning':
            Swal.fire({
                title: "Advertencia",
                text:  mensaje || "Este es un mensaje de advertencia.",
                icon: "warning"
            });
            break;
        case 'question':
            Swal.fire({
                title: "Pregunta",
                text:  mensaje || "¿Quieres continuar?",
                icon: "question"
            });
            break;
        default:
            Swal.fire({
                title: "Error",
                text:  mensaje || "Tipo de alerta desconocido.",
                icon: "warning"
            });
            break;
    }
}

function mostrarAlertaOption(mensaje){
    Swal.fire({
        title: mensaje,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Imprimir",
        denyButtonText: `Salir`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
}

  
  // Función para obtener y mostrar la fecha actual
  function mostrarFechaActual() {
      // Crear un nuevo objeto de fecha
      var hoy = new Date();
      
      // Formatear la fecha en formato DD/MM/YYYY
      var dia = String(hoy.getDate()).padStart(2, '0');
      var mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
      var anio = hoy.getFullYear();

      var fechaFormateada = dia + '/' + mes + '/' + anio;
return fechaFormateada
      // Asignar la fecha formateada al input con id="currentDate"
    //  document.getElementById('currentDate').value = fechaFormateada;
  }

  // Llamar a la función cuando la página cargue
  window.onload = mostrarFechaActual;


// Función genérica para mostrar una alerta estilizada (con botones "Continuar" y "Entendido")  de CAJAS
function mostrarAlertaOpciones(mensaje, tipo = "info", titulo = "Información", onContinue, onEntendido) {
    Swal.fire({
        title: titulo,
        html: mensaje, // Soporta HTML para formato más rico
        icon: tipo,    // Tipo de icono: "success", "warning", "error", "info"
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Salir",
        customClass: {
            confirmButton: 'btn-continue',  // Clase personalizada para el botón "Continuar"
            cancelButton: 'btn-cancel'      // Clase personalizada para el botón "Salir"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Acción para el botón "Continuar"
            //if (onContinue) onContinue();
            TerminarPares();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Acción para el botón "Entendido"
            if (onEntendido) onEntendido();
        }
    });
}

// Función para pedir el número de caja y asignarlo a la variable de CAJAS
async function solicitarNumeroCaja() {
    const { value: boxNumber } = await Swal.fire({
        title: 'Ingrese el número de caja',
        input: 'text', // Tipo de entrada: texto, número, etc.
        inputPlaceholder: 'Ejemplo: 8',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingrese un número de caja válido.';
            }
        }
    });

    if (boxNumber) {
        console.log(`Número de caja ingresado: ${boxNumber}`);
        return boxNumber;
    } else {
        console.log('El usuario canceló la entrada.');
        return null;
    }
}