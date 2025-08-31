// Limpiar campos de un formulario
function clearFields(campo) {
   
    console.log("limpiar ", campo);
      document.getElementById(campo).value = '';
  if(campo== "inputField"){
     // document.getElementById('FormularioAlmacen').reset();
      limpiarCampos(); // Asegúrate de que esta función también esté definida
  }
  }
  //para almacen movil
/*rellenarCampos({
    estiloInput: valores.id_estilo,
    colorInput: valores.color,
    marcaInput: valores.marca,
    tallaInput: valores.talla
});
 */
  function rellenarValoresCampos(valores) {
    for (const campo in valores) {
        const input = document.getElementById(campo);
        if (input) {
            input.value = valores[campo] || '';
        } else {
            console.warn(`El campo con id '${campo}' no existe.`);
        }
    }
}

  function limpiarCampos() 
  {
   document.getElementById("FormularioAlmacen").reset();
   params={};
   qrCount = 0;
   movCount = 0;
   searchValue= "";
   document.getElementById('movCounter').innerText = movCount;
   document.getElementById('qrCounter').innerText = qrCount;
  }

  // Función para llenar el combobox
function llenarCombobox(resultados) {
    const selectElement = document.getElementById('pedidoSelect');
    // Limpiar el combobox y agregar la opción predeterminada
    selectElement.innerHTML = '<option value="" selected>Selecciona uno</option>';
    resultados.forEach(item => {
        // Crear una nueva opción
        const option = document.createElement('option');
        option.value = item.id_detallePedido;  // El valor del option (puede variar según tu estructura de datos)
        option.text = `${item.id_pedido} - ${item.cliente}`; // Texto que aparecerá en el select
        selectElement.appendChild(option); // Añadir la opción al select
    });
    // Seleccionar la primera opción válida (si existe)
    if (resultados.length > 0) {
        selectElement.selectedIndex = 1;  // Seleccionar la primera opción después de "Selecciona uno"
    }
   }

// Función para crear el HTML de la tarjeta
function crearCard(valores, precio) {
    const itemId = `par-${valores.id_par}`;
    const cardBackgroundColor = valores.estatus === 3 ? '#f0f9ff' : '#fff5e6';
  
    return `
    <div class="col-12 mb-3" id="${itemId}" style="font-size: 12px;">
        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center" style="background-color: ${cardBackgroundColor};">
            <div class="card-body p-2 d-flex justify-content-between align-items-center w-100">
                <div class="text-start">
                    <h6 class="card-title mb-1"><b>Par ID:</b> ${valores.id_par}</h6>
                    <p class="card-text mb-0">
                        <b>Estilo:</b> ${valores.id_estilo} &nbsp;
                        <b>Color:</b> ${valores.color} &nbsp;
                        <b>Talla:</b> ${valores.talla} &nbsp;
                        <b>Precio:</b> <span class="text-success">$${precio}</span>
                    </p>
                </div>
                <button class="btn btn-danger btn-sm ms-2 d-flex align-items-center" onclick="eliminarItem(${valores.estatus}, '${itemId}')">
                    <i class="bi bi-trash3 me-1"></i>
                </button>
            </div>
        </div>
    </div>`;
  }
  
  function abrirModalDetalles(modalOcultarId, modalMostrarId) {
    const modalOcultar = new bootstrap.Modal(document.getElementById(modalOcultarId));
    const modalMostrar = new bootstrap.Modal(document.getElementById(modalMostrarId));

    // Ocultar modal actual sin cerrarlo completamente
    document.getElementById(modalOcultarId).classList.add('d-none');

    // Mostrar el nuevo modal
    modalMostrar.show();

    // Cuando el modal de detalles se cierre, volver a mostrar el original
    document.getElementById(modalMostrarId).addEventListener('hidden.bs.modal', function () {
        document.getElementById(modalOcultarId).classList.remove('d-none'); // Restaurar visibilidad
        modalOcultar.show(); // Reabrir el modal original
    }, { once: true }); // Evitar que el evento se dispare múltiples veces
}


// Función para limpiar backdrop cuando se cierran todos los modales
function limpiarBackdrop() {
setTimeout(() => {
    if (!document.querySelector('.modal.show')) { // Si no hay ningún modal abierto
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open'); // Eliminar clase modal-open de Bootstrap
    }
}, 300);
}

// Eventos globales para cerrar backdrop al cerrar cualquier modal
document.querySelectorAll('.modal').forEach(modal => {
modal.addEventListener('hidden.bs.modal', limpiarBackdrop);
});

// Función para cerrar el modal automáticamente con jQuery
// se usa para cerrar el modal cerrarModal(modalACerrar);
function cerrarModal(modalACerrar) {
    $('#' + modalACerrar).modal('hide');  // Usando jQuery para cerrar el modal
}
/*
    function formatearFecha(fecha) {
        const fechaObj = new Date(fecha);
        const anio = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia = String(fechaObj.getDate()).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
        return `${anio}-${mes}-${dia}`;
    }
    */