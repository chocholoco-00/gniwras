const { Schema, model } = require('mongoose');

const StockSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    // unique: true // <-- Elimina o comenta esta línea
  },
  codigoBarras: {
    type: Number,
    // unique: true, // <-- QUITAR RESTRICCIÓN DE UNICIDAD
    required: true
  },
  ubicacion: { type: String },
  expira: { type: Date },
  cantidad: { type: Number, required: true, min: 0 }
});

module.exports = model('Stock', StockSchema);
