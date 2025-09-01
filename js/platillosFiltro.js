  // Esperamos que PlatillosPeticion se resuelva para obtener los datos
  let platillos = [];
// Función para incrementar la cantidad
function increaseQuantity() {
  const quantityInput = document.getElementById("quantityInput");
  let quantity = parseInt(quantityInput.value);
  quantityInput.value = quantity + 1;
}

// Función para decrementar la cantidad
function decreaseQuantity() {
  const quantityInput = document.getElementById("quantityInput");
  let quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
      quantityInput.value = quantity - 1;
  }
}

// Función para filtrar los platillos basados en la búsqueda
async function filterItems() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();

  // Filtramos los platillos basados en el valor de búsqueda
  const filteredItems = platillos.filter(item => item.nombre.toLowerCase().includes(searchValue));

  // Mostramos los platillos filtrados
  displayItems(filteredItems);
}

// Función para obtener los platillos desde la API
async function PlatillosPeticion() {
  try {
      const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPlatillos", {}));
      console.log('Respuesta de la API: PlatillosPeticion', response);
        // Esperamos que PlatillosPeticion se resuelva para obtener los datos
  platillos = response; // Devuelve los datos obtenidos de la API
  filterItems(); // Llamamos a filterItems para mostrar los platillos filtrados
  } catch (error) {
      console.error('Error al cargar los datos de PlatillosPeticion:', error);
      return []; // Retorna un arreglo vacío en caso de error
  }
}

// Lista de platillos disponibles
//const platillos = [
//    { name: "Ensalada Fresca", price: 12.99 },
//    { name: "Sopa de Mariscos", price: 15.49 },
//    { name: "Filete Mignon", price: 32.99 },
//    { name: "Pasta al Pesto", price: 18.99 }
//  ];
  
  function displayItems(items) {
    const platilloList = document.getElementById("platilloList");
    platilloList.innerHTML = ''; // Limpiar la lista de platillos
  
    items.forEach(item => {
      // Crear cada item de platillo
      const li = document.createElement("li");
      li.classList.add("list-group-item", "p-4", "shadow-lg", "mb-3", "border-0", "rounded");
  
      // Crear el contenido HTML
      li.innerHTML = `
      <div class="d-flex flex-column p-3 border rounded shadow-sm bg-white">
        
        <!-- Primer renglón: Nombre y precio del platillo -->
        <div class="d-flex justify-content-between align-items-start mb-2">
          <span class="fw-bold text-truncate" style="color: #343a40; font-size: 1.2rem; line-height: 1.3;" title="${item.nombre}">${item.nombre}</span>
          <span class="text-success fw-bold" style="font-size: 1.1rem;">$${parseFloat(item.precio).toFixed(2)}</span>
        </div>
    
        <!-- Segundo renglón: Botones de acción -->
        <div class="d-flex justify-content-between gap-2 mt-2 flex-wrap">
          
          <!-- Botón para agregar al pedido -->
          <button class="btn btn-success flex-fill rounded-pill d-flex align-items-center justify-content-center py-2" 
                  onclick="openOrderModal('${item.nombre}', ${parseFloat(item.precio).toFixed(2)})">
            <i class="fas fa-cart-plus me-2"></i> Ordenar
          </button>
    
          <!-- Botón para ver ingredientes -->
          <button class="btn btn-info flex-fill rounded-pill d-flex align-items-center justify-content-center py-2"
                  onclick="showDetailsWithIngredients(this, true)" 
                  data-ingredients="${item.ingredientes}" 
                  data-image="${item.imagen}">
            <i class="fas fa-seedling me-2"></i> Ingredientes
          </button>
          
        </div>
      </div>
    `;
    
            
      platilloList.appendChild(li);
    });
  }
  

  function AbrirModalBusqueda(modalId, busqueda = true) {
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