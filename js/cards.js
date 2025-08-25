// Datos simulados para las categorías
/*const categoriasData = [
    { 
        nombre: "Promociones", 
        productos: [
            { nombre: "Combo Especial2", descripcion: "Obtén un 25% de descuento en tu combo favorito.", precio: "19.99", imagen: "https://images.pexels.com/photos/27827767/pexels-photo-27827767.jpeg", ingredientes: "Arroz, Pollo, Salsa Especial" },
            { nombre: "Combo Pizza2", descripcion: "Obtén una pizza gratis con la compra de una ensalada.", precio: "22.99", imagen: "https://images.pexels.com/photos/11444806/pexels-photo-11444806.jpeg", ingredientes: "Pizza, Ensalada, Refresco" }
        ]
    },
    { 
        nombre: "Postres", 
        productos: [
            { nombre: "Tarta de Frambuesa", descripcion: "Tarta fresca de frambuesas con crema pastelera suave.", precio: "8.99", imagen: "https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg", ingredientes: "Frambuesas frescas, Harina, Azúcar, Mantequilla, Crema pastelera" },
            { nombre: "Helado de Chocolate", descripcion: "Helado cremoso de chocolate con sirope caliente.", precio: "6.99", imagen: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg", ingredientes: "Chocolate, Leche, Azúcar, Sirope de frutas" }
        ]
    },
    { 
        nombre: "Bebidas", 
        productos: [
            { nombre: "Café Latte", descripcion: "Café suave con leche espumosa.", precio: "3.99", imagen: "https://images.pexels.com/photos/20045266/pexels-photo-20045266.jpeg", ingredientes: "Café Latte" },
            { nombre: "Jugo Natural", descripcion: "Jugo fresco de naranja recién exprimido.", precio: "4.99", imagen: "https://images.pexels.com/photos/11100906/pexels-photo-11100906.jpeg", ingredientes: "Jugo Natural" }
        ]
    }
];*/



let categoriasData = [];

// Función para obtener las promociones y las demás categorías de la API
async function cargarCategoriaPeticion() {
    try {
        // Obtener todas las categorías y productos desde la API
        const productosResponse = await hacerPeticion(llenarJSONConsultar("CRUD_Restaurante", "cargarCategoriaVista", {}));
        console.log('Productos agrupados por categoría cargarCategoriaVista:', productosResponse);

        // Agrupar los productos por categoría
        productosResponse.forEach(producto => {
            // Verificar si la categoría ya existe
            let categoria = categoriasData.find(cat => cat.nombre === producto.categoria);

            // Si la categoría no existe, crearla
            if (!categoria) {
                categoria = { nombre: producto.categoria, productos: [] };
                categoriasData.push(categoria);
            }

            // Agregar el producto a la categoría correspondiente
            categoria.productos.push({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                imagen: producto.imagen,
                ingredientes: producto.ingredientes,
                validez: producto.validez
            });
        });

        // Llamar a la función para mostrar las categorías y productos cuando los datos estén disponibles
        mostrarCategorias(categoriasData);

    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Función para mostrar las categorías dinámicamente en el menú
function mostrarCategorias(categoriasData) {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = ""; // Limpiar la lista de categorías antes de agregar nuevas

    // Asegurarse de que la categoría "Promociones" esté al principio si existe
    const promocionesCategory = categoriasData.find(cat => cat.nombre === "Promociones");
    if (promocionesCategory) {
        // Mover "Promociones" al principio del array
        categoriasData = [promocionesCategory, ...categoriasData.filter(cat => cat.nombre !== "Promociones")];
    }

    // Iterar a través de las categorías
    categoriasData.forEach(categoria => {
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("mb-4");

        const categoryButton = document.createElement("button");
        categoryButton.classList.add("category-btn");
        categoryButton.setAttribute("onclick", `mostrarCategoria('${categoria.nombre.toLowerCase()}')`);
        categoryButton.setAttribute("data-bs-dismiss", "offcanvas");

        // Establecer un ícono especial para promociones
        let iconHtml = "<i class='fas fa-star fa-3x'></i>"; // Ícono genérico de categoría
        if (categoria.nombre === "Promociones") {
            iconHtml = "<i class='fas fa-fire fa-4x text-danger me-3'></i>"; // Ícono de flama en rojo para promociones
        }

        categoryButton.innerHTML = `
            ${iconHtml} <!-- Ícono especial si es Promociones -->
            <p class="category-text">${categoria.nombre}</p>
        `;
        categoryItem.appendChild(categoryButton);
        categoryList.appendChild(categoryItem);
    });
}


// Función para mostrar los productos de la categoría seleccionada
function mostrarCategoria(categoriaSeleccionada) {
    const category = categoriasData.find(cat => cat.nombre.toLowerCase() === categoriaSeleccionada.toLowerCase());
    
    if (category) {
        // Mostrar la sección de menú correspondiente
        document.getElementById("menuSection").style.display = "block";
        document.getElementById("sectionTitle").innerText = category.nombre; // Título de la categoría

        // Limpiar los productos anteriores
        const menuItems = document.getElementById("menuItems");
        menuItems.innerHTML = "";

        // Renderizar los productos de la categoría seleccionada
        if (category.productos && category.productos.length > 0) {
            category.productos.forEach(producto => {
                const item = document.createElement("div");
                item.classList.add("menu-item");

                item.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="menu-item-body">
                        <h3 class="menu-item-name">${producto.nombre}</h3>
                        <p class="menu-item-description">${producto.descripcion}</p>
                        <p class="menu-item-price">$${producto.precio}</p>
                        <button class="menu-item-button w-100 rounded-pill mb-2" onclick="openOrderModal('${producto.nombre}', ${producto.precio})">
                            <i class="fas fa-utensils"></i> Pedir
                        </button>
                        <button class="btn btn-info w-100 rounded-pill mb-2" onclick="showDetailsWithIngredients(this)" data-ingredients="${producto.ingredientes}" data-image="${producto.imagen}">
                            <i class="fas fa-apple-alt"></i> Ingredientes
                        </button>
                    </div>
                `;
                menuItems.appendChild(item);
            });
        } else {
            menuItems.innerHTML = "<p>No hay productos disponibles para esta categoría.</p>";
        }

        // Desplazar la página hasta el footer (al final)
        document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
    }
}

// Llamar a la función para cargar las categorías al principio
cargarCategoriaPeticion();
