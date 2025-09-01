
//const promocionesData =[];
async function PromocionesPeticionSlider() {
    try {
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPromocion", {}));
        console.log('Respuesta de la API: PromocionesPeticionSlider', response);
      //  response; // Asignamos los datos obtenidos a la variable global promocionesData
        renderCarrusel(response);
        //        return response; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al cargar los datos de PromocionesPeticionSlider:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

    // Datos de prueba para el carrusel
const testData2 = [
    {
        "nombre": "Platillo Favorito de la Casa",
        "descripcion": "¡Disfruta del mejor platillo de la casa con un 20% de descuento!",
        "precio": "19.99",
        "imagen": "https://images.pexels.com/photos/8739021/pexels-photo-8739021.jpeg",
        "validez": "Hasta el 30 de junio"
    },
    {
        "nombre": "Promoción de Fin de Semana",
        "descripcion": "Aprovecha nuestra promoción especial del fin de semana.",
        "precio": "15.00",
        "imagen": "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        "validez": "Hasta el 5 de julio"
    },
    {
        "nombre": "Descuento en Postres",
        "descripcion": "Lleva un postre gratis al comprar cualquier platillo principal.",
        "precio": "0.00",
        "imagen": "https://images.pexels.com/photos/1510106/pexels-photo-1510106.jpeg",
        "validez": "Hasta el 15 de julio"
    }
];

// Función para renderizar el carrusel dinámicamente con los datos de prueba
function renderCarrusel(carruselData) {
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
    <div class="carousel-caption d-flex flex-column justify-content-end align-items-start bg-dark bg-opacity-50 p-3 rounded" 
         style="bottom: 0; left: 0; right: 0; max-height: 100%; overflow-y: auto;">

      <!-- Nombre del platillo -->
      <h5 class="fw-bold text-white mb-1" style="font-size: 1.5rem;">${item.nombre}</h5>

      <!-- Descripción -->
      <p class="text-light mb-1" style="font-size: 1rem;">${item.descripcion}</p>

      <!-- Precio y validez -->
      <div class="d-flex justify-content-between align-items-center w-100 mb-2 flex-wrap">
        <span class="h5 text-warning fw-bold mb-1">Precio: $${item.precio}</span>
        <span class="text-light mb-1">Validez: ${item.validez}</span>
      </div>

<button class="btn rounded-pill d-flex align-items-center justify-content-center py-2 px-4 mt-2"
        style="background: linear-gradient(90deg, #28a745, #218838); color: white; font-weight: bold; transition: background 0.3s;"
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
}

// Llamar a la función para renderizar el carrusel con los datos de prueba
PromocionesPeticionSlider();


