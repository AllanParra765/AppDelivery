//Eliminar promociones 
async function PromocionesEliminar(eliminarPlatillo) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "eliminarPromocion", {"id_platillo":eliminarPlatillo}));
        console.log('Respuesta de la API: eliminarPromocion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de eliminarPromocion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
//Desactivar-Activar promociones 
async function PromocionesEstado(idPromocion, estadoPromocion) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "estadoPromocion", {"id_promocion":idPromocion, "estado":estadoPromocion}));
        console.log('Respuesta de la API: estadoPromocion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de estadoPromocion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

async function PromocionesPeticion() {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPromocion", {}));
        console.log('Respuesta de la API: PromocionesPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de PromocionesPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
// Función para cargar la imagen al editar una promoción
function cargarImagenPromo(imageUrl) {
    // Asumiendo que 'imageUrl' es el nombre del archivo o una ruta relativa
   //const imagePath = `../../API/imagenes/${'Platillo-20250717150801459Z.png'}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa
   const imagePath = `../../API/imagenes/${imageUrl}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa

    // Establecer la URL de la imagen de fondo para la vista previa
   // document.getElementById('imagePreviewpromo').style.backgroundImage = `url(${imagePath})`;
    document.getElementById('imagePreviewpromo').style.backgroundImage = `url(${'https://images.pexels.com/photos/30709482/pexels-photo-30709482.jpeg'})`;

    // Asignar la ruta de la imagen al campo oculto de texto
    document.getElementById('promoImg').value = imagePath;  // Guardamos solo la ruta relativa
}

// Función para restablecer la imagen
function resetImagePromo() {
    document.getElementById('promocionImage').value = '';  // Restablecer el campo de imagen
    document.getElementById('imagePreviewpromo').style.backgroundImage = '';  // Eliminar la vista previa
    document.getElementById('promoImg').value = '';  // Eliminar la URL de la imagen
}

// Función para manejar la carga de la imagen y mostrar la vista previa
function handleImageUploadPromo(event) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // Establecer la URL de la imagen para la vista previa
            const imageUrl = e.target.result;
            document.getElementById('imagePreviewpromo').style.backgroundImage = `url(${imageUrl})`;
            document.getElementById('promoImg').value = imageUrl;  // Asignar la URL de la imagen al campo de texto
        };

        // Leer la imagen como URL de datos (base64)
        reader.readAsDataURL(file);
    }
}

// Función para restablecer la imagen y la vista previa
function resetImagePromo() {
    document.getElementById('promocionImage').value = '';  // Restablecer el campo de imagen
    document.getElementById('imagePreviewpromo').style.backgroundImage = '';  // Eliminar la vista previa
    document.getElementById('promoImg').value = '';  // Eliminar la URL de la imagen
    document.getElementById('resetImageButtonPromo').style.display = 'none';  // Eliminar la imagen subida
}

// Agregar los event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Asignar los eventos a los elementos
    document.getElementById('promocionImage').addEventListener('change', handleImageUploadPromo);
    document.getElementById('resetImageButtonPromo').addEventListener('click', resetImagePromo);
});

// Función para guardar la promoción
async function savePromotion() {
    console.log('Guardando imagen de la promoción...');
    const promocionName = document.getElementById('promocionName').value;
    const promocionImageInput = document.getElementById('promocionImage'); // Usamos 'promocionImage' para acceder al archivo
    const promocionImage = promocionImageInput.files[0]; // Obtener el archivo real desde el input de tipo file

    console.log('Nombre de la promoción:', promocionName);
    console.log('Imagen de la promoción:', promocionImage);
    // Verificar que el nombre de la promoción esté cargado
    if (!promocionName) {
       // alert('Por favor, escribe el nombre de la promoción.');
        mostrarAlerta('Por favor, escribe el nombre de la promoción.', 'warning');
        return;
    }

    let imageUrl = '';

    // Si se carga una nueva imagen, la subimos
    if (promocionImage) {
        const formData = new FormData();
        formData.append('promocionImage', promocionImage); // Aquí 'promocionImage' debe coincidir con el nombre del campo en el servidor
        formData.append('promocionName', promocionName);

        try {
            const response = await axios.post('/promociones', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Indicar que se está enviando un archivo
                }
            });

            // Obtener la URL de la imagen subida
            imageUrl = response.data.imageUrl;

            // Mostrar la imagen subida como vista previa
            document.getElementById('imagePreview').style.backgroundImage = `url(${imageUrl})`;
            document.getElementById('promoImg').value = imageUrl; // Asignar la URL de la imagen al campo de texto
        } catch (error) {
            console.error('Error al guardar la imagen:', error);
        }
    } else {
        // Si no se carga una nueva imagen, se conserva la URL de la imagen existente
        imageUrl = document.getElementById('promoImg').value;
    }

    // Crear el objeto de la promoción
    const promotion = {
        nombre: promocionName,
        descripcion: document.getElementById('promocionDescription').value,
        precio: parseFloat(document.getElementById('promocionPrice').value),
        imagen: imageUrl,
        validez: document.getElementById('promocionValidity').value,
        estado: 'activo'
    };

    // Aquí puedes agregar la lógica para guardar la promoción en tu base de datos, ya sea enviando una solicitud a tu servidor.
    // Por ejemplo:
    // await axios.post('/api/promociones', promotion);

    // Mostrar un mensaje de éxito
    Swal.fire('¡Éxito!', 'Promoción guardada correctamente', 'success');
    $('#promocionModal').modal('hide'); // Cerrar el modal
}

// Llamar a la función de guardado al hacer submit en el formulario
document.getElementById('promocionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    savePromotion();
});



async function initializePromocionesTable() {
    const promocionesData = await PromocionesPeticion(); // Espera la respuesta de la API antes de inicializar la tabla
    
    // Destruir la tabla si ya está inicializada
    if ($.fn.dataTable.isDataTable('#promocionesTable')) {
        $('#promocionesTable').DataTable().clear().destroy();
    }

    // Inicialización de la tabla DataTable
    const table = $('#promocionesTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Idioma en español
        },
        responsive: true, // Hacer la tabla responsive
        data: promocionesData, // Asigna los datos de las promociones
        columns: [
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm" onclick="modifyPromocion('${row.id_promocion}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-${row.estado === 'activo' ? 'danger' : 'success'} btn-sm" onclick="togglePromocionStatus('${row.id_promocion}')">
                            ${row.estado === 'activo' ? 'Pausar' : 'Habilitar'}
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deletePromocion('${row.id_promocion}')"><i class="fas fa-trash-alt"></i></button>
                    `;
                }
            },
            { data: 'id_promocion' },
            { data: 'nombre' },
            { data: 'descripcion' },
            { data: 'precio' },
            { data: 'imagen', render: function(data) { return `<img src="${data}" alt="Imagen" style="width:50px;height:50px;">`; } },
            { data: 'validez' },
        ],
        dom: 'Bfrtip',
        responsive: true,
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
        responsive: true, // Habilitar el diseño responsive
        order: [[1, 'desc']], // Ordena por 'id_categoria' en orden descendente (columna índice 1)
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Establecer idioma en español
        }
    });

    // Función para mostrar el modal de agregar/modificar promoción
    window.modifyPromocion = function(name) {
        document.getElementById('resetImageButton').style.display = 'block';  // Eliminar la imagen subida
        console.log('Modificar promoción:', name);
        const productData = promocionesData.find(item => item.id_promocion === parseInt(name));
        console.log('Datos de la promoción:', productData);
        if (productData) {
            $('#promocionName').val(productData.nombre);
            $('#promocionDescription').val(productData.descripcion);
            $('#promocionPrice').val(productData.precio);
            //$('#promocionImage').val(productData.imagen);
            // Mostrar la vista previa de la imagen (usando la URL almacenada en el producto)
           cargarImagenPromo(productData.imagen);
            $('#promocionValidity').val(productData.validez);
            $('#promocionModalLabel').text('Modificar Promoción');
            $('#promocionModal').modal('show');
        }
    };

    // Función para cambiar el estado de la promoción
    window.togglePromocionStatus = function(name) {
        console.log('Cambiar estado de promoción:', name);
        const productData = promocionesData.find(item => item.id_promocion === parseInt(name));
        console.log('Datos de la promoción para cambiar estado:', productData);
        if (productData) {
            productData.estado = productData.estado === 'activo' ? 'inactivo' : 'activo';
console.log('Nuevo estado de la promoción:', productData.estado);
            PromocionesEstado(productData.id_promocion, productData.estado);
            table.clear().rows.add(promocionesData).draw(); // Redibujamos la tabla con el nuevo estado
        }
    };

    // Función para eliminar la promoción
    window.deletePromocion = function(name) {
        Swal.fire({
            title: `¿Estás seguro que quieres eliminar la promoción ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                const index = promocionesData.findIndex(item => item.id_promocion === parseInt(name));
                console.log('Índice de la promoción a eliminar:', index);
                PromocionesEliminar(index);
                if (index !== -1) {
                    promocionesData.splice(index, 1);
                    table.clear().rows.add(promocionesData).draw(); // Redibujamos la tabla sin la promoción eliminada
                    Swal.fire('Eliminado!', 'La promoción ha sido eliminada.', 'success');
                }
            }
        });
    };

    // Agregar nueva promoción
    $('#addPromocionesButton').on('click', function() {
        $('#promocionForm')[0].reset();  // Limpiar el formulario
        $('#promocionModalLabel').text('Agregar Promoción');
        $('#promocionModal').modal('show');
    });

    // Manejar el formulario de agregar/modificar promoción
    $('#promocionForm').on('submit', function(e) {
        e.preventDefault();
        const id_promocion = 30; // Asignar un ID temporal para la nueva promoción
        const name = $('#promocionName').val();
        const description = $('#promocionDescription').val();
        const price = $('#promocionPrice').val();
        const image = $('#promoImg').val();
        const validity = $('#promocionValidity').val();

        const newProduct = {id_promocion: id_promocion,  nombre: name, descripcion: description, precio: price, imagen: image, validez: validity, estado: 'activo' };

        // Si es una modificación, actualizamos la promoción
        if ($('#promocionModalLabel').text() === 'Modificar Promoción') {
            const index = promocionesData.findIndex(item => item.id_promocion === parseInt(id_promocion));
            if (index !== -1) {
                promocionesData[index] = newProduct;
            }
        } else {
            // Si es una nueva promoción, agregamos
            promocionesData.push(newProduct);
        }

        table.clear().rows.add(promocionesData).draw(); // Redibujamos la tabla con la nueva promoción
        $('#promocionModal').modal('hide');
    });
}

