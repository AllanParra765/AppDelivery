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
        order[existingProductIndex].totalPrice = order[existingProductIndex].quantity * order[existingProductIndex].unitPrice;
    } else {
        // Si el producto no está en el pedido, lo agregamos
        order.push({ productName, quantity, unitPrice: productPrice, totalPrice });
    }

    // Actualizar el total
    updateTotal();
    updateOrderSummary();
    showSuccessMessage();

    // Cerrar el modal
    toggleModal('orderModal');
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
        div.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2", "p-2", "border", "border-light", "rounded");

        // Nombre del producto y cantidad
        const productInfo = document.createElement("div");
        productInfo.classList.add("text-truncate");
        productInfo.innerHTML = `<strong>${item.productName}</strong> 
                                 <span class="text-muted">x</span>
                                 <span id="productQuantity-${index}" class="quantity-display">${item.quantity}</span>`;

        // Botones de incremento y decremento
        const quantityControls = document.createElement("div");
        quantityControls.classList.add("btn-group");

        const decreaseButton = document.createElement("button");
        decreaseButton.classList.add("btn", "btn-sm", "btn-secondary");
        decreaseButton.innerHTML = "<i class='fas fa-minus'></i>";
        decreaseButton.title = "Disminuir cantidad";
        decreaseButton.onclick = function() {
            if (item.quantity > 1) {
                item.quantity--;
                item.totalPrice = item.quantity * item.unitPrice; // Actualizar el precio total
                updateOrderSummary(); // Actualizar el resumen después de decrementar
            }
        };

        const increaseButton = document.createElement("button");
        increaseButton.classList.add("btn", "btn-sm", "btn-secondary");
        increaseButton.innerHTML = "<i class='fas fa-plus'></i>";
        increaseButton.title = "Aumentar cantidad";
        increaseButton.onclick = function() {
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice; // Actualizar el precio total
            updateOrderSummary(); // Actualizar el resumen después de incrementar
        };

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(increaseButton);

        // Total por producto
        const productTotal = document.createElement("span");
        productTotal.classList.add("text-success");
        productTotal.textContent = `$${item.totalPrice.toFixed(2)}`;

        // Botón de eliminar (ícono de papelera)
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.title = "Eliminar producto";
        deleteButton.addEventListener("click", function() {
            Swal.fire({
                title: `¿Estás seguro de eliminar ${item.productName} del pedido?`,
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Eliminar el producto del array 'order'
                    order.splice(index, 1);
                    updateOrderSummary(); // Actualizar el resumen después de eliminar
                    Swal.fire(
                        'Eliminado!',
                        `${item.productName} ha sido eliminado del pedido.`,
                        'success'
                    );
                }
            });
        });

        div.appendChild(productInfo);
        div.appendChild(quantityControls);
        div.appendChild(productTotal);
        div.appendChild(deleteButton);

        orderSummary.appendChild(div);

        // Recalcular el total del pedido
        total += item.totalPrice;  // Sumar el precio total de este artículo al total general
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

    // Actualizar el total
    updateOrderSummary();
    showSuccessMessage();
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
    modal.hide();
}
