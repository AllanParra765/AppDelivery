function mostrarCategoria(categoria) {
    const secciones = document.querySelectorAll('.menu-section');
    secciones.forEach((seccion) => {
        seccion.style.display = 'none';
    });
    document.getElementById(categoria).style.display = 'block';
}

// Mostrar Entradas por defecto
  mostrarCategoria('promociones');