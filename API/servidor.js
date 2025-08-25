
// Configuración global de desarrollo
const config = {
    locacion: 'http://localhost:3002',
    //rutaAbrir: 'https://colonialdesarrollo.a.pinggy.link',
    //rutaAbrirPinggy: 'https://dashboard.pinggy.io/',
};
const express = require('express');
const cors = require('cors');
const path = require('path');
const open = require('open');  // Importamos la librería 'open'
const multer = require('multer');// Para manejar la subida de archivos
const fs = require('fs');

require('dotenv').config();
const productosRoutes = require('./routes/Routes'); // Ruta de tu API
const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));  // Ajusta el límite según el tamaño necesario
// Asegúrate de tener body-parser habilitado para procesar los datos de formulario
app.use(express.urlencoded({ extended: true }));  // Para manejar datos de formularios
app.use(express.json());  // Para manejar datos JSON
app.use(express.static('imagenes'));  // Asegúrate de que las imágenes en 'imagenes' sean accesibles
app.use(express.static('promociones'));  // Asegúrate de que las imágenes en 'imagenes' sean accesibles


///////////////////////////////////////////////

// PARA SUBIR IMÁGENES DE PLATILLOS


// Ruta para la carpeta 'imagenes'
const imagenesDir = path.join(__dirname, 'imagenes');
const promocionesDir = path.join(__dirname, 'promociones');

// Verificar si la carpeta 'imagenes' existe, si no, crearla
if (!fs.existsSync(imagenesDir)) {
    fs.mkdirSync(imagenesDir, { recursive: true });  // Crea la carpeta 'imagenes' si no existe
    console.log("Carpeta 'imagenes' creada.");
} else {
    console.log("La carpeta 'imagenes' ya existe.");
}

// Verificar si la carpeta 'imagenes' existe, si no, crearla
if (!fs.existsSync(promocionesDir)) {
    fs.mkdirSync(promocionesDir, { recursive: true });  // Crea la carpeta 'imagenes' si no existe
    console.log("Carpeta 'promociones' creada.");
} else {
    console.log("La carpeta 'promociones' ya existe.");
}

// Configuración de Multer para almacenar imágenes en la carpeta 'imagenes'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagenesDir);  // Usar la carpeta 'imagenes'
    },
    filename: function (req, file, cb) {
        const productName = req.body.productName || "Platillo";  // Obtener el nombre del platillo del cuerpo de la solicitud
        const currentDate = new Date();
        const dateString = currentDate.toISOString().replace(/[-T:.]/g, ""); // Formatear la fecha como YYYYMMDDHHmmss

        // Crear el nombre del archivo: [nombrePlatillo]-[fecha-hora].[extensión]
        const fileName = `${productName}-${dateString}${path.extname(file.originalname)}`;
        cb(null, fileName);  // Generar el nombre del archivo
    }
});

// Configuración de Multer para almacenar imágenes en la carpeta 'Promociones'
const storagePromociones = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, promocionesDir);  // Usar la carpeta 'imagenes'
    },
    filename: function (req, file, cb) {
        const productName = req.body.productName || "Promociones";  // Obtener el nombre del platillo del cuerpo de la solicitud
        const currentDate = new Date();
        const dateString = currentDate.toISOString().replace(/[-T:.]/g, ""); // Formatear la fecha como YYYYMMDDHHmmss

        // Crear el nombre del archivo: [nombrePlatillo]-[fecha-hora].[extensión]
        const fileName = `${productName}-${dateString}${path.extname(file.originalname)}`;
        cb(null, fileName);  // Generar el nombre del archivo
    }
});

// Subir la imagen usando multer
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storagePromociones });


/////////////////////////////////////////////////
//PARA SUBIR IMÁGENES DE PLATILLOS
// Endpoint para cargar la imagen
app.post('/imagenes', upload.single('personaImage'), (req, res) => {
    if (!req.file) {
        console.error('No se cargó ninguna imagen.');
        return res.status(400).send('No se cargó ninguna imagen.');
    }

    // Log para verificar si Multer procesó el archivo correctamente
    console.log("Archivo procesado y guardado:", req.file);

    // Obtener la extensión del archivo
    const fileExtension = path.extname(req.file.originalname);  // Ejemplo: .jpg, .png
    const baseFileName = path.basename(req.file.originalname, fileExtension);  // Eliminar la extensión del nombre original
    const currentDate = new Date();
    const dateString = currentDate.toISOString().replace(/[-T:.]/g, "");  // Formatear la fecha como YYYYMMDDHHmmss
    const newFileName = `${baseFileName}_${dateString}${fileExtension}`;  // Renombrar el archivo con la fecha y mantener la extensión

    const tempPath = req.file.path;  // Ruta temporal del archivo subido
    const newPath = path.join('imagenes', newFileName);  // Nueva ruta con el nombre renombrado

    // Renombrar el archivo utilizando fs.rename
    fs.rename(tempPath, newPath, (err) => {
        if (err) {
            console.error('Error al renombrar el archivo:', err);
            return res.status(500).send('Error al renombrar el archivo.');
        }

        // Si el archivo fue renombrado correctamente, generar la URL de la imagen
        const imageUrl = `/imagenes/${newFileName}`;
        console.log("Imagen subida y renombrada:", imageUrl);

        // Enviar la respuesta con la URL de la imagen renombrada
        return res.json({ imageUrl: imageUrl });
    });
});

//PARA SUBIR IMÁGENES DE PROMOCIONES
app.post('/promociones', upload1.single('promocionImage'), (req, res) => {
    if (!req.file) {
        console.error('No se cargó ninguna imagen.');
        return res.status(400).send('No se cargó ninguna imagen.');
    }

    // Log para verificar si Multer procesó el archivo correctamente
    console.log("Archivo procesado y guardado:", req.file);

    // Obtener la extensión del archivo
    const fileExtension = path.extname(req.file.originalname);  // Ejemplo: .jpg, .png
    const baseFileName = path.basename(req.file.originalname, fileExtension);  // Eliminar la extensión del nombre original
    const currentDate = new Date();
    const dateString = currentDate.toISOString().replace(/[-T:.]/g, "");  // Formatear la fecha como YYYYMMDDHHmmss
    const newFileName = `${baseFileName}_${dateString}${fileExtension}`;  // Renombrar el archivo con la fecha y mantener la extensión
    const tempPath = req.file.path;  // Ruta temporal del archivo subido
    const newPath = path.join(promocionesDir, newFileName);  // Nueva ruta con el nombre renombrado

    // Renombrar el archivo utilizando fs.rename
    fs.rename(tempPath, newPath, (err) => {
        if (err) {
            console.error('Error al renombrar el archivo:', err);
            return res.status(500).send('Error al renombrar el archivo.');
        }

        // Si el archivo fue renombrado correctamente, generar la URL de la imagen
        const imageUrl = `/promociones/${newFileName}`;
        console.log("Imagen subida y renombrada:", imageUrl);

        // Enviar la respuesta con la URL de la imagen renombrada
        return res.json({ imageUrl: imageUrl });
    });
});


///////////////////////////////////////////////

// Servir archivos estáticos desde la raíz
app.use('/', express.static(path.join(__dirname, '../'))); // Vista principal
app.get('admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html')); // Página de administración
  });
app.use('/views', express.static(path.join(__dirname, '../views'))); // Carpeta views
app.use('/partials', express.static(path.join(__dirname, 'partials')));
// Rutas de la API
app.use('/api', productosRoutes);
// Servir la API en HTTP
app.listen(3002, 3000, 'localhost', () => {
    // Abre la URL automáticamente en el navegador
    open(`${config.locacion}`);
    open(`${config.locacion}/admin.html`);

});



