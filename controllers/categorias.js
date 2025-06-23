const Categoria = require('../models/Categoria');

const upsertCategoria = async (req, res) => {
  try {
    const { _id, nombre, descripcion, tipos } = req.body;
    let categoria;
    if (_id) {
      categoria = await Categoria.findByIdAndUpdate(
        _id,
        { nombre, descripcion, tipos },
        { new: true, runValidators: true }
      );
      if (!categoria) return res.status(404).json({ ok: false, msg: 'Categoría no encontrada' });
    } else {
      categoria = new Categoria({ nombre, descripcion, tipos });
      await categoria.save();
    }
    return res.status(200).json({ ok: true, categoria });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: 'Error en el servidor', error });
  }
};

const agregarTipo = async (req, res) => {
  const { categoriaId, tipo } = req.body;
  try {
    const categoria = await Categoria.findById(categoriaId);
    if (!categoria) return res.status(404).json({ ok: false, msg: 'Categoría no encontrada' });
    if (categoria.tipos.some(t => t.tipo === tipo)) {
      return res.status(400).json({ ok: false, msg: 'El tipo ya existe' });
    }
    categoria.tipos.push({ tipo, subtipos: [] });
    await categoria.save();
    res.json({ ok: true, categoria });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const agregarSubtipo = async (req, res) => {
  const { categoriaId, tipo, subtipo } = req.body;
  try {
    const categoria = await Categoria.findById(categoriaId);
    if (!categoria) return res.status(404).json({ ok: false, msg: 'Categoría no encontrada' });
    const tipoObj = categoria.tipos.find(t => t.tipo === tipo);
    if (!tipoObj) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
    if (tipoObj.subtipos.some(s => s.subtipo === subtipo)) {
      return res.status(400).json({ ok: false, msg: 'El subtipo ya existe' });
    }
    tipoObj.subtipos.push({ subtipo, variantes: [] });
    await categoria.save();
    res.json({ ok: true, categoria });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const agregarVariante = async (req, res) => {
  const { categoriaId, tipo, subtipo, variante } = req.body;
  try {
    const categoria = await Categoria.findById(categoriaId);
    if (!categoria) return res.status(404).json({ ok: false, msg: 'Categoría no encontrada' });
    const tipoObj = categoria.tipos.find(t => t.tipo === tipo);
    if (!tipoObj) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
    const subtipoObj = tipoObj.subtipos.find(s => s.subtipo === subtipo);
    if (!subtipoObj) return res.status(404).json({ ok: false, msg: 'Subtipo no encontrado' });
    if (subtipoObj.variantes.some(v => v.variante === variante)) {
      return res.status(400).json({ ok: false, msg: 'La variante ya existe' });
    }
    subtipoObj.variantes.push({ variante });
    await categoria.save();
    res.json({ ok: true, categoria });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

module.exports = {
  upsertCategoria,
  agregarTipo,
  agregarSubtipo,
  agregarVariante
};
