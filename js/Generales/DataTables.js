// 🔹 Manejo mejorado de DataTables para múltiples tablas
$(document).ready(function () {
    function initializeDataTable(tableId) {
        const tableElement = $(tableId);
        if (tableElement.length && !$.fn.DataTable.isDataTable(tableElement)) {
            tableElement.DataTable({
                "pageLength": -1, // Muestra 100 registros por página
                "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "Todos"]], // Opciones del menú
                responsive: true, // Habilita la capacidad responsive
                scrollX: true, // Activa el desplazamiento horizontal si es necesario
                autoWidth: false, // Evita que DataTables fuerce anchos incorrectos
                language: {
                    url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json" // Traducción al español
                }
            });
        }
    }

    // Lista de tablas a inicializar
    const tables = [
        '#facturacionTable', '#materiasTable', '#materialesTable', '#proveedoresTable',
        '#cajasTable', '#muestrasTable', '#fraccionesTable', '#metasTable', '#agentesTable', '#empleadosTable',
        '#remitentesTable', '#ordenTrabajoTable', '#inventarioTable', '#ventasTable','#PedidosTable', '#nominasTable','#pedidosTable', 
        '#resumenTable', '#produccionTable', '#muestrasTableNomina', '#PedidosHistoricosTable'
    ];

    // Inicializar las tablas que ya están en el DOM al cargar la página
    tables.forEach(tableId => initializeDataTable(tableId));

    // 🔹 Observar cambios en el DOM para inicializar nuevas tablas dinámicamente
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            tables.forEach(tableId => initializeDataTable(tableId));
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 🔹 Reajustar las tablas cuando la ventana cambie de tamaño
    $(window).resize(function () {
        $.fn.DataTable.tables({ visible: true, api: true }).columns.adjust();
    });
});
