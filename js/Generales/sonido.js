
      const offcanvas = document.getElementById('sidebar');
        if (!offcanvas) {
          //  console.error('El elemento con ID "sidebar" no existe.');
        } else {
            const dropdownToggleClass = 'dropdown-toggle';

            // Escuchar clics en todo el offcanvas
            offcanvas.addEventListener('click', (event) => {
                const target = event.target;

                // Verificar si es un enlace directo y no un desplegable
                if (target.tagName === 'A' && !target.classList.contains(dropdownToggleClass)) {
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
                    offcanvasInstance.hide(); // Cerrar el offcanvas
                }
            });
        }

    
    
    // Cargar sonidos
    const successSound = new Audio('src/audio/success.mp3'); // Ruta del sonido de éxito
    function playSuccessSound() {
        successSound.play()
            .then(() => console.log('Sonido de éxito reproducido.'))
            .catch(error => console.error('Error al reproducir el sonido de éxito:', error));
    }
    // Llamar a la función para reproducir el sonido
//    playSuccessSound();
