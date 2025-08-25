// /controllers/genericController.js
const pool = require('../config/db');

// Función para validar si el procedimiento existe
async function procedureExists(procedureName) {
    const connection = await pool.getConnection();
    try {
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_SCHEMA = ? 
            AND ROUTINE_NAME = ? 
            AND ROUTINE_TYPE = 'PROCEDURE'`, [process.env.DB_NAME, procedureName]);
        return procedures.length > 0;
    } finally {
        connection.release();
    }
}

// Función para llamar al procedimiento almacenado con straccion y parámetros JSON
async function callProcedure(procedureName, straccion, params) {
    const connection = await pool.getConnection();
    try {
        // Llamada dinámica al procedimiento con straccion y parámetros
        const query = `CALL ${procedureName}(?, ?)`;
        const [results] = await connection.query(query, [straccion, JSON.stringify(params)]);
        return results;
    } finally {
        connection.release();
    }
}

const executeOperation = async (req, res) => {
    const { procedureName, straccion, params } = req.body;

    try {
        // Validar si el procedimiento almacenado existe
        const exists = await procedureExists(procedureName);
        if (!exists) {
            return res.status(400).json({ error: `El procedimiento ${procedureName} no existe.` });
        }

        // Llamar al procedimiento con straccion y los parámetros en formato JSON
        const results = await callProcedure(procedureName, straccion, params);
        res.json(results[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    executeOperation
};
