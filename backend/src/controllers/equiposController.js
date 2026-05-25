const pool = require("../config/db");

const obtenerEquipos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipos ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error obtenerEquipos:", error);
    res.status(500).json({ mensaje: "Error al obtener equipos" });
  }
};

const crearEquipo = async (req, res) => {
  try {
    const { nombre, tipo, descripcion, imagen, estado } = req.body;
    if (!nombre || !tipo) {
      return res.status(400).json({ mensaje: "Nombre y tipo son requeridos" });
    }
    const result = await pool.query(
      `INSERT INTO equipos (nombre, tipo, descripcion, imagen, estado)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, tipo, descripcion || null, imagen || "💻", estado || "disponible"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error crearEquipo:", error);
    res.status(500).json({ mensaje: "Error al crear equipo" });
  }
};

const editarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, descripcion, imagen, estado } = req.body;
    const result = await pool.query(
      `UPDATE equipos SET nombre=$1, tipo=$2, descripcion=$3, imagen=$4, estado=$5
       WHERE id=$6 RETURNING *`,
      [nombre, tipo, descripcion || null, imagen || "💻", estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Equipo no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error editarEquipo:", error);
    res.status(500).json({ mensaje: "Error al editar equipo" });
  }
};

const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM equipos WHERE id=$1", [id]);
    res.json({ mensaje: "Equipo eliminado" });
  } catch (error) {
    console.error("Error eliminarEquipo:", error);
    res.status(500).json({ mensaje: "Error al eliminar equipo" });
  }
};

module.exports = { obtenerEquipos, crearEquipo, editarEquipo, eliminarEquipo };
