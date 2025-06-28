const Compra = require('../models/Compra');
const Stock = require('../models/Stock');

const crearCompra = async (req, res) => {
  try {
    // Si no viene codigoBarraCompra, lo generamos automáticamente
    if (!req.body.codigoBarraCompra) {
      req.body.codigoBarraCompra = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    }
    // Generar numeroCuenta incremental
    const lastCompra = await Compra.findOne().sort({ numeroCuenta: -1 });
    req.body.numeroCuenta = lastCompra && lastCompra.numeroCuenta ? lastCompra.numeroCuenta + 1 : 1;

    // Asegurar que cada producto tenga fechaVencimiento si viene en el request
    if (Array.isArray(req.body.productos)) {
      req.body.productos = req.body.productos.map(prod => {
        // Si no viene fechaVencimiento, dejarlo undefined
        if ('fechaVencimiento' in prod && prod.fechaVencimiento) {
          prod.fechaVencimiento = new Date(prod.fechaVencimiento);
        } else {
          prod.fechaVencimiento = undefined;
        }
        return prod;
      });
    }

    const compra = new Compra(req.body);
    await compra.save();
    await compra.populate('productos.producto');

    // Crear stock para cada producto usando el mismo codigoBarrasLote
    if (Array.isArray(compra.productos)) {
      for (const prod of compra.productos) {
        await Stock.create({
          producto: prod.producto._id || prod.producto,
          cantidad: prod.cantidad,
          codigoBarras: prod.codigoBarrasLote,
          expira: prod.fechaVencimiento,
          // Puedes agregar ubicacion si aplica, por ejemplo: ubicacion: req.body.ubicacion || 'principal'
        });
      }
    }

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

const obtenerUltimoNumeroCuenta = async (req, res) => {
  try {
    const ultimaCompra = await Compra.findOne({ numeroCuenta: { $ne: null } })
      .sort({ numeroCuenta: -1 })
      .select('numeroCuenta');
    res.json({ numeroCuenta: ultimaCompra ? ultimaCompra.numeroCuenta : 0 });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener último número de cuenta', error });
  }
};

module.exports = { crearCompra, obtenerCompras, obtenerCompraPorCodigoBarras, obtenerUltimoNumeroCuenta };
