let order = []; // Array para almacenar el pedido
let total = 0;  // Total del pedido
let buscando = false; // Variable para controlar si estamos buscando un platillo

function openOrderModal(productName, productPrice, mostramosBusqueda = true) {
    // Establecer el contenido del modal
    document.getElementById("productName").textContent = `¿Cuántas unidades de ${productName} deseas?`;
    document.getElementById("orderModalLabel").textContent = `Pedido: ${productName}`;

    // Guardar el nombre y el precio del producto para agregar al pedido
    document.getElementById("quantityInput").dataset.productName = productName;
    document.getElementById("quantityInput").dataset.productPrice = productPrice;

    // Reiniciar el contador del input de cantidad
    document.getElementById("quantityInput").value = 1;

    // Lógica para manejar la apertura de modales según la búsqueda
    if (mostramosBusqueda) {
        toggleModal('orderModal'); // Abrir modal de pedido
        buscando = false; // No estamos buscando un platillo
        console.log("Abriendo el modal de pedido (con búsqueda activada)");
    } else {
        toggleModal('orderModal'); // Abrir modal de pedido
        buscando = true; // Estamos en el estado de búsqueda
        console.log("Abriendo el modal de pedido (sin búsqueda)");
    }
}
  
function toggleModal(modalId, busqueda = true) {
    console.log(`Toggling modal: ${modalId}`);
    const currentModal = document.querySelector('.modal.show'); // Encuentra el modal actualmente abierto
    if (currentModal) {
        // Si hay un modal abierto, lo cerramos
        const currentModalInstance = bootstrap.Modal.getInstance(currentModal);
        currentModalInstance.hide();
    }
    if (busqueda) {
        // Ahora, abrimos el nuevo modal
        const modal = document.getElementById(modalId);
        if (modal) {
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
    } else {
        console.log(`No se abrirá el modal de búsqueda: ${modalId}`);
    }
}

function showSuccessMessage() {
    // Mostrar el mensaje de éxito
    document.getElementById("successMessage").style.display = 'block';
    setTimeout(() => {
        document.getElementById("successMessage").style.display = 'none';
    }, 2000); // Ocultar el mensaje después de 2 segundos
}

function updateTotal() {
    // Recalcular el total
    total = order.reduce((acc, item) => acc + item.totalPrice, 0);
    document.getElementById("totalAmount").textContent = total.toFixed(2); // Actualizar total en el modal
}


function updateOrderSummary() {
    console.log("cantidad de producctos en el pedido:", order.length);
    updateOrderBadge(order.length);
    const orderSummary = document.getElementById("orderSummary");
    orderSummary.innerHTML = ''; // Limpiar el resumen

    total = 0;  // Resetear el total antes de recalcularlo

    // Verificar si el pedido está vacío
    if (order.length === 0) {
        orderSummary.innerHTML = '<p class="text-center text-muted">No has agregado productos al pedido.</p>';
        document.getElementById("totalAmount").textContent = "$0.00"; // Si no hay productos, el total es cero.
        return;
    }

    // Recorrer el array 'order' y mostrar cada producto en el resumen
    order.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "order-item";
    
        // Botón de eliminar
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-sm btn-danger delete-btn";
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.title = "Eliminar producto";
        deleteButton.addEventListener("click", () => {
            Swal.fire({
                title: `¿Eliminar ${item.productName}?`,
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    order.splice(index, 1);
                    updateOrderSummary();
                }
            });
        });
    
        // Nombre del producto (primer renglón)
        const productInfo = document.createElement("div");
        productInfo.className = "product-info";
        productInfo.textContent = item.productName;
    
        // Controles de cantidad + precio (segundo renglón)
        const productControls = document.createElement("div");
        productControls.className = "product-controls";
    
        // Controles de cantidad
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls btn-group";
    
        const decreaseButton = document.createElement("button");
        decreaseButton.className = "btn btn-sm btn-info";
        decreaseButton.innerHTML = "<i class='fas fa-minus text-white'></i>";
        decreaseButton.onclick = () => {
            if (item.quantity > 1) {
                item.quantity--;
                item.totalPrice = item.quantity * item.unitPrice;
                updateOrderSummary();
            }
        };
    
        const quantityDisplay = document.createElement("span");
        quantityDisplay.textContent = item.quantity;
    
        const increaseButton = document.createElement("button");
        increaseButton.className = "btn btn-sm btn-info";
        increaseButton.innerHTML = "<i class='fas fa-plus text-white'></i>";
        increaseButton.onclick = () => {
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
            updateOrderSummary();
        };
    
        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantityDisplay);
        quantityControls.appendChild(increaseButton);
    
        // Precio
        const productTotal = document.createElement("div");
        productTotal.className = "product-total";
        productTotal.textContent = `$${item.totalPrice.toFixed(2)}`;
    
        // Agregar controles y total al segundo renglón
        productControls.appendChild(quantityControls);
        productControls.appendChild(productTotal);
    
        // Agregar todo al div del producto
        div.appendChild(deleteButton);
        div.appendChild(productInfo);
        div.appendChild(productControls);
    
        orderSummary.appendChild(div);
    
        total += item.totalPrice;
    });
    

    // Mostrar el total general con formato
    const totalAmount = document.getElementById("totalAmount");
    totalAmount.textContent = `$${total.toFixed(2)}`; // Asegurarnos de mostrar el total formateado
    totalAmount.classList.add("h4", "font-weight-bold", "text-primary"); // Añadir clases de estilo

}

// Función para agregar productos al pedido
function addToOrder() {
    const productName = document.getElementById("quantityInput").dataset.productName;
    const productPrice = parseFloat(document.getElementById("quantityInput").dataset.productPrice);
    const quantity = parseInt(document.getElementById("quantityInput").value);
    const totalPrice = productPrice * quantity;

    // Verificar si el producto ya existe en el pedido
    const existingProductIndex = order.findIndex(item => item.productName === productName);
    if (existingProductIndex !== -1) {
        // Si el producto ya está en el pedido, solo actualizamos la cantidad
        order[existingProductIndex].quantity += quantity;
        order[existingProductIndex].totalPrice += totalPrice;
    } else {
        // Si el producto no está en el pedido, lo agregamos
        order.push({
            productName,
            quantity,
            unitPrice: productPrice,
            totalPrice
        });
    }
    console.log("cantidad de producctos en el pedido:", order.length);
    updateOrderBadge(order.length);
 

    // Actualizar el total
    updateOrderSummary();
    showSuccessMessage();
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
    modal.hide();
}

function updateOrderBadge(totalItems) {
    const badge = document.getElementById("orderBadge");
   //const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        badge.classList.remove("d-none");
        badge.textContent = totalItems;
    } else {
        badge.classList.add("d-none");
    }
}
