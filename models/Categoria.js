const { Schema, model } = require('mongoose');

const VarianteSchema = new Schema({
  variante: { type: String, required: true }
}, { _id: false });

const SubtipoSchema = new Schema({
  subtipo: { type: String, required: true },
  variantes: { type: [VarianteSchema], default: [] }
}, { _id: false });

const TipoSchema = new Schema({
  tipo: { type: String, required: true },
  subtipos: { type: [SubtipoSchema], default: [] }
}, { _id: false });

const CategoriaSchema = new Schema({
  nombre: { type: String, required: true, unique: true, trim: true, uppercase: true },
  descripcion: { type: String, trim: true },
  tipos: { type: [TipoSchema], default: [] }
}, { timestamps: true });

module.exports = model('Categoria', CategoriaSchema);