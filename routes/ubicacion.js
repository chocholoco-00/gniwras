const { Router } = require('express');
const {
  crearUbicacion,
  obtenerUbicaciones,
  obtenerUbicacionPorId,
  eliminarUbicacion,
  moverUbicacion,
  actualizarNombreUbicacion,
  eliminarUbicacionYSububicaciones
} = require('../controllers/ubicacion');

const router = Router();

// Crear una nueva ubicación
router.post('/', crearUbicacion);
// Obtener todas las ubicaciones
// (puedes implementar obtenerUbicaciones en el controlador)
router.get('/', obtenerUbicaciones);
// Obtener una ubicación por ID
router.get('/:id', obtenerUbicacionPorId);
// Eliminar una ubicación
router.delete('/:id', eliminarUbicacion);
// Eliminar una ubicación y todos sus hijos recursivamente
router.delete('/:id/recursivo', eliminarUbicacionYSububicaciones);
// Ruta para mover una ubicación (cambiar su padre)
router.patch('/:id/mover', moverUbicacion);
// Ruta para actualizar el nombre de una ubicación
router.patch('/:id/actualizar-nombre', actualizarNombreUbicacion);

// Sí, la ruta y el body son correctos **siempre que tu backend esté escuchando en localhost:4200/api/ubicaciones**.
// La petición debe ser:
//   PUT http://localhost:4200/api/ubicaciones/684c3aaddb637c81b658ef37/mover
//   Content-Type: application/json
//   Body:
//   {
//     "nuevoPadreId": "684c3aacdb637c81b658ef26"
//   }
// Sin embargo, normalmente el backend corre en otro puerto (ej: 4000) y el frontend en 4200.
// Si tu backend corre en 4000, la ruta sería:
//   PUT http://localhost:4000/api/ubicaciones/684c3aaddb637c81b658ef37/mover
// Verifica el puerto y el proxy de Angular si usas uno.

module.exports = router;
