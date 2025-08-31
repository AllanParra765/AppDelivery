let promocionModificado = 0; // Indicamos que se está modificando
//////////////
// METODOS PARA PROMOCIONES

//Eliminar promociones                 PromocionesEliminar(index);
async function PromocionesEliminar(eliminarPromocion) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "eliminarPromocion", 
            {"id_promocion":eliminarPromocion}));
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
//Cargar promociones
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

// Función para insertar una nueva promoción
async function PromocionesGuardar(nuevaPromocion) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "insertarPromocion", nuevaPromocion));
        console.log('Respuesta de la API: insertarPromocion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de insertarPromocion:', error);
        return []; // Retorna un arreglo vacío en caso de error 
    }
}

// Función para modificar una promoción existente
async function PromocionesModificar(modificarPromocion) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "actualizarPromocion", modificarPromocion));
        console.log('Respuesta de la API: modificarPromocion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de modificarPromocion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}


////////////// 
// FIN METODOS PARA PROMOCIONES

////////////////////////
// MANEJO DE IMAGENES PARA PROMOCIONES

// Función para cargar la imagen al editar una promoción
function cargarImagenPromo(imageUrl) {
    // Asumiendo que 'imageUrl' es el nombre del archivo o una ruta relativa
   //const imagePath = `../../API/imagenes/${'Platillo-20250717150801459Z.png'}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa
   //const imagePath = `../../API/imagenes/${imageUrl}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa
   const imagePath = `${imageUrl}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa
    // Establecer la URL de la imagen de fondo para la vista previa
    document.getElementById('imagePreviewpromo').style.backgroundImage = `url(${imagePath})`;

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
           // document.getElementById('promoImg').value = imageUrl;  // Asignar la URL de la imagen al campo de texto
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
////////////////////
// FIN MANEJO DE IMAGENES PARA PROMOCIONES

// Inicializar la tabla de promociones al cargar la página
// Agregar los event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Asignar los eventos a los elementos
    document.getElementById('promocionImage').addEventListener('change', handleImageUploadPromo);
    document.getElementById('resetImageButtonPromo').addEventListener('click', resetImagePromo);
});
// Llamar a la función de guardado al hacer submit en el formulario
document.getElementById('promocionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    savePromotion();
});
async function initializePromocionesTable() {
    promocionModificado = 0; // Reiniciamos la variable al inicializar la tabla
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
    function formatearFecha(fecha) {
        const fechaObj = new Date(fecha);
        const anio = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia = String(fechaObj.getDate()).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
        return `${anio}-${mes}-${dia}`;
    }
    
    // Función para mostrar el modal de agregar/modificar promoción
    window.modifyPromocion = function(name) {
        promocionModificado = name; // Indicamos que se está modificando
        document.getElementById('resetImageButton').style.display = 'block';  // Eliminar la imagen subida
        console.log('Modificar promoción:', name);
        const productData = promocionesData.find(item => item.id_promocion === parseInt(name));
        console.log('Datos de la promoción:', productData);
        if (productData) {
            $('#promocionName').val(productData.nombre);
            $('#promocionDescription').val(productData.descripcion);
            $('#promocionPrice').val(productData.precio);
            // Asignar las fechas formateadas a los campos de fecha
            $('#promocionFechaInicio').val(formatearFecha(productData.fecha_inicio));
            $('#promocionFechaFin').val(formatearFecha(productData.fecha_fin));
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
                PromocionesEliminar(name);
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
/////////////////////////
// Función para leer la imagen como Base64
async function leerImagenComoBase64(inputFile) {
    
    return new Promise((resolve, reject) => {
        const file = inputFile.files[0]; // Obtener el archivo seleccionado
        const reader = new FileReader(); // Creamos una instancia de FileReader

        reader.onloadend = function () {
            const base64Image = reader.result; // Esto es una cadena con el prefijo 'data:image/png;base64,...'
        //    console.log("Imagen en Base64:", base64Image); // Mostramos la imagen en Base64
            resolve(base64Image);  // Retornamos la imagen en Base64
        };

        reader.onerror = function () {
            reject('Error al leer la imagen');  // Rechazamos si hay error al leer la imagen
        };

        reader.readAsDataURL(file); // Leemos el archivo como URL en Base64
    });
}
// Función para procesar la imagen y obtener la URL
async function procesarImagenPromo(productImage) {
    let imageUrl = '';  // Inicializamos la variable para la URL de la imagen

    // Si es una nueva imagen, la subimos
    if (productImage && productImage.startsWith('data:image')) {
        // Convertimos la imagen base64 a un Blob
        const mime = productImage.split(';')[0].split(':')[1];  // Obtiene el tipo MIME (image/png, image/jpeg, etc.)
        const imageBlob = base64ToBlobPromo(productImage, mime);

        // Ahora que tenemos el Blob, lo podemos agregar al FormData
        const formData = new FormData();
        formData.append('personaImage', imageBlob, 'image.png'); // El tercer parámetro es el nombre del archivo

        try {
            // Realizamos la petición para subir la imagen
            const response = await axios.post('/imagenes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Indicar que se está enviando un archivo
                }
            });

            // Obtener la URL de la imagen subida desde la respuesta
            imageUrl = response.data.imageUrl; // Asumiendo que el servidor devuelve una URL

            // Mostrar la imagen subida como vista previa (si es necesario)
            const uploadedImage = document.getElementById('uploadedImage');
            if (uploadedImage) {
                uploadedImage.src = imageUrl;  // Asignamos la URL de la imagen a la vista previa
            }

            // Mostrar la URL de la imagen en el campo de texto 'productImage'
            document.getElementById('productImage').value = imageUrl; // Asignamos la URL al campo correspondiente

        } catch (error) {
            console.error('Error al guardar la imagen:', error);
        }
    } else {
        // Si no hay imagen o estamos modificando, usamos la imagen existente
        imageUrl = document.getElementById('productImage').value;
    }

    return imageUrl;  // Retornar la URL de la imagen
}
// Función para convertir base64 a Blob
function base64ToBlobPromo(base64, mime) {
    const byteString = atob(base64.split(',')[1]); // Eliminar el prefijo "data:image/png;base64,"
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: mime });
}

/// Función para guardar o modificar la promoción
async function savePromotion() {
    const promocionName = document.getElementById('promocionName').value;
    const promocionPrice = parseFloat(document.getElementById('promocionPrice').value);
    const promocionDescription = document.getElementById('promocionDescription').value;
    const promocionFechaInicio = document.getElementById('promocionFechaInicio').value; // Fecha de inicio
    const promocionFechaFin = document.getElementById('promocionFechaFin').value; // Fecha de fin
    const promocionImage = document.getElementById('promocionImage').files[0]; // Obtener la imagen del campo de tipo file
    const promocionValidity = document.getElementById('promocionValidity').value;

    // Validar que el nombre esté cargado
    if (!promocionName) {
        mostrarAlerta('Por favor, escribe el nombre de la promoción.', 'warning');
        return;
    }

    // Verificar que la imagen sea seleccionada, solo si no es una modificación
    if (!promocionImage && !$('#productModal').data('productId')) {
        mostrarAlerta('Por favor, selecciona una imagen para la promoción.', 'warning');
        return;
    }

    // Procesar la imagen si existe
    let imageUrl = '';
    if (promocionImage) {
        try {
            imageUrl = await leerImagenComoBase64(document.getElementById('promocionImage'));  // Obtener la URL de la imagen en Base64
           imageUrl = await procesarImagenPromo(imageUrl);
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
            mostrarAlerta('Error al procesar la imagen.', 'error');
            return;
        }
    } else {
        imageUrl = document.getElementById('promoImg').value;  // Usar la imagen existente
    }

    // Crear el objeto con los datos obtenidos del formulario
    const promotionData = {
        nombre: promocionName,
        precio: promocionPrice,
        descripcion: promocionDescription,
        fecha_inicio: promocionFechaInicio,
        fecha_fin: promocionFechaFin,
        imagen: imageUrl,  // La URL de la imagen (en Base64 o la URL si ya existe)
        validez: promocionValidity
    };

    // Si estamos modificando
    promocionId = promocionModificado; // Usar la variable global para el ID de la promoción a modificar
    if (promocionId > 0) {
        promotionData.id_promocion = promocionId;
        console.log('Datos de la promoción a modificar:', promotionData);
        await PromocionesModificar(promotionData); // Llamar a la función para modificar
        mostrarAlerta('Promoción modificada con éxito', 'success');
        initializePromocionesTable(); // Recargar la tabla para reflejar los cambios
    } else {
        console.log('Datos de la nueva promoción a insertar:', promotionData);
        await PromocionesGuardar(promotionData); // Llamar a la función para insertar
        mostrarAlerta('Promoción agregada con éxito', 'success');
        initializePromocionesTable(); // Recargar la tabla para reflejar los cambios
    }

    // Aquí puedes llamar al servidor para guardar o modificar la promoción
    // Asegúrate de enviar `promotionData` al servidor

    // Por ejemplo:
    // await axios.post('/promociones', promotionData);  // Ejemplo de cómo guardar la promoción
}

