// Función para alternar entre los temas
function toggleTheme() {
  // Verifica el tema actual
  let currentTheme = localStorage.getItem('theme'); // Obtener tema desde localStorage

  // Si no hay tema guardado, por defecto es el claro
  if (!currentTheme || currentTheme === 'light') {
      // Cambiar a tema oscuro
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark'); // Guardar el tema oscuro
  } else {
      // Cambiar a tema claro
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light'); // Guardar el tema claro
  }
}

// Función para aplicar el tema guardado en localStorage al cargar la página
function applyStoredTheme() {
  const savedTheme = localStorage.getItem('theme'); // Obtener tema guardado
  if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
  } else {
      document.body.classList.add('light-theme');
  }
}

// Ejecutar la función para aplicar el tema cuando se cargue la página
window.addEventListener('DOMContentLoaded', applyStoredTheme);

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
function loadViewAndClose(view, callback) {
  loadView(view);
  
  // Cierra el offcanvas (sidebar) después de cargar la vista
  const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('sidebar'));
  offcanvas.hide(); 
  
  // Ejecuta la función específica después de cargar la vista
  if (callback && typeof callback === 'function') {
      callback();
  }
}


// Función asíncrona para cargar los archivos HTML
async function loadContent(partial, elementId) {
    try {
        // Cargar el contenido
        const headerResponse = await fetch(partial);
        const headerHTML = await headerResponse.text();
        document.getElementById(elementId).innerHTML = headerHTML;

        
    } catch (error) {
        console.error("Error al cargar los archivos:", error);
    }
}


 //Llamar la función para cargar el contenido
loadContent('header.html', 'header');
loadContent('main.html', 'main');
loadContent('footer.html', 'footer');

