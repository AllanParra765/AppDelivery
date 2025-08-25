// /routes/genericRoutes.js
const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');

// Todas las operaciones CRUD se manejan a través de esta única ruta
router.post('/execute', genericController.executeOperation);

module.exports = router;
