
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
                <img src="${item.imagen}" class="d-block w-100" alt="${item.nombre}" style="object-fit: cover; height: 500px;">
                <div class="carousel-caption bg-dark bg-opacity-75 p-3 rounded">
                    <h5>${item.nombre}</h5>
                    <p>${item.descripcion}</p>
                    <p class="h4 text-warning">Precio: $${item.precio}</p>
                    <p class="text-light">Validez: ${item.validez}</p>
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


