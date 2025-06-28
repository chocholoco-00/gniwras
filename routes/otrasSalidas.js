const express = require('express');
const router = express.Router();
const { crearOtrasSalida, listarOtrasSalidas } = require('../controllers/otrasSalidas');

router.post('/', crearOtrasSalida);
router.get('/', listarOtrasSalidas);

module.exports = router;
