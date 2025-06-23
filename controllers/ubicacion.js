const Ubicacion = require('../models/Ubicacion');

// Crear una nueva ubicación
const crearUbicacion = async (req, res) => {
  try {
    const { nombre, padre, cantMin, cantMax } = req.body;
    // Crear la ubicación con cantMin y cantMax
    const ubicacion = new Ubicacion({
      nombre,
      padre: padre || null,
      cantMin: cantMin ?? null,
      cantMax: cantMax ?? null
    });
    await ubicacion.save();

    // Si tiene padre, agregar este hijo al array de hijos del padre
    if (padre) {
      await Ubicacion.findByIdAndUpdate(padre, { $addToSet: { hijos: ubicacion._id } });
    }

    res.status(201).json({ ok: true, ubicacion });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al crear ubicación', error });
  }
};

// Obtener todas las ubicaciones (todas, no solo raíz)
const obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find().lean(); // Quita { padre: null }
    res.json({ ok: true, ubicaciones });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener ubicaciones', error });
  }
};

// Obtener una ubicación por ID
const obtenerUbicacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacion = await Ubicacion.findById(id).populate('hijos').lean();
    if (!ubicacion) return res.status(404).json({ ok: false, msg: 'Ubicación no encontrada' });
    res.json({ ok: true, ubicacion });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener ubicación', error });
  }
};

// Eliminar una ubicación (y quitar referencia en el padre)
const eliminarUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacion = await Ubicacion.findByIdAndDelete(id);
    if (!ubicacion) return res.status(404).json({ ok: false, msg: 'Ubicación no encontrada' });
    // Quitar referencia en el padre
    if (ubicacion.padre) {
      await Ubicacion.findByIdAndUpdate(ubicacion.padre, { $pull: { hijos: ubicacion._id } });
    }
    res.json({ ok: true, msg: 'Ubicación eliminada' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al eliminar ubicación', error });
  }
};

// Eliminar una ubicación y todos sus hijos recursivamente
const eliminarUbicacionYSububicaciones = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscar la ubicación
    const ubicacion = await Ubicacion.findById(id);
    if (!ubicacion) return res.status(404).json({ ok: false, msg: 'Ubicación no encontrada' });
    // Eliminar recursivamente los hijos
    async function eliminarRecursivo(nodoId) {
      const nodo = await Ubicacion.findById(nodoId);
      if (nodo && nodo.hijos && nodo.hijos.length > 0) {
        for (const hijoId of nodo.hijos) {
          await eliminarRecursivo(hijoId);
        }
      }
      await Ubicacion.findByIdAndDelete(nodoId);
    }
    await eliminarRecursivo(id);
    // Quitar referencia en el padre
    if (ubicacion.padre) {
      await Ubicacion.findByIdAndUpdate(ubicacion.padre, { $pull: { hijos: ubicacion._id } });
    }
    res.json({ ok: true, msg: 'Ubicación y sububicaciones eliminadas' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al eliminar ubicación y sububicaciones', error });
  }
};

// Cambiar el padre de una ubicación (mover nodo)
const moverUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoPadreId, nuevoNombre, cantMin, cantMax } = req.body;

    if (!id) return res.status(400).json({ ok: false, msg: 'Falta el parámetro id' });

    const ubicacion = await Ubicacion.findById(id);
    if (!ubicacion) return res.status(404).json({ ok: false, msg: 'Ubicación no encontrada' });

    // Quitar del padre anterior
    if (ubicacion.padre) {
      await Ubicacion.findByIdAndUpdate(ubicacion.padre, { $pull: { hijos: ubicacion._id } });
    }

    // Actualizar el padre
    ubicacion.padre = nuevoPadreId || null;

    // Actualizar el nombre si es diferente
    if (nuevoNombre && nuevoNombre.trim() && nuevoNombre.trim() !== ubicacion.nombre) {
      ubicacion.nombre = nuevoNombre.trim();
    }

    // Actualizar cantMin y cantMax si se envían
    if (cantMin !== undefined) ubicacion.cantMin = cantMin;
    if (cantMax !== undefined) ubicacion.cantMax = cantMax;

    await ubicacion.save();

    // Agregar al nuevo padre
    if (nuevoPadreId) {
      await Ubicacion.findByIdAndUpdate(nuevoPadreId, { $addToSet: { hijos: ubicacion._id } });
    }

    res.json({ ok: true, msg: 'Ubicación movida y datos actualizados', ubicacion });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al mover ubicación', error: error.message || error });
  }
};

// Actualizar solo el nombre de una ubicación
const actualizarNombreUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ ok: false, msg: 'El nombre es obligatorio' });
    }
    const ubicacion = await Ubicacion.findByIdAndUpdate(id, { nombre: nombre.trim() }, { new: true });
    if (!ubicacion) return res.status(404).json({ ok: false, msg: 'Ubicación no encontrada' });
    res.json({ ok: true, ubicacion });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al actualizar nombre de ubicación', error });
  }
};

module.exports = {
  crearUbicacion,
  obtenerUbicaciones,
  obtenerUbicacionPorId,
  eliminarUbicacion,
  eliminarUbicacionYSububicaciones,
  moverUbicacion,
  actualizarNombreUbicacion
};
