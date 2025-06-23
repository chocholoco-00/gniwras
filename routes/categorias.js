const { Router } = require('express');
const { upsertCategoria, agregarTipo, agregarSubtipo, agregarVariante } = require('../controllers/categorias');

const router = Router();

router.post('/upsert', upsertCategoria);
router.post('/agregar-tipo', agregarTipo);
router.post('/agregar-subtipo', agregarSubtipo);
router.post('/agregar-variante', agregarVariante);

module.exports = router;
