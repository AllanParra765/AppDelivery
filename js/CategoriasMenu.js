// Función para obtener las categorías desde la API
/*async function categoriaPeticion() {
    try {
        // Simulando la petición de las categorías
        const response = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "buscarCategorias", {}));

        console.log('Respuesta de la API: categoriaPeticion', response);
        mostrarCategorias(response); // Pasamos los datos a la función que actualizará el menú
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
}
*/
/*
// Datos simulados para las categorías
const categoriasData = [
    { nombre: "Promociones", id: 1 },
    { nombre: "Entradas", id: 2 },
    { nombre: "Platillos Principales", id: 3 },
    { nombre: "Postres", id: 4 },
    { nombre: "Bebidas", id: 5 }
];
// Función para mostrar las categorías basadas en la respuesta de la API
function mostrarCategorias(categoriasData) {
    const categoryList = document.getElementById("categoryList");

    // Verifica si la categoría "Promociones" está en los datos
    const promocionesData = categoriasData.find(categoria => categoria.nombre === "Promociones");

    // Eliminar la categoría Promociones si ya existe
    let promocionesCategory = document.getElementById("promocionesCategory");
    if (!promocionesCategory) {
        promocionesCategory = document.createElement("li");
        promocionesCategory.classList.add("mb-4");
        promocionesCategory.id = "promocionesCategory"; // Le damos un ID para que podamos eliminarla fácilmente

        // Agregar "Promociones" al menú
        const promocionesButton = document.createElement("button");
        promocionesButton.classList.add("category-btn");
        promocionesButton.setAttribute("onclick", "mostrarCategoria('promociones')");
        promocionesButton.setAttribute("data-bs-dismiss", "offcanvas");

        // Crear el HTML de "Promociones"
        promocionesButton.innerHTML = `
            <i class="fas fa-fire fa-4x text-danger me-3"></i> <!-- Ícono de promociones en rojo y más grande -->
            <p class="category-text">Promociones</p>
        `;
        promocionesCategory.appendChild(promocionesButton);
        categoryList.appendChild(promocionesCategory);
    }

    // Mostrar u ocultar la categoría "Promociones"
    if (promocionesData) {
        promocionesCategory.style.display = "block"; // Si hay promociones, mostramos la categoría
    } else {
        promocionesCategory.style.display = "none"; // Si no hay promociones, la ocultamos
    }

    // Añadir las otras categorías al menú
    categoriasData.forEach(categoria => {
        if (categoria.nombre !== "Promociones") {  // Ya agregamos "Promociones", no la agregamos otra vez
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("mb-4");

            const categoryButton = document.createElement("button");
            categoryButton.classList.add("category-btn");
            categoryButton.setAttribute("onclick", `mostrarCategoria('${categoria.nombre.toLowerCase()}')`);
            categoryButton.setAttribute("data-bs-dismiss", "offcanvas");

            // Generar el ícono y el texto de cada categoría
            categoryButton.innerHTML = `
                <i class="fas fa-star fa-3x"></i> <!-- Ícono genérico de categoría -->
                <p class="category-text">${categoria.nombre}</p>
            `;
            categoryItem.appendChild(categoryButton);
            categoryList.appendChild(categoryItem);
        }
    });
}

// Llamar a la función para cargar las categorías cuando el DOM se haya cargado
//categoriaPeticion();

mostrarCategorias(categoriasData);*/