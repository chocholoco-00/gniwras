const { Router } = require('express');
const { registrarVenta, obtenerVentas, obtenerVentaPorCodigoBarras, anularVenta } = require('../controllers/ventas');

const router = Router();

router.post('/', registrarVenta);
router.get('/codigo/:codigoBarras', obtenerVentaPorCodigoBarras);
router.get('/', obtenerVentas);
router.patch('/anular/:id', anularVenta);

module.exports = router;
