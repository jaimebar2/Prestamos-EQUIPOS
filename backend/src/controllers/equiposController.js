const pool = require("../config/db");

const obtenerEquipos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM equipos ORDER BY nombre ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error obtenerEquipos:", error);
    res.status(500).json({ mensaje: "Error al obtener equipos" });
  }
};

module.exports = { obtenerEquipos };
