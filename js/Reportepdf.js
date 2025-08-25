function downloadPDF() {
    const customerName = document.getElementById("customerNameInput").value.trim(); // Obtener el nombre ingresado

// Verificar si el nombre está vacío
if (!customerName) {
// Si el campo está vacío, mostramos un mensaje de alerta
// alert("");
Swal.fire({
title: "Algo falta",
text: "¡Por favor ingresa el nombre antes de generar la orden!",
icon: "warning"
});
return; // No continuar con el envío
}
    // Verificamos si hay elementos en el pedido
    if (order.length === 0) {
       // alert("No hay elementos en el pedido.");
       Swal.fire({
title: "Algo falta",
text: "No hay elementos en el pedido.",
icon: "error"
});
        return;
    }

    // Creamos el documento PDF
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Agregar logo (opcional, solo si tienes un logo)
    // doc.addImage('logo-url', 'PNG', 10, 10, 30, 30);

    // Título del documento
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen del Pedido", 10, 20);

    // Línea divisoria para separar el título
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22);

    // Espacio después de la línea divisoria
    let lineHeight = 30;

    // Agregar los productos al PDF
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    order.forEach((item, index) => {
        // Nombre del producto, cantidad y precio
        doc.text(`${item.productName} x${item.quantity} - $${item.totalPrice.toFixed(2)}`, 10, lineHeight);
        lineHeight += 10; // Aumenta el espacio para el siguiente producto
    });

    // Agregar el total al final
    lineHeight += 5;  // Deja un pequeño espacio antes del total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${total.toFixed(2)}`, 10, lineHeight);

    // Agregar la fecha de creación del PDF (opcional)
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Fecha de emisión: ${date}`, 10, lineHeight + 10);

    // Guardar el archivo PDF con nombre 'pedido.pdf'
    doc.save("pedido.pdf");
}
