const { Schema, model, Types } = require('mongoose');

const ProductoEntradaSchema = new Schema({
  producto: { type: Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true },
  loteProveedor: { type: String, required: false }, // Lote del proveedor (opcional)
  codigoBarrasLote: { type: String, required: true }, // Código de barras/lote local (obligatorio)
  fechaVencimiento: { type: Date, required: false } // Fecha de vencimiento (opcional)
}, { _id: true });

const OtrasEntradaSchema = new Schema({
  proveedor: { type: String, required: true },
  productos: { type: [ProductoEntradaSchema], required: true },
  total: { type: Number, required: true },
  observaciones: { type: String },
  codigoBarraEntrada: { type: String, required: true, unique: true },
  numeroCuenta: { type: Number },
  fecha: { type: Date, default: Date.now },
  anulada: { type: Boolean, default: false },
  motivo: { type: String, required: true } // Motivo de la entrada (obligatorio para otras entradas)
});

module.exports = model('OtrasEntrada', OtrasEntradaSchema);
