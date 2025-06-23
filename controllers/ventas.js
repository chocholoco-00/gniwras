const mongoose = require('mongoose');
const Venta = require('../models/Venta');

const registrarVenta = async (req, res) => {
  try {
    const { productos, total, identificacionCliente } = req.body;
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ ok: false, msg: 'Productos requeridos' });
    }
    if (typeof total !== 'number' || isNaN(total)) {
      return res.status(400).json({ ok: false, msg: 'Total inválido' });
    }

    // Validar que todos los productos tengan ObjectId válido
    for (const item of productos) {
      if (!mongoose.Types.ObjectId.isValid(item.producto)) {
        return res.status(400).json({ ok: false, msg: 'ID de producto inválido', producto: item.producto });
      }
    }

    // LOG para depuración

    // Genera un código de barras y número de cuenta únicos (ajusta según tu lógica)
    const codigoBarraVenta = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const lastVenta = await Venta.findOne().sort({ numeroCuenta: -1 });
    const numeroCuenta = lastVenta ? lastVenta.numeroCuenta + 1 : 1;

    const venta = new Venta({
      productos,
      total,
      identificacionCliente,
      codigoBarraVenta,
      numeroCuenta
    });
    await venta.save();
    res.status(201).json({ ok: true, venta });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al registrar venta', error });
  }
};

const obtenerVentas = async (req, res) => {
  try {
    // Trae ventas con productos poblados
    const ventas = await Venta.find().sort({ fecha: -1 }).populate('productos.producto');
    // Mapea cada venta para devolver productos como snapshot
    const ventasConDetalles = ventas.map(venta => {
      const productos = venta.productos.map(item => {
        const prod = item.producto;
        return {
          nombre: prod?.nombre || '-',
          categoria: prod?.categoria || '-',
          tipo: prod?.tipo || '-',
          subtipo: prod?.subtipo || '-',
          variante: prod?.variante || '-',
          precio: prod?.precio || 0,
          codigoBarra: prod?.codigoBarra || '-',
          perecedero: prod?.perecedero || false,
          unidadMedida: prod?.unidadMedida || '-',
          cantidad: item.cantidad || 0
        };
      });
      return {
        _id: venta._id,
        productos,
        total: venta.total,
        fecha: venta.fecha,
        identificacionCliente: venta.identificacionCliente,
        codigoBarraVenta: venta.codigoBarraVenta,
        numeroCuenta: venta.numeroCuenta
      };
    });
    res.json({ ok: true, venta: ventasConDetalles });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener ventas', error });
  }
};

const obtenerVentaPorCodigoBarras = async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    const venta = await Venta.findOne({ codigoBarraVenta: codigoBarras }).populate('productos.producto');
    if (!venta) {
      return res.status(404).json({ ok: false, msg: 'Venta no encontrada' });
    }
    // Map snapshot igual que en obtenerVentas
    const productos = venta.productos.map(item => {
      const prod = item.producto;
      return {
        nombre: prod?.nombre || '-',
        categoria: prod?.categoria || '-',
        tipo: prod?.tipo || '-',
        subtipo: prod?.subtipo || '-',
        variante: prod?.variante || '-',
        precio: prod?.precio || 0,
        codigoBarra: prod?.codigoBarra || '-',
        perecedero: prod?.perecedero || false,
        unidadMedida: prod?.unidadMedida || '-',
        cantidad: item.cantidad || 0
      };
    });
    const ventaDetalle = {
      _id: venta._id,
      productos,
      total: venta.total,
      fecha: venta.fecha,
      identificacionCliente: venta.identificacionCliente,
      codigoBarraVenta: venta.codigoBarraVenta,
      numeroCuenta: venta.numeroCuenta
    };
    res.json({ ok: true, venta: ventaDetalle });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al buscar venta', error });
  }
};

module.exports = {
  registrarVenta,
  obtenerVentas,
  obtenerVentaPorCodigoBarras
};
