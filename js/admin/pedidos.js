async function PedidosPeticion() {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPedidos", {}));
        console.log('Respuesta de la API: PedidosPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de PedidosPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

async function ModificarPedidosPeticion(id_pedido, estado) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "actualizarEstatusPedido", 
            { id_pedido: id_pedido, estado: estado}));
        console.log('Respuesta de la API: ModificarPedidosPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de ModificarPedidosPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

async function CancelarPedidosPeticion(id_pedido) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "eliminarPedido", 
            { id_pedido: id_pedido}));
        console.log('Respuesta de la API: CancelarPedidosPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de CancelarPedidosPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

async function initializePedidosTable() {
    const pedidosData = await PedidosPeticion(); // Asegúrate de esperar la respuesta de la API

    // Destruir la tabla si ya está inicializada
    if ($.fn.dataTable.isDataTable('#pedidosTable')) {
        $('#pedidosTable').DataTable().clear().destroy();
    }

    // Inicializar la tabla DataTable
    const table = $('#pedidosTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Idioma en español
        },
        responsive: true, // Hacer la tabla responsive
        data: pedidosData, // Asigna los datos de los pedidos obtenidos de la API
        columns: [
            {
                data: null,
                render: function(data, type, row) {
                    return `
                      <button class="btn btn-${row.estado === 'proceso' ? 'danger' : 'success'} btn-sm" onclick="togglePedidoStatus(${row.id_pedido})">
                            ${row.estado === 'proceso' ? 'Pedido' : 'Listo'}
                        </button>
                      <!--  <button class="btn btn-warning btn-sm" onclick="modifyPedido(${row.id_pedido})"><i class="fas fa-edit"></i></button>
                     --> 
                      <button class="btn btn-warning btn-sm" onclick="deletePedido(${row.id_pedido}, '${row.nombre}')"><i class="fas fa-trash-alt text-white"></i></button>
                    `;
                }
            },
            { data: 'id_pedido' },
            { data: 'nombre' },
            { data: 'telefono' },
            { data: 'pedido' },
            { data: 'fecha' },
            { 
                data: 'estado', 
                render: function(data) {
                    return data === 'proceso' ? 'Pendiente' : (data === 'listo' ? 'Completado' : 'Cancelado');
                }
            },
            { data: 'total' }
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel me-2"></i> Descargar XLS',
                className: 'btn btn-success btn-lg rounded-pill shadow-sm',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6]
                }
            }
        ],
        responsive: true,
        order: [[1, 'desc']], // Ordena por 'id_categoria' en orden descendente (columna índice 1)
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Establecer idioma en español
        }
    });

    // Funciones para las acciones de los botones
   /* window.modifyPedido = function(id) {
        const pedido = pedidosData.find(item => item.id_pedido === id);
        if (pedido) {
            $('#productModalLabel').text('Modificar Pedido');
            $('#pedidoName').val(pedido.nombre);
            $('#pedidoPhone').val(pedido.telefono);
            $('#pedidoItems').val(pedido.pedido);
            $('#pedidoDate').val(pedido.fecha);
            $('#pedidoStatus').val(pedido.estado);
            $('#pedidoTotal').val(pedido.total);
            $('#pedidoModal').modal('show');
        }
    };*/

    window.togglePedidoStatus = function(id) {
        const pedidoData = pedidosData.find(item => item.id_pedido === id);
        if (pedidoData) {
            pedidoData.estado = pedidoData.estado === 'proceso' ? 'listo' : 'proceso';
            table.clear().rows.add(pedidosData).draw(); // Redibujamos la tabla con el nuevo estado
            ModificarPedidosPeticion(id, pedidoData.estado);
        }
    };

    window.deletePedido = function(id, nombre) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres cancelar el pedido con ID ${id} de ${nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const index = pedidosData.findIndex(item => item.id_pedido === id);
                if (index !== -1) {
                    pedidosData.splice(index, 1);
                    table.clear().rows.add(pedidosData).draw(); // Redibujamos la tabla sin el pedido eliminado
                    Swal.fire('Cancelado', `El pedido con ID ${id} de ${nombre} ha sido cancelado`, 'success');
                }
                CancelarPedidosPeticion(id);
            }
        });
    };

    // Guardar nuevo pedido o modificar existente
    $('#savePedidoButton').on('click', function() {
        const pedido = {
            id_pedido: $('#pedidoId').val(),
            nombre: $('#pedidoName').val(),
            telefono: $('#pedidoPhone').val(),
            pedido: $('#pedidoItems').val(),
            fecha: $('#pedidoDate').val(),
            estado: $('#pedidoStatus').val(),
            total: parseFloat($('#pedidoTotal').val())
        };

        if ($('#pedidoModalLabel').text() === 'Modificar Pedido') {
            const index = pedidosData.findIndex(item => item.id_pedido === pedido.id_pedido);
            pedidosData[index] = pedido;
        } else {
            pedidosData.push(pedido);
        }

        table.clear().rows.add(pedidosData).draw(); // Redibujamos la tabla con el nuevo pedido
        $('#pedidoModal').modal('hide');
    });

    // Agregar nuevo pedido
    $('#addPedidoButton').on('click', function() {
        $('#pedidoModalLabel').text('Agregar Pedido');
        $('#pedidoForm')[0].reset(); // Reseteamos el formulario
        $('#pedidoModal').modal('show');
    });
}
