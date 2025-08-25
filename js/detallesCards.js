// cards detalles de los productos


function showDetails(imgElement) {
    // Cambiar la fuente de la imagen en el modal a la que se ha hecho clic
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imgElement.src;

    // Asignar los ingredientes del platillo (esto puede variar por cada platillo)
    let ingredients = [];
    if (imgElement.alt === "Ensalada") {
        ingredients = ["Frambuesas frescas", "Harina", "Azúcar", "Mantequilla", "Crema pastelera"];
    } else if (imgElement.alt === "Sopa de Mariscos") {
        ingredients = ["Mariscos frescos", "Caldo de pescado", "Verduras", "Especias"];
    }

// Llenar la lista de ingredientes
const ingredientList = document.getElementById("modalIngredients");
ingredientList.innerHTML = ''; // Limpiar cualquier contenido anterior

// Crear un contenedor 'row' para los ingredientes
const row = document.createElement("div");
row.classList.add("row");

ingredients.forEach((ingredient, index) => {
    const col = document.createElement("div");
    col.classList.add("col-6"); // Dos ingredientes por fila

    // Crear un 'li' para cada ingrediente
    const li = document.createElement("li");
    li.classList.add("list-group-item", "mb-1"); // Estilo de lista con Bootstrap y margen abajo
    li.textContent = ingredient;

    col.appendChild(li); // Agregar el 'li' a la columna
    row.appendChild(col); // Agregar la columna al 'row'
});

ingredientList.appendChild(row); // Agregar el 'row' al contenedor de ingredientes


toggleModal('detailsModal'); // Mostrar el modal de detalles
    // Mostrar el modal
   // const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
   // modal.show();
}

function showDetailsWithIngredients(buttonElement, regresar = true) {
    // Obtener la imagen y los ingredientes del atributo data-image y data-ingredients
    const ingredients = buttonElement.getAttribute('data-ingredients').split(',');
    const image = buttonElement.getAttribute('data-image');

    // Cambiar la fuente de la imagen en el modal
    const modalImage = document.getElementById("modalImage");
    modalImage.src = image;

    // Obtener el contenedor de ingredientes y la lista
    const ingredientsSection = document.getElementById("ingredientsSection");
    const ingredientList = document.getElementById("modalIngredients");

    // Limpiar cualquier contenido anterior
    ingredientList.innerHTML = '';

    // Si hay ingredientes, llenarlos en el modal
    if (ingredients.length > 0 && ingredients[0].trim() !== '') {
        // Mostrar la sección de ingredientes
        ingredientsSection.style.display = 'block';
        
        // Crear un contenedor 'row' para los ingredientes (dos por fila)
        const row = document.createElement("div");
        row.classList.add("row", "g-2");  // 'g-2' para un pequeño espacio entre columnas
        
        ingredients.forEach((ingredient, index) => {
            const col = document.createElement("div");
            col.classList.add("col-6", "mb-1"); // Dos ingredientes por fila en pantallas grandes
            
            // Crear un 'li' para cada ingrediente con estilo visual
            const ingredientDiv = document.createElement("li");
            ingredientDiv.classList.add("list-group-item", "p-1", "border", "rounded", "shadow-sm", "text-truncate"); // Estilo visual para cada ingrediente
            
            ingredientDiv.textContent = ingredient.trim(); // Contenido del ingrediente
            
            col.appendChild(ingredientDiv); // Agregar el ingrediente a la columna
            row.appendChild(col); // Agregar la columna al 'row'
        });
        
        ingredientList.appendChild(row); // Agregar el 'row' al contenedor de ingredientes
    } else {
        // Ocultar la sección de ingredientes si no hay ingredientes
        ingredientsSection.style.display = 'none';
    }

    // Mostrar el modal
    if (regresar) {
        console.log("Mostrando detalles del platillo con ingredientes:");
        toggleModal('detailsModal'); // Mostrar modal de detalles del platillo
    } else {
        console.warn("No Mostrando detalles del platillo con ingredientes:");
        toggleModal('searchModal'); // Mostrar modal de búsqueda
    }
}
