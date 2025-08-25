let muestra_historico = 0;


function manejarCambioOpcion(historico) {
    muestra_historico = historico;
    const selectSemana = document.getElementById("opciones"); // ID del seleccionado de la semana 
    const fechaContainer = document.getElementById("fechaContainer");
    const fechaNomina = document.getElementById("fechaNomina");
    const rango_fechas = document.getElementById("rango_fechas");

    if (selectSemana.value === "otraFecha") {
        // Mostrar el input de fecha y establecer el valor actual si está vacío
        fechaContainer.classList.remove("d-none");

        if (!fechaNomina.value) {
            const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            fechaNomina.value = hoy;
        }

        obtenerFechasNomina(selectSemana.value, fechaNomina.value);
    } else {
        fechaContainer.classList.add("d-none");
        obtenerFechasNomina(selectSemana.value);
    }
}

function obtenerFechasNomina(opcion, fechaSeleccionada = null) {
    let fechaRef = new Date();
// Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
let diaDeLaSemana = fechaRef.getDay();


    if (opcion === "otraFecha" && fechaSeleccionada) {
        fechaRef = new Date(fechaSeleccionada);
    
    }

    if (isNaN(fechaRef.getTime())) {
        alert("Seleccione una fecha válida.");
        return;
    }
// Variables para la semana y el año de la referencia
    let semanaRef = obtenerNumeroSemana(fechaRef);
    let añoRef = fechaRef.getFullYear();

    switch (opcion) {
        case "estaSemana":
            if (diaDeLaSemana === 5 || diaDeLaSemana === 6 || diaDeLaSemana === 0) {
                // Si es viernes (5), sábado (6) o domingo (0), cargar la nómina de la próxima semana
                semanaRef += 1;
                if (semanaRef > 52) { // Si la semana es mayor a 52, ir al año siguiente
                    semanaRef = 1;
                    añoRef += 1;
                }
            }
            // Si no es viernes, sábado o domingo, cargar la nómina de esta semana
            break;
        
        // Otros casos si es necesario (SemanaSiguiente, semanaAnterior, etc.)
        case "SemanaSiguiente":
            semanaRef += 1;
            if (semanaRef > 52) { // Si la semana es mayor a 52, ir al año siguiente
                semanaRef = 1;
                añoRef += 1;
            }
            break;
    
        case "haceDosSemanas":
            semanaRef -= 2;
            if (semanaRef < 1) {
                semanaRef = 52;
                añoRef -= 1;
            }
            break;
    
        case "semanaAnterior":  // Agregar la lógica para la semana pasada
            semanaRef -= 2;
            if (semanaRef < 1) {  // Si es antes de la semana 1, ir al año anterior
                semanaRef = 52;
                añoRef -= 1;
            }
            break;
    }
    


// Obtener el jueves y el viernes de la semana de referencia
    const jueves = obtenerDiaSemana(añoRef, semanaRef, 4); // Jueves
    const viernes = obtenerDiaSemana(añoRef, semanaRef - 1, 5); // Viernes anterior
    // Mostrar las fechas en el rango
    rango_fechas.innerHTML = `Viernes ${formatearFecha(viernes)}, Jueves ${formatearFecha(jueves)}`;
  //mostrarAlerta(`Fechas: Jueves ${formatearFecha(jueves)}, Viernes ${formatearFecha(viernes)}`, "info");


accionAxiosCargarEmpleados(formatearFecha(jueves), formatearFecha(viernes)); // Llamamos a la función que realiza la petición
accionAxiosCargarComentarios(formatearFecha(jueves), formatearFecha(viernes));
accionAxiosCargarNominas(formatearFecha(jueves), formatearFecha(viernes));

}

// Función para obtener el número de la semana del año
function obtenerNumeroSemana(fecha) {
    const fechaCopia = new Date(fecha);
    fechaCopia.setHours(0, 0, 0, 0);
    fechaCopia.setDate(fechaCopia.getDate() + 4 - (fechaCopia.getDay() || 7));
    const inicioAño = new Date(fechaCopia.getFullYear(), 0, 1);
    return Math.ceil((((fechaCopia - inicioAño) / 86400000) + 1) / 7);
}

// Función para obtener el día específico de una semana específica
function obtenerDiaSemana(año, semana, diaSemana) {
    const inicioAño = new Date(año, 0, 1);
    const primerJueves = inicioAño.getDate() + (4 - inicioAño.getDay());
    return new Date(año, 0, primerJueves + (semana - 1) * 7 + (diaSemana - 4));
}

// Formatear fecha en formato YYYY-MM-DD
function formatearFecha(fecha) {
    return fecha.toISOString().split('T')[0];
}





//////////////
