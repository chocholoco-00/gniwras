const { Router } = require('express');
const { crearStock, obtenerStocks, actualizarStock, eliminarStock, obtenerStocksFIFO } = require('../controllers/stock');

const router = Router();

router.post('/', crearStock);
router.get('/fifo/:productoId', obtenerStocksFIFO);
router.get('/', obtenerStocks);
router.put('/:id', actualizarStock);
router.delete('/:id', eliminarStock);

module.exports = router;
