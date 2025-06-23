const { Router } = require('express');
const { crearCompra, obtenerCompras, obtenerCompraPorCodigoBarras } = require('../controllers/compras');

const router = Router();

router.post('/nueva', crearCompra);
router.get('/', obtenerCompras);
router.get('/codigo/:codigoBarras', obtenerCompraPorCodigoBarras);

module.exports = router;
