//const promocionesData =[];
//async function PromocionesPeticion() {
//    try {
//        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarPromocion", {}));
//        console.log('Respuesta de la API: PromocionesPeticion', response);
//promocionesData = response; // Asignamos los datos obtenidos a la variable global promocionesData
//        //        return response; // Devuelve los datos obtenidos de la API
//    } catch (error) {
//        console.error('Error al cargar los datos de PromocionesPeticion:', error);
//        return []; // Retorna un arreglo vacío en caso de error
//    }
//}
/*
// Datos de prueba para las promociones y todas las cards
const promocionesData = [
    {
        nombre: "Combo Especial2",
        descripcion: "Obtén un 25% de descuento en tu combo favorito.",
        precio: "19.99",
        imagen: "https://images.pexels.com/photos/27827767/pexels-photo-27827767.jpeg",
        ingredientes: "Arroz, Pollo, Salsa Especial",
    },
    {
        nombre: "Combo Pizza2",
        descripcion: "Obtén una pizza gratis con la compra de una ensalada.",
        precio: "22.99",
        imagen: "https://images.pexels.com/photos/11444806/pexels-photo-11444806.jpeg",
        ingredientes: "Pizza, Ensalada, Refresco",
    }
];

// Función para renderizar las promociones dinámicamente
function renderPromociones(promocionesData) {
    const promotionsList = document.getElementById("promotionsList");

    // Verifica que haya promociones
    if (promocionesData && promocionesData.length > 0) {
        promocionesData.forEach((promo) => {
            const promoElement = document.createElement("div");
            promoElement.classList.add("menu-item");

            // Crear el HTML de la promoción
            promoElement.innerHTML = `
                <img src="${promo.imagen}" alt="${promo.nombre}" >
                <div class="menu-item-body">
                    <h3 class="menu-item-name">${promo.nombre}</h3>
                    <p class="menu-item-description">${promo.descripcion}</p>
                    <p class="menu-item-price">$${promo.precio}</p>
                    <button class="menu-item-button w-100 rounded-pill mb-2" onclick="openOrderModal('${promo.nombre}', ${promo.precio})">
                        <i class="fas fa-utensils"></i> Pedir
                    </button>
                    <!-- Botón para ver detalles -->
                    <button class="btn btn-info w-100 rounded-pill mb-2" onclick="showDetailsWithIngredients(this)" data-ingredients="${promo.ingredientes}" data-image="${promo.imagen}">
                        <i class="fas fa-apple-alt"></i> Ingredientes
                    </button>
                </div>
            `;
            // Inyectar la promoción en el contenedor
            promotionsList.appendChild(promoElement);
        });
    } else {
        console.log("No hay promociones disponibles.");
    }
}

// Llamar a la función para renderizar las promociones con los datos de prueba
renderPromociones(promocionesData);

*/

//------------------------------------------