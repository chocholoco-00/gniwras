const Compra = require('../models/Compra');

const crearCompra = async (req, res) => {
  try {
    // Si no viene codigoBarraCompra, lo generamos automáticamente
    if (!req.body.codigoBarraCompra) {
      req.body.codigoBarraCompra = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    }
    const compra = new Compra(req.body);
    await compra.save();
    await compra.populate('productos.producto');

    res.status(201).json({ ok: true, compra });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al registrar compra', error });
  }
};

const obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.find().populate('productos.producto').sort({ fecha: -1 });
    res.json({ ok: true, compras });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener compras', error });
  }
};

const obtenerCompraPorCodigoBarras = async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    const compra = await Compra.findOne({ codigoBarraCompra: codigoBarras }).populate('productos.producto');
    if (!compra) {
      return res.status(404).json({ ok: false, msg: 'Compra no encontrada' });
    }
    res.json({ ok: true, compra });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al buscar compra', error });
  }
};

module.exports = { crearCompra, obtenerCompras, obtenerCompraPorCodigoBarras };
