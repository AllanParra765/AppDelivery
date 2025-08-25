// Función para destruir todas las instancias de DataTables y eliminar las tablas del DOM
function destroyAllTables() {
    // Destruir todas las instancias de DataTables si están inicializadas
    $('table').each(function() {
        if ($.fn.dataTable.isDataTable(this)) {
            $(this).DataTable().clear().destroy();
        }
    });

    // Opcional: Eliminar todas las tablas del DOM
    $('table').remove(); // Elimina todas las tablas del DOM (puedes comentarlo si no deseas eliminar las tablas físicas)
}
