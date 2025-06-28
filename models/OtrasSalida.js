const { Schema, model, Types } = require('mongoose');

const ProductoSalidaSchema = new Schema({
  producto: { type: Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number },
  motivo: { type: String, required: true } // Ahora motivo es obligatorio
}, { _id: true });

const OtrasSalidaSchema = new Schema({
  productos: { type: [ProductoSalidaSchema], required: true },
  total: { type: Number, required: true },
  descripcion: { type: String },
  identificacionCliente: { type: String },
  codigoBarraSalida: { type: String, required: true, unique: true },
  numeroCuenta: { type: Number, required: true },
  anulada: { type: Boolean, default: false },
  fecha: { type: Date, required: true }
});

module.exports = model('OtrasSalida', OtrasSalidaSchema);