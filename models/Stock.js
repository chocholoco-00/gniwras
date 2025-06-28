const { Schema, model } = require('mongoose');

const StockSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    // unique: true // <-- Elimina o comenta esta línea
  },
  codigoBarras: {
    type: String, // Cambiado de Number a String para coincidir con los lotes de entrada
    // unique: true, // <-- QUITAR RESTRICCIÓN DE UNICIDAD
    required: true
  },
  ubicacion: { type: String },
  expira: { type: Date },
  cantidad: { type: Number, required: true, min: 0 }
});

module.exports = model('Stock', StockSchema);
