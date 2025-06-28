const { Schema, model } = require('mongoose');

const CompraSchema = new Schema({
  proveedor: { type: String, required: true },
  productos: [
    {
      producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true },
      precioUnitario: { type: Number, required: true },
      loteProveedor: { type: String, required: false }, // Lote del proveedor (opcional)
      codigoBarrasLote: { type: String, required: true }, // Código de barras/lote local (obligatorio)
      fechaVencimiento: { type: Date, required: false } // Fecha de vencimiento (opcional)
    }
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  observaciones: { type: String },
  codigoBarraCompra: { type: String, required: true },
  numeroCuenta: { type: Number, required: true }
});

module.exports = model('Compra', CompraSchema);
