const express = require('express');
const router = express.Router();
const { crearOtrasEntrada, listarOtrasEntradas, obtenerUltimoNumeroCuenta, generarCodigoBarra, obtenerOtrasEntradaPorCodigoBarra } = require('../controllers/otrasEntradas');

router.post('/', crearOtrasEntrada);
router.get('/', listarOtrasEntradas);
router.get('/ultimo-numero-cuenta', obtenerUltimoNumeroCuenta);
router.get('/generar-codigo-barra', generarCodigoBarra);
router.get('/codigo/:codigoBarra', obtenerOtrasEntradaPorCodigoBarra);

module.exports = router;
