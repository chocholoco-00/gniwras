const mongoose = require('mongoose');

const FiguraSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  radius: Number,
  color: String,
  opacity: Number,
  borderColor: String,
  borderWidth: Number,
  label: String,
  icon: String,
  text: String,
  fontSize: Number,
  fontFamily: String,
  imageUrl: String,
  svgContent: String,
  safeSvgContent: String,
  textColor: String,
  rotation: Number,
  fromId: String,
  toId: String,
  lineStyle: String
}, { _id: false });

const VisualPageSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  figuras: [FiguraSchema],
  zoom: { type: Number, default: 1 },
  width: { type: Number }, // NUEVO: ancho del área recortada
  height: { type: Number }, // NUEVO: alto del área recortada
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VisualPage', VisualPageSchema);
