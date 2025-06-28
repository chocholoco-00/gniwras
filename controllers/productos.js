const response = require('express');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');


const crearProducto = async (req, res = response) => {
    const { nombre, categoria, tipo, subtipo, variante, descripcion, codigoBarra: codigoBarraBody, precio, perecedero, unidadMedida, Cantmin, Cantmax } = req.body;

    // Validación obligatoria de todos los campos
    if (!nombre || !categoria || !tipo || !subtipo || !variante || !descripcion || precio === undefined || perecedero === undefined || !unidadMedida) {
        return res.status(400).json({
            ok: false,
            msg: 'Todos los campos son obligatorios'
        });
    }

    // Validación obligatoria de subtipo y variante
    if (!subtipo || !variante) {
        return res.status(400).json({
            ok: false,
            msg: 'subtipo y variante son obligatorios'
        });
    }

    // Validación obligatoria de unidadMedida
    if (!unidadMedida) {
        return res.status(400).json({
            ok: false,
            msg: 'unidadMedida es obligatoria'
        });
    }

    // Generador de código de barras aleatorio de 12 a 13 dígitos (EAN-13)
    function generarCodigoBarraAleatorio() {
        const min = 1e11;
        const max = 1e13 - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Solo UNA declaración de codigoBarra
    let codigoBarra = codigoBarraBody;
    let existeBarra, intentoBarra = 0;
    if (
        !codigoBarra ||
        isNaN(Number(codigoBarra)) ||
        String(codigoBarra).length < 12 ||
        String(codigoBarra).length > 13 ||
        Number(codigoBarra) < 100000000000 ||
        Number(codigoBarra) > 9999999999999
    ) {
        // Si no se lee un código de barras, se genera uno (antes era codigoTienda)
        do {
            codigoBarra = generarCodigoBarraAleatorio();
            existeBarra = await Producto.findOne({ codigoBarra });
            intentoBarra++;
        } while (existeBarra && intentoBarra < 10);
        if (existeBarra) {
            return res.status(500).json({ ok: false, msg: 'No se pudo generar un código de barras único, intente de nuevo.' });
        }
    } else {
        existeBarra = await Producto.findOne({ codigoBarra: Number(codigoBarra) });
        if (existeBarra) {
            return res.status(400).json({ ok: false, msg: 'El código de barras ya existe' });
        }
    }

    const dbProduct = new Producto({
        nombre,
        categoria,
        tipo,
        subtipo,
        variante,
        codigoBarra: Number(codigoBarra),
        precio,
        perecedero,
        descripcion,
        unidadMedida,
        Cantmin: Number(Cantmin) || 0,
        Cantmax: Number(Cantmax) || 0
    });

    await dbProduct.save();

    return res.status(201).json({
        ok: true,
        nombre,
        codigoBarra: Number(codigoBarra),
        categoria,
        tipo,
        subtipo,
        variante,
        descripcion,
        precio,
        perecedero,
        unidadMedida,
        Cantmin: dbProduct.Cantmin,
        Cantmax: dbProduct.Cantmax,
        _id: dbProduct._id
    });
};

// Obtener toda la base de datos de productos 
const obtenerProductos = async (req, res = response) => {

    try {

        const dbProducto = await Producto.find();

        res.json(dbProducto)

    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg: 'Por favor hable con el administrador',
            error: error
        })
    }

}

const buscarProducto = async (req, res = response) => {

    const { _id } = req.body;

    const dbProducto = await Producto.findById(_id);
    res.json(dbProducto)

}

const buscarProductoPorCodigo = async (req, res = response) => {
    const { codigoBarra } = req.body;
    
    try {
        const producto = await Producto.findOne({ codigoBarra: Number(codigoBarra) });
        if (!producto) {
            return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
        }
        res.json({ ok: true, producto });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al buscar producto', error });
    }
};

// Crear un nuevo objeto json antes de actualizarlo en la posición de su mismo id
const actualizarProducto = async (req, res = response) => {
    const nuevoBody = req.body;

    // Validar todos los campos requeridos
    if (!nuevoBody.nombre || !nuevoBody.categoria || !nuevoBody.tipo || !nuevoBody.subtipo || !nuevoBody.variante || !nuevoBody.descripcion || nuevoBody.precio === undefined || nuevoBody.perecedero === undefined || !nuevoBody.unidadMedida) {
        return res.status(400).json({
            ok: false,
            msg: 'Todos los campos son obligatorios para actualizar'
        });
    }

    //Copiar el nuevo cuerpo del objeto a modificar
    const dbProducto = await Producto.findOneAndUpdate(
        { _id: nuevoBody._id },
        {
            $set: {
                nombre: nuevoBody.nombre,
                categoria: nuevoBody.categoria,
                tipo: nuevoBody.tipo,
                subtipo: nuevoBody.subtipo,
                variante: nuevoBody.variante,
                codigoBarra: nuevoBody.codigoBarra,
                precio: nuevoBody.precio,
                perecedero: nuevoBody.perecedero,
                descripcion: nuevoBody.descripcion,
                unidadMedida: nuevoBody.unidadMedida
            }
        },
        { new: true });
    res.json(dbProducto);
}

// Eliminar un producto de la base de datos
const eliminarProducto = async (req, res = response) => {

    const { _id } = req.body;

    const dbPEliminado = await Producto.findByIdAndDelete(_id);
}

// Obtener la tabla con las categorías o tipos de productos
const obtenerCategoriasProductos = async (req, res = response) => {
    try {
        // Permitir paginación y límite opcional
        const limit = Math.max(1, Math.min(Number(req.query.limit) || 100, 500)); // máximo 500
        const skip = Math.max(0, Number(req.query.skip) || 0);
        const categorias = await Categoria.find().skip(skip).limit(limit);
        const total = await Categoria.countDocuments();
        res.json({ categorias, total });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener categorías', error });
    }
}

// Devuelve la categoría respectiva with los tipos de productos de acuerdo al nombre de la categoría recibida
const obtenerTiposProductos = async (req, res = response) => {

    const { nombre } = req.body

    const dbTipo = await Categoria.find({ nombre })
    res.json(dbTipo)
}

// Actualizar solo el precio de un producto
const actualizarPrecioProducto = async (req, res = response) => {
    const { _id, precio } = req.body;
    if (!_id || precio === undefined) {
        return res.status(400).json({ ok: false, msg: 'ID y precio son obligatorios' });
    }
    try {
        const producto = await Producto.findByIdAndUpdate(_id, { precio }, { new: true });
        if (!producto) {
            return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
        }
        res.json({ ok: true, producto });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al actualizar precio', error });
    }
};

// Actualizar solo el precio, cantidad mínima o máxima de un producto
const actualizarCampoProducto = async (req, res = response) => {
    const { _id, campo, valor } = req.body;
    if (!_id || !campo || valor === undefined) {
        return res.status(400).json({ ok: false, msg: 'ID, campo y valor son obligatorios' });
    }
    if (!["precio", "Cantmin", "Cantmax"].includes(campo)) {
        return res.status(400).json({ ok: false, msg: 'Campo no permitido' });
    }
    try {
        const update = {};
        update[campo] = valor;
        const producto = await Producto.findByIdAndUpdate(_id, update, { new: true });
        if (!producto) {
            return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
        }
        res.json({ ok: true, producto });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al actualizar campo', error });
    }
};


module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto,
    buscarProducto,
    obtenerCategoriasProductos,
    obtenerTiposProductos,
    buscarProductoPorCodigo,
    actualizarPrecioProducto,
    actualizarCampoProducto
}