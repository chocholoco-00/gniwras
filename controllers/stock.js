const mongoose = require('mongoose');
const Stock = require('../models/Stock');

const crearStock = async (req, res) => {
  try {
    // Usar nombres únicos para evitar conflictos de scope
    const { producto, ubicacion: ubicacionReq, expira, cantidad, codigoBarras } = req.body;
    if (!producto || typeof producto !== 'string' || !mongoose.Types.ObjectId.isValid(producto)) {
      console.error('Error: producto no es un ObjectId válido:', producto);
      return res.status(400).json({ ok: false, msg: 'El campo producto debe ser un ObjectId válido', producto });
    }
    if (typeof cantidad !== 'number' || cantidad < 0 || !codigoBarras) {
      return res.status(400).json({ ok: false, msg: 'Datos inválidos' });
    }
    // --- NUEVA LÓGICA: Si ya existe un stock con el mismo código de barras y ubicación, sumar cantidad ---
    const existingStock = await Stock.findOne({ codigoBarras, ubicacion: ubicacionReq });
    if (existingStock) {
      existingStock.cantidad += cantidad;
      if (expira) existingStock.expira = expira; // opcional: actualizar fecha de expiración
      await existingStock.save();
      return res.status(200).json({ ok: true, stock: existingStock, merged: true });
    }
    // Si no existe, crear uno nuevo
    const stock = new Stock({ producto, ubicacion: ubicacionReq, expira, cantidad, codigoBarras });
    await stock.save();
    res.status(201).json({ ok: true, stock });
  } catch (error) {
    console.error('Error al crear stock:', error);
    res.status(500).json({ ok: false, msg: 'Error al crear stock', error: error.message || error });
  }
};

const obtenerStocks = async (req, res) => {
  try {
    const { ubicacion } = req.query;
    let query = {};
    if (ubicacion) {
      query.ubicacion = ubicacion;
    }
    // Popula el producto para que el frontend tenga los datos completos
    const stocks = await Stock.find(query).populate('producto');
    res.json({ ok: true, stocks });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener stocks', error });
  }
};

const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto, ubicacion, expira, cantidad } = req.body;
    if (typeof cantidad === 'number' && cantidad <= 0) {
      // Si la cantidad es 0 o menor, elimina el stock
      const deleted = await Stock.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ ok: false, msg: 'Stock no encontrado para eliminar' });
      }
      return res.json({ ok: true, msg: 'Stock eliminado automáticamente por cantidad 0', eliminado: deleted });
    }
    const stock = await Stock.findByIdAndUpdate(
      id,
      { producto, ubicacion, expira, cantidad },
      { new: true }
    );
    if (!stock) {
      return res.status(404).json({ ok: false, msg: 'Stock no encontrado' });
    }
    res.json({ ok: true, stock });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al actualizar stock', error });
  }
};

const eliminarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByIdAndDelete(id);
    if (!stock) {
      return res.status(404).json({ ok: false, msg: 'Stock no encontrado' });
    }
    res.json({ ok: true, msg: 'Stock eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al eliminar stock', error });
  }
};

// ASEGÚRATE de exportar obtenerStocksFIFO correctamente:
const obtenerStocksFIFO = async (req, res) => {
  try {
    const { productoId } = req.params;
    const stocks = await Stock.find({
      producto: productoId,
      cantidad: { $gt: 0 }
    }).sort({ expira: 1, _id: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json([]);
  }
};

module.exports = {
  crearStock,
  obtenerStocks,
  actualizarStock,
  eliminarStock,
  obtenerStocksFIFO // <-- debe estar presente aquí
};
