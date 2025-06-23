const { Router } = require('express');
const {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto,
    buscarProducto,
    obtenerCategoriasProductos,
    obtenerTiposProductos, 
    buscarProductoPorCodigo,
    actualizarPrecioProducto,
    actualizarCampoProducto } = require('../controllers/productos');


const router = Router();

//Crear un producto
router.post('/nuevo', crearProducto);

//Obtener un producto
router.get('/producto', obtenerProductos);

//Buscar un producto
router.post('/buscar', buscarProducto);

//Actualizar producto
router.post('/actualizar', actualizarProducto);

//Actualizar solo el precio de un producto
router.post('/actualizar-precio', actualizarPrecioProducto);

//Actualizar solo el precio, cantidad mínima o máxima de un producto
router.post('/actualizar-campo', actualizarCampoProducto);

//Eliminar producto
router.post('/eliminarProducto', eliminarProducto);

//Buscar producto por código de barras
router.post('/buscar-por-codigo', buscarProductoPorCodigo);


//Obtener las categorias de productos que preestablecimos en la base de datos
router.get('/obtenerCategoriasProductos', obtenerCategoriasProductos);

//Obtener los tipos de productos que preestablecimos en la base de datos
router.post('/obtenerTiposProductos', obtenerTiposProductos);


module.exports = router