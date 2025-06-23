const express = require('express');
const router = express.Router();
const visualPagesController = require('../controllers/visualPages');

// Crear una nueva página visual
router.post('/', visualPagesController.createVisualPage);

// Obtener todas las páginas visuales
router.get('/', visualPagesController.getVisualPages);

// Obtener una página visual por ID
router.get('/:id', visualPagesController.getVisualPageById);

// Actualizar una página visual
router.put('/:id', visualPagesController.updateVisualPage);

// Eliminar una página visual
router.delete('/:id', visualPagesController.deleteVisualPage);

module.exports = router;
