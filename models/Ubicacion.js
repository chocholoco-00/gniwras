const { Schema, model, Types } = require('mongoose');

const UbicacionSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  padre: {
    type: Types.ObjectId,
    ref: 'Ubicacion',
    default: null
  },
  hijos: [{
    type: Types.ObjectId,
    ref: 'Ubicacion',
    default: []
  }],
  cantMin: {
    type: Number,
    default: null
  },
  cantMax: {
    type: Number,
    default: null
  }
}, { timestamps: true });

module.exports = model('Ubicacion', UbicacionSchema);
