  // Función para cargar contenido desde archivos parciales
  function loadPartial(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        });
}

// Cargar los archivos parciales
document.addEventListener("DOMContentLoaded", () => {
    loadPartial('views/administracion/headerAdmin.html', 'content');
       loadPartial('views/administracion/pestanas/categoria.html', 'categoria'); // Cambia el ID si es necesario
    loadPartial('views/administracion/footerAdmin.html', 'footer'); // Cambia el ID si es necesario
 });

