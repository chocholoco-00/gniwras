const { Schema, model, Types } = require('mongoose');

const ProductoVentaSchema = new Schema({
  producto: { type: Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
}, { _id: true });

const OtrasVentaSchema = new Schema({
  productos: { type: [ProductoVentaSchema], required: true },
  total: { type: Number, required: true },
  codigoBarraSalida: { type: String, required: true },
  numeroCuenta: { type: Number },
  anulada: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now }
});

module.exports = model('OtrasVenta', OtrasVentaSchema);
