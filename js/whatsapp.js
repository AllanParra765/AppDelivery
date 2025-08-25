
function sendToWhatsApp() {
    const customerName = document.getElementById("customerNameInput").value.trim(); // Obtener el nombre ingresado

    // Verificar si el nombre está vacío
    if (!customerName) {
        // Si el campo está vacío, mostramos un mensaje de alerta
       // alert("");
        Swal.fire({
  title: "Algo falta",
  text: "¡Por favor ingresa el nombre del cliente antes de enviar la orden!",
  icon: "warning"
});
        return; // No continuar con el envío
    }

            // Verificamos si hay elementos en el pedido
            if (order.length === 0) {
           //alert("");
            Swal.fire({
  title: "Algo falta",
  text: "No hay elementos en el pedido.",
  icon: "error"
});
            return;
        }

    let orderMessage = `Pedido a nombre de: ${customerName}\n`;  // Incluir el nombre en el mensaje
    order.forEach(item => {
        orderMessage += `${item.productName} x${item.quantity} - $${item.totalPrice.toFixed(2)}\n`;
    });
    orderMessage += `\nTotal: $${total.toFixed(2)}`;
   
    // Enviar el mensaje a WhatsApp
    const phoneNumber = "+524793913172"; // Número en formato internacional
    insertarPedido(orderMessage, customerName, total.toFixed(2), phoneNumber); // Llamar a la función con el mensaje de pedido, nombre del cliente y total
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappLink, "_blank");
}

async function insertarPedido(mensaje, nombreCliente, total, telefono) {
    try {
        // Preparar los datos para el envío a la API
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "insertarPedido", {
            "nombreCliente": nombreCliente, 
            "telefono": telefono,
            "pedido": mensaje, 
            "total": total 
        }));
        
        console.log('Respuesta de la API: insertarPedido', response);
        
        // Aquí puedes manejar lo que necesites con la respuesta
        // Por ejemplo, mostrar un mensaje o actualizar el estado de la UI
        return response; // Devuelve la respuesta de la API

    } catch (error) {
        console.error('Error al cargar los datos de insertarPedido:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}
