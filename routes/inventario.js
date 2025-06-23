const { Router } = require('express');
const {
  crearInventario,
  obtenerInventarios,
  actualizarInventario,
  eliminarInventario
} = require('../controllers/inventario');

const router = Router();

router.post('/', crearInventario);
router.get('/', obtenerInventarios);
router.put('/:id', actualizarInventario);
router.delete('/:id', eliminarInventario);

module.exports = router;
