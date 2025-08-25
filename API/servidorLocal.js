// Configuración global de desarrollo
const config = {
    rutaAbrir: 'https://colonialdesarrollo.a.pinggy.link',
    rutaAbrirPinggy: 'https://dashboard.pinggy.io/',
};
// Configuración global de producción
//const config = {
//    rutaAbrir: 'https://colonial.a.pinggy.link',
//rutaAbrirPinggy: 'https://dashboard.pinggy.io/',
//};
const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
require('dotenv').config();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const pdfPrinter = require('pdf-to-printer');  // Asegúrate de tener esta librería instalada
const os = require('os');  // Importar el módulo para detectar el sistema operativo
const printer = require('pdf-to-printer');
const { PDFDocument } = require('pdf-lib');
const productosRoutes = require('./routes/Routes'); // Ruta de tu API
const app = express();
// Middleware
app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: '100mb' }));  // Ajusta el límite según el tamaño necesario


const formatosPersonalizados = {
    A4: { format: 'A4', printBackground: true },
    custom_60x29mm: { width: '60mm', height: '29mm', printBackground: true },
    custom_50x29mm: { width: '50mm', height: '29mm', printBackground: true },
    custom_80x40mm: { width: '80mm', height: '40mm', printBackground: true },
};

app.post('/imprimir', async (req, res) => {
    try {
        const { contenidoHtml, formato } = req.body;

        if (!contenidoHtml) {
            return res.status(400).json({ error: "Se requiere contenido HTML para la impresión." });
        }

        // Validar si el formato existe
        const opcionesPDF = formatosPersonalizados[formato];
        if (!opcionesPDF) {
            return res.status(400).json({ error: `Formato '${formato}' no soportado.` });
        }

        // Generar el archivo PDF con Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(contenidoHtml);

        // Determinar la ruta del archivo PDF
        const pdfPath = path.join(
            __dirname,
            formato === 'A4' ? 'nota_de_venta.pdf' : 'etiqueta.pdf'
        );

        // Generar el PDF original
        await page.pdf({ ...opcionesPDF, path: pdfPath });
        await browser.close();

        console.log('PDF generado correctamente:', pdfPath);

        // Crear un nuevo PDF con páginas alternas
        const pdfAlternasPath = await generarPDFConPaginasAlternas(pdfPath);

        // Imprimir según el formato
        if (formato === 'A4') {
            console.log("Formato A4 detectado, enviando a imprimir...");
            await imprimirPDFDocumentos(pdfAlternasPath, "Documentos2", formato);
        } else {
            console.log("Formato personalizado detectado, usando el lector predeterminado...");
            await imprimirPDFConLectorPredeterminado(pdfAlternasPath, "Etiquetas");
        }

        // Responder con éxito
        res.json({ message: 'PDF generado e impreso correctamente.', pdfPath: pdfAlternasPath });
    } catch (err) {
        console.error('Error al generar o imprimir PDF:', err);
        res.status(500).json({ error: 'Error al generar o imprimir el PDF.' });
    }
});

/**
 * Genera un nuevo PDF con páginas alternas (una sí, una no) del original.
 * @param {string} pdfPath - Ruta del archivo PDF original.
 * @returns {Promise<string>} - Ruta del nuevo archivo PDF con páginas alternas.
 */
async function generarPDFConPaginasAlternas(pdfPath) {
    try {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const nuevoPdf = await PDFDocument.create();
        const paginas = pdfDoc.getPages();

        console.log(`Número total de páginas en el PDF: ${paginas.length}`);

        // Iterar por las páginas alternas (una sí, una no)
        for (let i = 0; i < paginas.length; i += 2) {
            const [pagina] = await nuevoPdf.copyPages(pdfDoc, [i]);
            nuevoPdf.addPage(pagina);
        }

        const pdfAlternasPath = path.join(__dirname, 'pdf_alternas.pdf');
        const pdfAlternasBytes = await nuevoPdf.save();
        fs.writeFileSync(pdfAlternasPath, pdfAlternasBytes);

        console.log('PDF con páginas alternas generado:', pdfAlternasPath);
        return pdfAlternasPath;
    } catch (error) {
        console.error('Error al generar el PDF con páginas alternas:', error.message);
        throw error;
    }
}

///////////////
/**
 * Imprime un archivo PDF utilizando el lector predeterminado del sistema.
 * @param {string} pdfPath - Ruta del archivo PDF a imprimir.
 * @param {string} impresora - Nombre de la impresora a utilizar.
 * @returns {Promise<void>}
 */
async function imprimirPDFConLectorPredeterminado(pdfPath, impresora) {
    try {

        if (!fs.existsSync(pdfPath)) {
            console.error('Error: El archivo PDF no existe o la ruta es incorrecta.');
            return;
        }

        const sistemaOperativo = os.platform();
        console.log('Sistema Operativo Detectado:', sistemaOperativo);

        let comando;

        if (sistemaOperativo === 'win32') {
            // Usar PowerShell para abrir el PDF y enviarlo a imprimir
            //   comando = `powershell -Command "Start-Process '${pdfPath}' -Verb Print"`;

            comando = `"C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\FoxitPDFReader.exe" /t "${pdfPath}" "${impresora}"`;

        } else if (sistemaOperativo === 'darwin') {
            // Usar open para macOS
            //   comando = `open "${pdfPath}"`;
            comando = `lp -d "${impresora}" -o media=${tamanioHoja} -o fit-to-page "${pdfPath}"`;
        } else if (sistemaOperativo === 'linux') {
            // Usar xdg-open para Linux
            // comando = `xdg-open "${pdfPath}"`;
            comando = `lp -d "${impresora}" -o media=${tamanioHoja} -o fit-to-page "${pdfPath}"`;
        } else {
            throw new Error('Sistema operativo no soportado para impresión automática.');
        }

        exec(comando, (error, stdout, stderr) => {
            if (error) {
                console.error('Error al imprimir automáticamente el PDF:', error.message);
                console.error('Detalles adicionales:', stderr);
                return;
            }
            console.log('PDF enviado automáticamente a la impresora predeterminada.');
        });
    } catch (error) {
        console.error('Error al intentar imprimir automáticamente el PDF:', error.message);
    }
}

/**
 * Función principal para imprimir PDF con configuración personalizada.
 * @param {string} pdfPath - Ruta del archivo PDF.
 * @param {string} impresora - Nombre de la impresora.
 * @param {string} formato - Formato del papel.
 */
async function imprimirPDFDocumentos(pdfPath, impresora, formato) {
    try {
        if (!fs.existsSync(pdfPath)) {
            console.error('Error: El archivo PDF no existe o la ruta es incorrecta.');
            return;
        }

        const sistemaOperativo = os.platform();
        console.log('Sistema Operativo Detectado:', sistemaOperativo);

        const opcionesSistema = {
            A4: 'A4',
            custom_60x29mm: 'Custom.60x29mm',
            custom_50x29mm: 'Custom.50x29mm',
            custom_80x40mm: 'Custom.80x40mm',
        };

        const tamanioHoja = opcionesSistema[formato];
        if (!tamanioHoja) {
            throw new Error(`Formato de impresión '${formato}' no soportado.`);
        }

        let comando;

        if (sistemaOperativo === 'win32') {
            // Usar Foxit Reader o similar para impresión directa
            comando = `"C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\FoxitPDFReader.exe" /t "${pdfPath}" "${impresora}"`;
        } else if (sistemaOperativo === 'linux' || sistemaOperativo === 'darwin') {
            // Usar lp para Linux/macOS
            comando = `lp -d "${impresora}" -o media=${tamanioHoja} -o fit-to-page "${pdfPath}"`;
         //   comando = `lp -d "${impresora}" -o media=${tamanioHoja} -o orientation=landscape -o fit-to-page "${pdfPath}"`;
        } else {
            throw new Error('Sistema operativo no soportado para impresión.');
        }


        exec(comando, (error, stdout, stderr) => {
            if (error) {
                console.error('Error al imprimir el PDF:', error.message);
                console.error('Detalles adicionales:', stderr);
                return;
            }
            console.log('PDF enviado a la impresora con éxito.');
            console.log('Salida del comando:', stdout);
        });
    } catch (error) {
        console.error('Error al intentar imprimir el PDF:', error.message);
    }
}

// Servir archivos estáticos desde la raíz
app.use('/', express.static(path.join(__dirname, '../'))); // Vista principal

// Servir la carpeta 'views' en https://localhost:3001/views
app.use('/views', express.static(path.join(__dirname, '../views'))); // Carpeta views


// Rutas de la API
app.use('/api', productosRoutes);


const options = {
    key: fs.readFileSync('/Users/allan/Downloads/ColonialFolklor2_Movil_Web-1/API/certificados/key_no_password.pem'),
    cert: fs.readFileSync('/Users/allan/Downloads/ColonialFolklor2_Movil_Web-1/API/certificados/cert.pem')
  };
  //192.168.1.5

app.listen(3002, '0.0.0.0', () => { 
  //  console.log(`Servidor corriendo en http://0.0.0.0:3002`);
});


// Función para obtener la IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let localIP = '';
    
    // Iterar sobre las interfaces de red para obtener la IP de la red activa
    for (let iface in interfaces) {
        for (let i = 0; i < interfaces[iface].length; i++) {
            const ifaceDetails = interfaces[iface][i];
            if (ifaceDetails.family === 'IPv4' && !ifaceDetails.internal) {
                localIP = ifaceDetails.address;
                break;
            }
        }
    }
    return localIP;
}
// Iniciar servidor HTTPS para la vista
//https.createServer(options,app).listen(3001, 'localhost', () => {
// Iniciar servidor HTTPS en la IP local obtenida
https.createServer(options, app).listen(4001, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`
    ========================================
    🔐 \x1b[36mVista disponible en Equipos SIN INTERNET:\x1b[0m
    
    - 🖥️  clic a la siguiente ruta: https://${localIP}:4001
    
    🔐 \x1b[36mVista disponible en Equipos CON INTERNET:\x1b[0m
    
    - 📱 clic a la siguiente ruta: ${config.rutaAbrir}
    ========================================
    `);
  //  console.log(`
  //  ========================================
  //  🔐 \x1b[36mLevantar el Tunnel Pinggy para teléfonos o Externos:\x1b[0m
  //  - Ingresar a https://dashboard.pinggy.io/ 
  //  - Iniciar sesión con la cuenta de Colonial
  //  - ver pasos de la carpeta en escritorio "Tunnel Pinggy"
  //- Ingresar a https://pinggy.io/cli/ descargar la Cli en descargas o Do 
  //  - 📱 clic a la siguiente ruta: ${config.rutaAbrir}
  //  ========================================
  //  `);

    setTimeout(() => {
        // Abrir automáticamente el navegador con Pinngy (5 segundos después)
        // Para Windows, abrir con Google Chrome
        exec('start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "' + config.rutaAbrirPinggy + '"'); // Windows (Chrome)
    
        // Para Linux, abrir con el navegador predeterminado
        exec('xdg-open "' + config.rutaAbrirPinggy + '"'); // Linux
    
        // Para macOS, abrir con Firefox
        exec('open -a "Firefox" "' + config.rutaAbrirPinggy + '"'); // macOS (Firefox)
    
        // Llamar a la función para ejecutar el comando SSH
        ejecutarComandoSistemaOperativo();
    }, 5000);
    
    setTimeout(() => {
        // Abrir automáticamente el navegador en una segunda URL (25 segundos después)
        // Para Windows, abrir con Google Chrome
        exec('start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "' + config.rutaAbrir + '"'); // Windows (Chrome)
    
        // Para Linux, abrir con el navegador predeterminado
        exec('xdg-open "' + config.rutaAbrir + '"'); // Linux
        exec('xdg-open "' + `https://192.168.1.5:${3001}` + '"'); // Linux
    
        // Para macOS, abrir con Firefox
        exec('open -a "Firefox" "' + config.rutaAbrir + '"'); // macOS (Firefox)
        exec('open -a "Firefox" "' + `https://192.168.1.5:${3001}` + '"'); // macOS (Firefox)
    }, 12000);
    


});

//https://pinggy.io/cli/
function ejecutarComandoSistemaOperativo() {
    const systemOS = os.platform();

    let commandAPP;
    let commandSistema;
    let terminalCommandAPP;
    let terminalCommandSistema;

    if (systemOS === 'win32') {
        // Si es Windows, usamos el cmd
        commandAPP = 'cd %USERPROFILE%\\Downloads && .\\pinggy -p 443 -R0:localhost:3002 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 mO4Yv5kZrpb@pro.pinggy.io';
        terminalCommandAPP = 'start cmd /k ' + commandAPP;

        commandSistema = 'cd %USERPROFILE%\\Downloads && .\\pinggy -p 443 -R0:localhost:3002 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 mO4Yv5kZrpb@pro.pinggy.io';
        terminalCommandSistema = 'start cmd /k ' + commandSistema;
    } else if (systemOS === 'linux') {
        // Si es Linux, usamos bash
        commandAPP = 'ccd Downloads && ./pinggy -p 443 -R0:localhost:3002 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 mO4Yv5kZrpb@pro.pinggy.io';
        terminalCommandAPP = 'gnome-terminal -- bash -c "' + commandAPP + '"';

        commandSistema = 'ccd Downloads && ./pinggy -p 443 -R0:localhost:3002 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 mO4Yv5kZrpb@pro.pinggy.io';
        terminalCommandSistema = 'gnome-terminal -- bash -c "' + commandSistema + '"';
    } else if (systemOS === 'darwin') {
        // Si es macOS, usamos terminal
        commandAPP = 'ccd Downloads && ./pinggy -p 443 -R0:localhost:3002 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 mO4Yv5kZrpb@pro.pinggy.io';
        terminalCommandAPP = 'osascript -e \'tell app "Terminal" to do script "' + commandAPP + '"\'';

        commandSistema = 'ccd Downloads && ./pinggy -p 443 -R0:localhost:3002 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 mO4Yv5kZrpb@pro.pinggy.io';
        terminalCommandSistema = 'osascript -e \'tell app "Terminal" to do script "' + commandSistema + '"\'';
    } else {
        console.log('Sistema operativo no soportado.');
        return;
    }

    // Ejecutamos el comando en la terminal correspondiente a la APP
    exec(terminalCommandAPP, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error al ejecutar el comando: ${err.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
//        console.log(`stdout: ${stdout}`);
    });

    //      // Ejecutamos el comando en la terminal correspondiente al Sistema
 /*         exec(terminalCommandSistema, (err, stdout, stderr) => {
              if (err) {
                  console.error(`Error al ejecutar el comando: ${err.message}`);
                  return;
              }
              if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  return;
              }
              console.log(`stdout: ${stdout}`);
          });
*/

}
