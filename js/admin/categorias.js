async function CargarCategoriasPeticion() {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarCategoria", {}));
        console.log('Respuesta de la API: CategoriasPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de CategoriasPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
//('Lunes, Miércoles, Viernes', 'Entradas', 'activo'),
async function InsertarCategoriasPeticion(categoria,estado) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "insertarCategoria", 
            { "dias_semana": 'Lunes, Miércoles, Viernes', categoria: categoria, estado: "activo" }));
        console.log('Respuesta de la API: InsertarCategoriasPeticion', response);
        initializeCategoriesTable();
        //return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de InsertarCategoriasPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

async function ModificarCategoriasPeticion(id_categoria, categoria, estado) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "actualizarCategoria", 
            { id_categoria: id_categoria, categoria: categoria, estado: estado}));
        console.log('Respuesta de la API: ModificarCategoriasPeticion', response);
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de ModificarCategoriasPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

async function EliminarCategoriasPeticion(id_categoria) {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "eliminarCategoria", { id_categoria: id_categoria }));
        console.log('Respuesta de la API: CategoriasPeticion', response);
        initializeCategoriesTable(); // Re-inicializa la tabla después de eliminar la categoría
        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de CategoriasPeticion:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}



async function initializeCategoriesTable() {
    const categoriesData = await CargarCategoriasPeticion();  // Espera la respuesta de la API antes de inicializar la tabla

    // Destruir la tabla si ya está inicializada
    if ($.fn.dataTable.isDataTable('#categoriesTable')) {
        $('#categoriesTable').DataTable().clear().destroy();
    }

// Inicialización de la tabla DataTable
const table = $('#categoriesTable').DataTable({
    language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Idioma en español
    },
    responsive: true, // Hacer la tabla responsive
    data: categoriesData,  // Asigna los datos de las categorías
    columns: [
        {
            data: null,
            render: function(data, type, row) {
                return `
                    <button class="btn btn-warning btn-sm" onclick="modifyCategory('${row.categoria}',${row.id_categoria}, '${row.estado}' )">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-${row.estado === 'activo' ? 'danger' : 'success'} btn-sm" onclick="toggleCategoryStatus('${row.categoria}',${row.id_categoria})">
                        <i class="fas ${row.estado === 'activo' ? 'fa-pause' : 'fa-play'}"></i> ${row.estado === 'activo' ? 'Pausar' : 'Reactivar'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory('${row.id_categoria}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            }
        },
        { data: 'id_categoria' },  // Asegúrate de que esta columna esté aquí para que la ordenación funcione
        { data: 'categoria' },
        { 
            data: 'estado',
            render: function(data) {
                return data === 'activo' ? 
                    '<i class="fas fa-check-circle" style="color: green;"></i> Activo' : 
                    '<i class="fas fa-times-circle" style="color: red;"></i> Inactivo';
            }
        }
    ],
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel me-2"></i> Descargar XLS', // Agregamos el ícono de Excel
            className: 'btn btn-success btn-lg rounded-pill shadow-sm', // Clases para diseño personalizado
            exportOptions: {
                columns: [0, 1, 2, 3] // Especificamos las columnas a exportar
            }
        }
    ],
    responsive: true, // Habilitar el diseño responsive
    order: [[1, 'desc']], // Ordena por 'id_categoria' en orden descendente (columna índice 1)
    language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Establecer idioma en español
    }
});


    // Función para modificar categoría
    window.modifyCategory = function(category, id_categoria, estado) {
        Swal.fire({
            title: `Modificar categoría: ${category}`,
            input: 'text',
            inputValue: category,
            showCancelButton: true,
            confirmButtonText: 'Modificar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'El nombre de la categoría no puede estar vacío';
                }
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newCategory = result.value;
                // Actualiza la categoría en el arreglo `categoriesData`
                categoriesData.forEach(item => {
                    if (item.id_categoria === id_categoria) {
                       // alert(`Modificando categoría: ${item.categoria} a ${newCategory}  ${item.estado} ${item.id_categoria}`);
                        ModificarCategoriasPeticion(id_categoria, newCategory, estado); // Llamada a la función para modificar la categoría
                        item.categoria = newCategory;
                    }
                });
                table.clear().rows.add(categoriesData).draw();  // Redibujamos la tabla
                Swal.fire({
                    icon: 'success',
                    title: 'Categoría modificada',
                    text: `La categoría ha sido modificada a: ${newCategory}`
                });
            }
        });
    };

    // Función para alternar el estado de una categoría
    window.toggleCategoryStatus = function(category, id_category) {
        const categoryData = categoriesData.find(item => item.categoria === category);
        if (categoryData) {
            categoryData.estado = categoryData.estado === 'activo' ? 'inactivo' : 'activo';
            // Actualizamos el estado de la categoría en el arreglo `categoriesData`
            console.log(`Cambiando estado de la categoría: ${category} a ${categoryData.estado}`);
            ModificarCategoriasPeticion(id_category, category, categoryData.estado); // Llamada a la función para modificar la categoría
            table.clear().rows.add(categoriesData).draw();  // Redibujamos la tabla con el nuevo estado
            Swal.fire({
                icon: 'success',
                title: `Estado de la categoría actualizado`,
                text: `La categoría está ahora ${categoryData.estado === 'activo' ? 'activo' : 'inactivo'}`
            });
        }
    };

// Función para eliminar categoría
window.deleteCategory = function(category) {
    // Mostrar un cuadro de confirmación de SweetAlert
    Swal.fire({
        title: `¿Estás seguro que quieres eliminar la categoría ${category}?`,
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
            try {
                // Aquí, llamamos a la API o al backend para eliminar la categoría
                await EliminarCategoriasPeticion(category);

                console.log(`Categoría ${category} eliminada en el backend`);

                // Buscar la categoría en el arreglo categoriesData y eliminarla
                const index = categoriesData.findIndex(item => item.categoria === category);
                if (index !== -1) {
                    categoriesData.splice(index, 1);  // Eliminar de la lista local
                    console.log(`Categoría ${category} eliminada del arreglo`);
                }

                // Redibujar la tabla para reflejar los cambios
                table.clear().rows.add(categoriesData).draw();

                // Mostrar un mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Categoría eliminada',
                    text: `${category} ha sido eliminada con éxito.`
                });
            } catch (error) {
                // En caso de error al eliminar la categoría en el backend
                console.error('Error al eliminar la categoría:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar la categoría',
                    text: 'Hubo un problema al eliminar la categoría. Intenta nuevamente.'
                });
            }
        }
    });
};





    // Función para agregar nueva categoría
    $('#addCategoryButton').on('click', function() {
        Swal.fire({
            title: 'Introduce el nombre de la nueva categoría',
            input: 'text',
            inputPlaceholder: 'Nombre de la categoría',
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value || value.trim() === '') {
                    return 'El nombre de la categoría no puede estar vacío';
                }
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newCategory = result.value;
                categoriesData.push({ id_categoria: 0 ,categoria: newCategory, estado: 'active' });
                console.log(`Agregando nueva categoría: ${newCategory}`);
                InsertarCategoriasPeticion(newCategory, 'active'); // Llamada a la función para insertar la nueva categoría
                table.clear().rows.add(categoriesData).draw();  // Redibujamos la tabla con la nueva categoría
                Swal.fire({
                    icon: 'success',
                    title: 'Categoría agregada',
                    text: `La categoría ${newCategory} ha sido agregada.`
                });
            }
        });
    });
}
