const VisualPage = require('../models/VisualPage');

// Crear una nueva página visual
exports.createVisualPage = async (req, res) => {
  try {
    const visualPage = new VisualPage(req.body);
    await visualPage.save();
    res.status(201).json(visualPage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las páginas visuales
exports.getVisualPages = async (req, res) => {
  try {
    const pages = await VisualPage.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una página visual por ID
exports.getVisualPageById = async (req, res) => {
  try {
    const page = await VisualPage.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'No encontrada' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una página visual
exports.updateVisualPage = async (req, res) => {
  try {
    const page = await VisualPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!page) return res.status(404).json({ error: 'No encontrada' });
    res.json(page);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una página visual
exports.deleteVisualPage = async (req, res) => {
  try {
    const page = await VisualPage.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ error: 'No encontrada' });
    res.json({ message: 'Eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
