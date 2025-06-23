const { Router } = require('express');
const { registrarVenta, obtenerVentas, obtenerVentaPorCodigoBarras } = require('../controllers/ventas');

const router = Router();

router.post('/', registrarVenta);
router.get('/codigo/:codigoBarras', obtenerVentaPorCodigoBarras);
router.get('/', obtenerVentas);

module.exports = router;
