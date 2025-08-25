// /controllers/productosController.js
const pool = require('../config/db');

async function callProcedure(procedureName, params = []) {
    const connection = await pool.getConnection();
    try {
        // Validar que el procedimiento exista
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_SCHEMA = ? 
            AND ROUTINE_NAME = ? 
            AND ROUTINE_TYPE = 'PROCEDURE'`, [process.env.DB_NAME, procedureName]);

        if (procedures.length === 0) {
            throw new Error(`El procedimiento ${procedureName} no existe.`);
        }

        await connection.query('USE ??', [process.env.DB_NAME]);
        const [results] = await connection.query(`CALL ${procedureName}(${params.map(() => '?').join(', ')})`, params);
        return results;
    } finally {
        connection.release();
    }
}

async function callView(viewName, params = []) {
    const connection = await pool.getConnection();
    try {
        // Validar que la vista exista
        const [views] = await connection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.VIEWS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = ?`, [process.env.DB_NAME, viewName]);

        if (views.length === 0) {
            throw new Error(`La vista ${viewName} no existe.`);
        }

        await connection.query('USE ??', [process.env.DB_NAME]);
        const [results] = await connection.query(`SELECT * FROM ${viewName} ${params.length > 0 ? 'WHERE ' + params.join(' AND ') : ''}`);
        return results;
    } finally {
        connection.release();
    }
}

const executeOperation = async (req, res) => {
    const { type, name } = req.body; // 'type' puede ser 'procedure' o 'view'
    const params = req.body.params || []; // Parámetros que se van a pasar al procedimiento o vista
    
    try {
        let results;
        if (type === 'procedure') {
            results = await callProcedure(name, params);
        } else if (type === 'view') {
            results = await callView(name, params);
        } else {
            return res.status(400).json({ error: 'Tipo de operación no válido' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    executeOperation
};



/*
const pool = require('../config/db');

async function callProcedure(procedureName, params = []) {
    const connection = await pool.getConnection();
    try {
        await connection.query('USE ??', [process.env.DB_NAME]);
        const [results] = await connection.query(`CALL ${procedureName}(${params.map(() => '?').join(', ')})`, params);
        return results;
    } finally {
        connection.release();
    }
}

const getProductos = async (req, res) => {
    try {
        const { nombre } = req.query; // Parámetro de búsqueda
        if (nombre) {
            // Si hay un parámetro de búsqueda, buscar productos por nombre
            const results = await pool.query('SELECT * FROM productos WHERE nombre LIKE ?', [`%${nombre}%`]);
            res.json(results[0]);
        } else {
            // Obtener todos los productos
            const results = await callProcedure('obtener_todos_los_productos');
            res.json(results[0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await callProcedure('obtener_producto_por_id', [id]);
        if (results[0].length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProducto = async (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    if (!nombre || !precio || cantidad === undefined) {
        return res.status(400).json({ error: 'El nombre, precio y cantidad son obligatorios' });
    }
    try {
        await callProcedure('crear_producto', [nombre, descripcion, precio, cantidad]);
        res.status(201).json({ message: 'Producto creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad } = req.body;
    if (!nombre || !precio || cantidad === undefined) {
        return res.status(400).json({ error: 'El nombre, precio y cantidad son obligatorios' });
    }
    try {
        const results = await callProcedure('obtener_producto_por_id', [id]);
        if (results[0].length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await callProcedure('actualizar_producto', [id, nombre, descripcion, precio, cantidad]);
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await callProcedure('obtener_producto_por_id', [id]);
        if (results[0].length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await callProcedure('eliminar_producto', [id]);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};
*/