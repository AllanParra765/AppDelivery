let productosData= []; // Array para almacenar los datos de los platillos

//categorias agregar o Modificar n Modal
async function llenarInformacionCategoria() {
    try {
        // Obtener los clientes desde la API
        const clientes = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarCategoria", {}));

        // Acceder al select
        const select = $('#productCategory');

        // Destruir Select2 si ya está activo
        if (select.hasClass('select2-hidden-accessible')) {
            select.select2('destroy');
        }

        // Limpiar opciones anteriores
        select.empty();

        // Opción inicial vacía
        select.append('<option value="">Selecciona una opción</option>');

        // Agregar opciones con base en la propiedad categoria
        clientes.forEach(cliente => {
            if (cliente.categoria) {
                select.append(new Option(cliente.categoria, cliente.categoria));
            }
        });

        // Inicializar Select2 dentro del modal
        select.select2({
            dropdownParent: $('#productModal')
        });

    } catch (error) {
        console.error('Error al cargar los clientes:', error);
    }
}
//llenar tabla de platillos 
async function platillosPeticion() {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPlatillos", {}));
        console.log('Respuesta de la API: platillosPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de platillosPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
//Eliminar platillos 
async function platillosEliminar(eliminarPlatillo) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "eliminarPlatillo", {"id_platillo":eliminarPlatillo}));
        console.log('Respuesta de la API: eliminarPlatillo', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de eliminarPlatillo:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
//Desactivar-Activar platillos 
async function platillosEstado(idPlatillo, estadoPlatillo) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "estadoPlatillo", {"id_platillo":idPlatillo, "estado":estadoPlatillo}));
        console.log('Respuesta de la API: estadoPlatillo', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de estadoPlatillo:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
// Función para manejar la carga de la imagen y mostrar la vista previa
function handleImageUpload(event) {
    const file = event.target.files[0];  // Obtiene el archivo seleccionado
    if (file) {
        const reader = new FileReader();

        // Leer el archivo y mostrar la imagen en el contenedor de vista previa
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.getElementById('imagePreview').style.backgroundImage = `url(${imageUrl})`;
            document.getElementById('productImage').value = imageUrl;  // Asigna la URL de la imagen al campo de texto
        };

        // Leer la imagen como URL de datos (base64)
        reader.readAsDataURL(file);
    }
}
// Función para manejar la carga de la imagen y mostrar la vista previa
// /Platillo-20250717150801459Z.png
function cargarImagen(imageUrl) {
    // Asumiendo que 'imageUrl' es el nombre del archivo o una ruta relativa
   //const imagePath = `../../API/imagenes/${'Platillo-20250717150801459Z.png'}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa
   const imagePath = `../../API/imagenes/${imageUrl}`;  // Asegúrate de que 'imageUrl' sea el nombre del archivo o la ruta relativa

    // Establecer la URL de la imagen de fondo para la vista previa
    document.getElementById('imagePreview').style.backgroundImage = `url(${imagePath})`;

    // Asignar la ruta de la imagen al campo oculto de texto
    document.getElementById('productImage').value = imagePath;  // Guardamos solo la ruta relativa
}
// Función para restablecer la imagen 
function resetImage() {
    document.getElementById('personaImage').value = '';  // Restablecer el campo de imagen
    document.getElementById('imagePreview').style.backgroundImage = '';  // Eliminar la vista previa
    document.getElementById('productImage').value = '';  // Eliminar la URL de la imagen
    document.getElementById('resetImageButton').style.display = 'none';  // Eliminar la imagen subida
    document.getElementById('productStatusActualizar').style.display = 'block';  // Eliminar la imagen subida

}
//Movemos la imagen y traemos la ruta de la imagen para guardar el registro del platillo
async function saveProduct() {
    const productName = document.getElementById('productName').value;
    const productImageInput = document.getElementById('personaImage'); // Usamos 'personaImage' para acceder al archivo
    const productImage = productImageInput.files[0]; // Obtener el archivo real desde el input de tipo file

    // Verificar que el nombre esté cargado
    if (!productName) {
       // alert('Por favor, escribe el platillo.');
        mostrarAlerta('Por favor, escribe el platillo.', 'warning');
        return;
    }

    // Si estamos modificando, no mostrar el mensaje de cargar imagen
    if (!productImage && !$('#productModal').data('productId')) {
      //  alert('Por favor, selecciona una imagen para el platillo.');
        mostrarAlerta('Por favor, selecciona una imagen para el platillo.', 'warning');
        return;
    }

    // Si estamos agregando, tenemos que cargar la imagen
    let imageUrl = '';

    // Si es una nueva imagen, la subimos
    if (productImage) {
        const formData = new FormData();
        formData.append('personaImage', productImage); // Aquí 'personaImage' debe coincidir con el nombre del campo en el servidor
        formData.append('productName', productName);

        try {
            const response = await axios.post('/imagenes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Importante: Indicar que se está enviando un archivo
                }
            });

            // Obtener la URL de la imagen subida
            imageUrl = response.data.imageUrl;

            // Mostrar la imagen subida como vista previa (si es necesario)
            const uploadedImage = document.getElementById('uploadedImage');
            if (uploadedImage) {
                uploadedImage.src = imageUrl;  // Usar la URL de la imagen que responde el servidor
            }

            // Mostrar la URL de la imagen en el campo de texto 'productImage'
            document.getElementById('productImage').value = imageUrl; // Asignar solo la URL de la imagen al campo de texto
        } catch (error) {
            console.error('Error al guardar la imagen:', error);
        }
    } else {
        // Si estamos modificando, podemos obtener la imagen del platillo existente
        imageUrl = $('#productImage').val(); // Obtener la URL de la imagen existente (si no se seleccionó una nueva)
    }

    // Crear el objeto del platillo con los datos
    const product = {
        id_platillo: $('#productModal').data('productId') || null, // Si no hay ID, será null (para nuevo platillo)
        nombre: $('#productName').val(),
        descripcion: $('#productDescription').val(),
        precio: parseFloat($('#productPrice').val()),
        imagen: imageUrl,
        categoria: $('#productCategory').val(),
        estado: $('#productStatus').val(),
        ingredientes: $('#productIngredients').val()
    };

    // Si estamos modificando
    if (product.id_platillo) { 
        const index = productosData.findIndex(item => parseInt(item.id_platillo) === parseInt(product.id_platillo));
        if (index !== -1) {
            productosData[index] = product;  // Actualiza el platillo en el array
//            alert('Platillo modificado con éxito');
            mostrarAlerta('Platillo modificado con éxito', 'success');
        }
    } else { // Si no existe un ID, estamos agregando un nuevo platillo
        product.id_platillo = Date.now();  // Asigna un ID único para el nuevo platillo (puedes cambiarlo a lo que necesites)
        productosData.push(product);  // Agrega el platillo a la lista
//        alert('Platillo agregado con éxito');
        mostrarAlerta('Platillo agregado con éxito', 'success');
    }

    // Redibujar la tabla con los datos actualizados
    table.clear().rows.add(productosData).draw();

    // Cerrar el modal
    $('#productModal').modal('hide');
}
// Agregar nuevo platillo
$('#addproductosButton').on('click', function() {
    $('#productModalLabel').text('Agregar Platillo');
    $('#productForm')[0].reset(); // Reseteamos el formulario
    $('#productModal').modal('show');
});
// Agregar los event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Asignar los eventos a los elementos
    document.getElementById('personaImage').addEventListener('change', handleImageUpload);
    document.getElementById('resetImageButton').addEventListener('click', resetImage);
    document.getElementById('saveProductButton').addEventListener('click', saveProduct);
});


async function initializePlatillosTable() {
     productosData = await platillosPeticion();  // Espera la respuesta de la API antes de inicializar la tabla
    llenarInformacionCategoria();
    
    let table;
    if ($.fn.dataTable.isDataTable('#productosTable')) {
        table = $('#productosTable').DataTable();
    } else {
        table = $('#productosTable').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Idioma en español
            },
            responsive: true, // Hacer la tabla responsive
            data: productosData,  // Asigna los datos de los productos
            columns: [
                {
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-warning btn-sm" onclick="modifyProduct('${row.id_platillo}')"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-${row.estado === 'activo' ? 'danger' : 'success'} btn-sm" onclick="toggleProductStatus('${row.id_platillo}')">
                                <i class="fas ${row.estado === 'activo' ? 'fa-pause' : 'fa-play'}"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${row.id_platillo}')"><i class="fas fa-trash-alt"></i></button>
                        `;
                    }
                },
                {
                    data: 'id_platillo',
                    render: function(data) {
                        return data ? data : 30; // Si no existe 'id_platillo', mostrar 'Sin ID'
                    }
                },
                { data: 'nombre' },
                { data: 'descripcion' },
                { data: 'precio' },
                { data: 'imagen', render: function(data) { return `<img src="${data}" alt="Imagen" style="width:50px;height:50px;">`; } },
                { data: 'categoria',
                    render: function(data) {
                        return data ? data : 'Sin categoria'; // Si no existe 'id_platillo', mostrar 'Sin ID'
                    } },
                
                { 
                    data: 'estado',
                    render: function(data) {
                        return data === 'activo'
                            ? '<i class="fas fa-check-circle" style="color: green;"></i> Activo'
                            : '<i class="fas fa-times-circle" style="color: red;"></i> Inactivo';
                    }
                },
                { data: 'ingredientes' }
            ],
            dom: 'Bfrtip',
            order: [[1, 'desc']], // Ordena por 'id_categoria' en orden descendente (columna índice 1)
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel me-2"></i> Descargar XLS',
                    className: 'btn btn-success btn-lg rounded-pill shadow-sm',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                }
            ]
        });
    }

// Función para modificar platillo
window.modifyProduct = function(name) {
//    console.log('Modificar platillo:', typeof(name));
    const product = productosData.find(item => item.id_platillo === parseInt(name));
    console.log('productosData encontrado:', productosData);
  //  console.log('Producto encontrado:', product);
    if (product) {
        document.getElementById('resetImageButton').style.display = 'block';  // Eliminar la imagen subida
        document.getElementById('productStatusActualizar').style.display = 'none';  // Eliminar la imagen subida
        $('#productModalLabel').text('Modificar Platillo');
        $('#productName').val(product.nombre);
        $('#productDescription').val(product.descripcion);
        $('#productPrice').val(product.precio);
        $('#productImage').val(product.imagen);  // Seteamos la URL de la imagen en el campo

        // Mostrar la vista previa de la imagen (usando la URL almacenada en el producto)
        cargarImagen(product.imagen);

        // Establecer la categoría y el estado del platillo
        $('#productCategory').val(product.categoria_id);
        $('#productIngredients').val(product.ingredientes);
        $('#productStatus').val(product.estado);

        // Guardamos el ID del platillo que se está modificando para referenciarlo en el guardado
        $('#productModal').data('productId', product.id_platillo);  // Guardamos el ID para usarlo más tarde

        $('#productModal').modal('show');
    }
};


    // Función para alternar el estado de un platillo
    window.toggleProductStatus = function(name) {
        console.log('Cambiar estado del platillo:', name);
        const productData = productosData.find(item => item.id_platillo ===  parseInt(name));
        if (productData) {
            productData.estado = productData.estado === 'activo' ? 'inactivo' : 'activo';
            console.log(`Estado del platillo ${name} cambiado a ${productData.estado}`);
            platillosEstado(parseInt(name), `${productData.estado}`);
            table.clear().rows.add(productosData).draw(); // Redibujamos la tabla con el nuevo estado
        }
    };

    // Función para eliminar platillo
    window.deleteProduct = function(name) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar el platillo ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const index = productosData.findIndex(item => item.id_platillo === parseInt(name));
                console.log('Eliminar platillo:', name, 'encontrado en el índice:', index);
                platillosEliminar(parseInt(name));
                if (index !== -1) {
                    productosData.splice(index, 1);
                    table.clear().rows.add(productosData).draw(); // Redibujamos la tabla sin el platillo eliminado
                    Swal.fire('Eliminado', `El platillo ${name} ha sido eliminado`, 'success');
                }
            }
        });
    };

// Guardar nuevo platillo o modificar existente
$('#saveProductButton').on('click', function() {
    const product = {
        id_platillo: $('#productModal').data('productId') || null, // Si no hay ID, será null (para nuevo platillo)
        nombre: $('#productName').val(),
        descripcion: $('#productDescription').val(),
        precio: parseFloat($('#productPrice').val()),
        imagen: $('#productImage').val(),
        categoria: $('#productCategory').val(),
        estado: $('#productStatus').val(),
        ingredientes: $('#productIngredients').val()
};
if (product.id_platillo) { // Si existe un ID, estamos modificando
    const index = productosData.findIndex(item => item.id_platillo === product.id_platillo);
    if (index !== -1) {
        productosData[index] = product;  // Actualiza el platillo en el array
        //alert('Platillo modificado con éxito1');
        mostrarAlerta('Platillo modificado con éxito1', 'success');
    }
} else { // Si no existe un ID, estamos agregando un nuevo platillo
    product.id_platillo = Date.now();  // Asigna un ID único para el nuevo platillo (puedes cambiarlo a lo que necesites)
    productosData.push(product);  // Agrega el platillo a la lista
   // alert('Platillo agregado con éxito2');
    mostrarAlerta('Platillo agregado con éxito2', 'success');
}

// Redibujar la tabla con los datos actualizados
table.clear().rows.add(productosData).draw();

// Cerrar el modal
$('#productModal').modal('hide');
});


// Agregar nuevo platillo
$('#addproductosButton').on('click', function() {
    $('#productModalLabel').text('Agregar Platillo');
    $('#productForm')[0].reset(); // Reseteamos el formulario
    $('#productModal').modal('show');

    // Ocultar campos de categoría y estado cuando estamos agregando
    $('#categoriaActual').hide();  // Ocultar la categoría
});

}
