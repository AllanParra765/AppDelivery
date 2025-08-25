const apiBaseUrl = 'https://colonialdesarrollo.a.pinggy.link/api'; // URL base para la API de desarrollo
const rutaAbrir = 'https://colonialdesarrollo.a.pinggy.link'; // Ruta principal de desarrollo
//const apiBaseUrl = 'https://colonial.a.pinggy.link/api'; // URL base para la API de producción
//const rutaAbrir = 'https://colonial.a.pinggy.link'; // Ruta principal de producción

// Configuración global
const config = {
    apiBaseUrl,
    rutaAbrir, // Cambia también en API/SERVIDOR.js
    imprimirUrl: `${rutaAbrir}/imprimir`,
    impresoraDocumentos: 'Documentos', // Nombre de la impresora para documentos
    impresoraEtiquetas: 'Etiquetas', // Nombre de la impresora para etiquetas
    formatoDocumentos: 'A4', // Formato para documentos
    formatoEtiquetas: 'custom_60x29mm', // Formato para etiquetas //'custom_50x29mm', //formato de la termica, 
    orientacionHorizontal: 'landscape', // Orientación horizontal
    orientacionVertical: 'portrait', // Orientación vertical
    timeout: 5000, // Tiempo de espera para las solicitudes
};

// Crear una instancia de Axios reutilizable
const apiClient = axios.create({
    baseURL: 'http://localhost:3002/api', // URL base local
    //baseURL: apiBaseUrl, // api conexion Producción 
    timeout: 5000, // Tiempo de espera
     headers: {
         'Content-Type': 'application/json'
     }
 }); 

// Función para hacer la llamada a la API y reutilizarla en cualquier parte
async function hacerPeticion(data) {
    try {
        const response = await apiClient.post('/execute', data);
        return response.data;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error; // Lanzamos el error para manejarlo externamente
    }
}
async function realizarOtraPeticion(data2) {
    try {
        const resultado = await hacerPeticion(data2);
        console.log('Respuesta de la otra petición:', resultado);
        return resultado;
    } catch (error) {
        console.error('Error al realizar otra petición:', error);
    }
}

async function hacerPeticionImagen(data) {
  try {
      const response = await apiClient.post('/imagenes', data);
      return response.data;
  } catch (error) {
      console.error('Error en la petición:', error);
      throw error; // Lanzamos el error para manejarlo externamente
  }
}