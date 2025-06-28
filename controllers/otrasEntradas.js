const OtrasEntrada = require('../models/OtrasEntrada');
const Stock = require('../models/Stock');

// Función para generar un código de barras de 12 o 13 dígitos
function generarCodigoBarra() {
  // Genera un string de 12 o 13 dígitos aleatorios
  const length = Math.floor(Math.random() * 2) + 12;
  let codigo = '';
  for (let i = 0; i < length; i++) {
    codigo += Math.floor(Math.random() * 10);
  }
  return codigo;
}

exports.generarCodigoBarra = (req, res) => {
  res.json({ codigoBarra: generarCodigoBarra() });
};

// Crear una nueva entrada
exports.crearOtrasEntrada = async (req, res) => {
  try {
    if (!req.body.motivo || typeof req.body.motivo !== 'string' || !req.body.motivo.trim()) {
      return res.status(400).json({ error: 'El motivo es obligatorio para otras entradas'});
    }
    // Obtener el último numeroCuenta
    const ultimaEntrada = await OtrasEntrada.findOne({ numeroCuenta: { $ne: null } })
      .sort({ numeroCuenta: -1 })
      .select('numeroCuenta');
    const nuevoNumeroCuenta = (ultimaEntrada ? ultimaEntrada.numeroCuenta : 0) + 1;
    // Calcular total automáticamente
    const total = Array.isArray(req.body.productos)
      ? req.body.productos.reduce((acc, prod) => acc + (prod.cantidad * prod.precioUnitario), 0)
      : 0;
    const entrada = new OtrasEntrada({
      ...req.body,
      numeroCuenta: nuevoNumeroCuenta,
      total,
      codigoBarraEntrada: generarCodigoBarra()
    });
    await entrada.save();

    // Crear stock para cada producto usando el mismo codigoBarrasLote
    if (Array.isArray(entrada.productos)) {
      for (const prod of entrada.productos) {
        await Stock.create({
          producto: prod.producto._id || prod.producto,
          cantidad: prod.cantidad,
          codigoBarras: prod.codigoBarrasLote,
          expira: prod.fechaVencimiento,
          // Puedes agregar ubicacion si aplica
        });
      }
    }

    res.status(201).json(entrada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todas las entradas
exports.listarOtrasEntradas = async (req, res) => {
  try {
    const entradas = await OtrasEntrada.find();
    res.json(entradas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener el último numeroCuenta de otras entradas
exports.obtenerUltimoNumeroCuenta = async (req, res) => {
  try {
    const ultimaEntrada = await OtrasEntrada.findOne({ numeroCuenta: { $ne: null } })
      .sort({ numeroCuenta: -1 })
      .select('numeroCuenta');
    res.json({ numeroCuenta: ultimaEntrada ? ultimaEntrada.numeroCuenta : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener otra entrada por código de barras
exports.obtenerOtrasEntradaPorCodigoBarra = async (req, res) => {
  try {
    const { codigoBarra } = req.params;
    const entrada = await OtrasEntrada.findOne({ codigoBarraEntrada: codigoBarra }).populate('productos.producto');
    if (!entrada) {
      return res.status(404).json({ error: 'Otra entrada no encontrada' });
    }
    res.json(entrada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
