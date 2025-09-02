let retries = 0;
async function PromocionesPeticionSlider() {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPromocion", {}));
        console.log('Respuesta de la API:', response);
        await renderCarrusel(response);
    } catch (error) {
        console.error('Error al cargar promociones:', error);
        if (retries < 3) { // Intentar máximo 3 veces
            retries++;
            setTimeout(PromocionesPeticionSlider, 1000);
        }
    }
}


// Función para renderizar el carrusel dinámicamente con los datos de prueba
async function renderCarrusel(carruselData) {

    try {
        const carouselInner = document.getElementById("carouselItems");
    
        if (carruselData && carruselData.length > 0) {
            carruselData.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("carousel-item");
    
                if (index === 0) {
                    itemElement.classList.add("active");  // El primer item será el activo
                }
    
                itemElement.innerHTML = `
                <img src="${item.imagen}" class="d-block w-100" alt="${item.nombre}" style="object-fit: cover; height: 90vh;">
              
                <!-- Overlay del carousel -->
                <div class="carousel-caption d-flex flex-column justify-content-between p-3 rounded" 
                     style="
                        position: absolute;
                        bottom: 5%;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 90%;
                        max-width: 600px;
                        background: rgba(0, 0, 0, 0.6);
                        max-height: 33%;
                        overflow-y: auto;
                        color: white;
                     ">
              
                  <!-- Nombre del platillo -->
                  <h5 class="fw-bold mb-1" style="font-size: 1.5rem;">${item.nombre}</h5>
              
                  <!-- Descripción -->
                  <p class="mb-1" style="font-size: 1rem;">${item.descripcion}</p>
              
                  <!-- Precio y validez -->
                  <div class="d-flex justify-content-between align-items-center w-100 mb-2 flex-wrap">
                    <span class="h5 text-warning fw-bold mb-1">Precio: $${item.precio}</span>
                    <span class="mb-1">Validez: ${item.validez}</span>
                  </div>
              
                  <!-- Botón Ordenar -->
                  <button class="btn rounded-pill d-flex align-items-center justify-content-center py-2 px-4 mt-2"
                          style="background: linear-gradient(90deg, #28a745, #218838); color: white; font-weight: bold; transition: background 0.3s; width: 100%;"
                          onmouseover="this.style.background='linear-gradient(90deg, #218838, #28a745)';"
                          onmouseout="this.style.background='linear-gradient(90deg, #28a745, #218838)';"
                          onclick="openOrderModal('${item.nombre}', ${parseFloat(item.precio).toFixed(2)})">
                    <i class="fas fa-cart-plus me-2"></i> Ordenar
                  </button>
              
                </div>
              `;
              
                
                carouselInner.appendChild(itemElement);  // Agregar el item al carrusel
            });
        } else {
            console.log("No hay datos para cargar en el carrusel.");
        }
    } catch (error) {
        console.error('Error al renderizar el carrusel:', error);
        PromocionesPeticionSlider();
    }
}
  // Llamar a la función para renderizar el carrusel con los datos de prueba
  PromocionesPeticionSlider();
//setTimeout(() => {
//  // Llamar a la función para renderizar el carrusel con los datos de prueba
PromocionesPeticionSlider();
//}, 1500);



