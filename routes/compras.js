const { Router } = require('express');
const { crearCompra, obtenerCompras, obtenerCompraPorCodigoBarras, obtenerUltimoNumeroCuenta } = require('../controllers/compras');

const router = Router();

router.post('/nueva', crearCompra);
router.get('/', obtenerCompras);
router.get('/codigo/:codigoBarras', obtenerCompraPorCodigoBarras);
router.get('/ultimo-numero-cuenta', obtenerUltimoNumeroCuenta);

module.exports = router;
