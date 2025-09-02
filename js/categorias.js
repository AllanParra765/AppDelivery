function mostrarCategoria(categoria) {
    try {
        const secciones = document.querySelectorAll('.menu-section');
        secciones.forEach((seccion) => {
            seccion.style.display = 'none';
        });
        document.getElementById(categoria).style.display = 'block';
    } catch (error) {
       console.error('Error al mostrar la categoría:', error);
       // Mostrar Entradas por defecto
         mostrarCategoria('promociones'); 
    }
   
}

// Mostrar Entradas por defecto
 // mostrarCategoria('promociones');