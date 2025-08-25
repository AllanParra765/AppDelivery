
    
  // Función para enviar mensaje por WhatsApp
  function sendWhatsAppMessage(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Obtén los valores de los campos del formulario
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    // Número de teléfono al que enviar el mensaje (código de país + número, sin el "+" ni espacios)
    const phoneNumber = "+524772307241"; // Cambia este número por el número al que deseas enviar el mensaje

    // Crea el mensaje de WhatsApp
    const encodedMessage = `Nombre: ${encodeURIComponent(name)}%0AMensaje: ${encodeURIComponent(message)}`;

    // Crea el enlace de WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abre el enlace de WhatsApp
    window.open(whatsappLink, '_blank');
  }

