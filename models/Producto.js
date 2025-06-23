const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String, required: true },
  tipo: { type: String, required: true },
  subtipo: { type: String },
  variante: { type: String },
  codigoBarra: { type: Number },
  precio: { type: Number, required: true },
  perecedero: { type: Boolean, default: false },
  unidadMedida: { type: String, required: true },
  Cantmin: { type: Number, default: 0 }, // Campo plano, no anidado
  Cantmax: { type: Number, default: 0 }  // Campo plano, no anidado
});

module.exports = model('Producto', ProductoSchema);
