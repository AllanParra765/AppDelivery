function startScanning(targetInputId, allowMultipleScans = false) {

    const targetInput = document.getElementById(targetInputId);
    const video = document.getElementById("cameraPreview");
    const canvasElement = document.getElementById("qrCanvas");
    const canvas = canvasElement.getContext("2d");
    let scanTimeout;
    let scanning = true;  // Para controlar el estado del escáner

    // Iniciar la cámara y el escáner
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.style.display = "block";
            video.play();
            requestAnimationFrame(tick);

            // Timeout para detener el escáner después de 60 segundos (si no se detiene manualmente)
            scanTimeout = setTimeout(() => {
                if (scanning) stopScannerAndCloseModal();
            }, 60000);
        })
        .catch(function (err) {
            console.error("Error al acceder a la cámara: ", err);
        });

let lastScanTime = 0; // Timestamp del último escaneo
const scanDelay = 2000; // Tiempo en milisegundos entre escaneos (2 segundos)

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA && scanning) {
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            const now = Date.now();

            // Verificar si ha pasado el tiempo suficiente desde el último escaneo
            if (now - lastScanTime >= scanDelay) {
                lastScanTime = now; // Actualizar el tiempo del último escaneo

                try {
                    const parsedData = JSON.parse(code.data); // Intentar analizar el JSON
                    const idParValue = parsedData.idPar;
                  // const idParValue = code.data;
                    console.log("Código QR detectado: ", idParValue);

                    // Asignar el valor al input y disparar el evento de input
                    if (targetInput) {
                        targetInput.value = idParValue;
                        const event = new Event("input", { bubbles: true });
                        targetInput.dispatchEvent(event);
                    } else {
                        console.error("El campo de texto con id " + targetInputId + " no se encontró.");
                    }

                    // Si solo se desea un escaneo, detener el escáner
                    if (!allowMultipleScans) {
                        stopScannerAndCloseModal();
                    }
                } catch (e) {
                    console.error("Error al analizar los datos del QR: ", e.message);
                }
            }
        }
    }
    requestAnimationFrame(tick);
}


    // Función para detener el escáner y cerrar el modal
    function stopScannerAndCloseModal() {
        scanning = false; // Desactivar el escaneo
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.style.display = "none";
        }

        // Seleccionar y cerrar el modal
        const modalElement = document.querySelector('.modal.show');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    }

    // Método adicional para permitir cerrar el modal manualmente (en cualquier momento)
    function closeModal() {
        stopScannerAndCloseModal();
    }

    // Exponer la función para ser llamada externamente
    return { closeModal };
}

function stopCamera(videoElementId) {
    const video = document.getElementById(videoElementId);
    if (video && video.srcObject) {
        const stream = video.srcObject;

        // Detener cada track del stream
        stream.getTracks().forEach(track => {
            track.stop();
        });

        // Limpiar el objeto srcObject
        video.srcObject = null;
        console.log("Cámara detenida.");
    } else {
        console.warn("No hay un stream activo para detener.");
    }
}


