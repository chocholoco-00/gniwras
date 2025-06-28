const { Schema, model } = require('mongoose');

const ProductoVentaSchema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
}, { _id: false });

const VentaSchema = new Schema({
  productos: [ProductoVentaSchema],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  identificacionCliente: { type: String },
  codigoBarraVenta: { type: String, required: true },
  numeroCuenta: { type: Number, required: true },
  anulada: { type: Boolean, default: false },
  anuladaPor: { type: String }, // usuario que anula
  fechaAnulacion: { type: Date },
});

module.exports = model('Venta', VentaSchema);
