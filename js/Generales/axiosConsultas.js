//Ejemplo de llenarJSONConsultar 
//const resultado = await hacerPeticion(llenarJSONConsultar("Almacen_Movil", "BuscarParId", { id: 12345 }));
function llenarJSONConsultar(procedureName, straccion, params = {}) {
    return {
        procedureName: procedureName, // Nombre del procedimiento almacenado
        straccion: straccion, // Acción a ejecutar
        params: params // Objeto con parámetros dinámicos
    };
}
//llenar campos de formularios lo que llega de una petición
/*
rellenarCampos({
    estiloInput: valores.id_estilo,
    colorInput: valores.color,
    marcaInput: valores.marca,
    tallaInput: valores.talla
}); */
function rellenarCampos(mapeoValores) {
    Object.entries(mapeoValores).forEach(([campo, valor]) => {
        const input = document.getElementById(campo);
        if (input) {
            input.value = valor || '';  // Si es undefined o null, lo deja vacío
        } else {
            console.warn(`El campo con '${campo}' no existe.`);
        }
    });
}
//Habilitar botones
//habilitarDesabilitarBotones(['AgregarPedidoNuevo', 'GuardarPedidoNuevo'], false);
// Deshabilitar botones
//habilitarDesabilitarBotones(['AgregarPedidoNuevo', 'GuardarPedidoNuevo'], true);


function habilitarDesabilitarBotones(elementos, estado) {
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.disabled = estado;
        } else {
            console.warn(`El elemento con id '${id}' no existe.`);
        }
    });
}
