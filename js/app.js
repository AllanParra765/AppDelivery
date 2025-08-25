// Esta función carga el contenido de la vista solicitada
function loadView(view) {
  fetch(view)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar la vista');
      }
      return response.text();
    })
    .then(data => {
      // Inserta el contenido de la vista en el main-content
      document.getElementById('main-content').innerHTML = data;
    })
    .catch(error => {
      console.error('Error cargando la vista:', error);
      document.getElementById('main-content').innerHTML = '<p>Hubo un error al cargar la vista.</p>';
    });
}

// Esta función carga una vista y cierra el sidebar
// Además, ejecuta una función específica después de cargar la vista
function loadViewAndClose(view) {
  loadPartial(view,'secciones');
}


// Función para cargar un archivo HTML en un contenedor específico
function loadPartial(url, elementId) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.getElementById(elementId).innerHTML = data;
      })
      .catch(error => console.error('Error al cargar el archivo:', error));
  }
  
  // Cargar los partials en los elementos correspondientes
  loadPartial('../views/header.html', 'header');
  loadPartial('../views/partials/carrusel.html', 'carrusel');
  loadPartial('../views/partials/menu.html', 'menu');
  loadPartial('../views/modales/secciones/secciones.html', 'secciones');
  loadPartial('../views/modales/platillos/agregar.html', 'agregar');
    loadPartial('../views/modales/platillos/cantidad.html', 'cantidad');
    loadPartial('../views/modales/platillos/detalle.html', 'detalle');
    loadPartial('../views/modales/platillos/resumen.html', 'resumen');
  loadPartial('../views/footer.html', 'footer');
  