const OtrasSalida = require('../models/OtrasSalida');
const Stock = require('../models/Stock');

// Crear una nueva salida
exports.crearOtrasSalida = async (req, res) => {
  try {
    // Obtener el último numeroCuenta registrado
    const ultimaSalida = await OtrasSalida.findOne({}, {}, { sort: { numeroCuenta: -1 } });
    const siguienteNumero = ultimaSalida && ultimaSalida.numeroCuenta ? ultimaSalida.numeroCuenta + 1 : 1;
    req.body.numeroCuenta = siguienteNumero;

    // Descontar stock FIFO para cada producto
    for (const prod of req.body.productos) {
      let cantidadRestante = prod.cantidad;
      // Buscar lotes FIFO para el producto
      const stocks = await Stock.find({
        producto: prod.producto,
        cantidad: { $gt: 0 }
      }).sort({ expira: 1, _id: 1 });
      for (const stock of stocks) {
        if (cantidadRestante <= 0) break;
        const cantidadADescontar = Math.min(stock.cantidad, cantidadRestante);
        if (stock.cantidad - cantidadADescontar > 0) {
          await Stock.findByIdAndUpdate(stock._id, { $inc: { cantidad: -cantidadADescontar } });
        } else {
          await Stock.findByIdAndDelete(stock._id);
        }
        cantidadRestante -= cantidadADescontar;
      }
      if (cantidadRestante > 0) {
        return res.status(400).json({ error: `Stock insuficiente para el producto ${prod.producto}` });
      }
    }

    const salida = new OtrasSalida(req.body);
    await salida.save();
    res.status(201).json(salida);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todas las salidas
exports.listarOtrasSalidas = async (req, res) => {
  try {
    const salidas = await OtrasSalida.find();
    res.json(salidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
