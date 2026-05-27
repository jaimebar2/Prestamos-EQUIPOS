const pool = require("../config/db");

const obtenerUsuariosPendientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, correo, activo, created_at FROM usuarios WHERE rol = 'usuario' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error obtenerUsuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const result = await pool.query(
      `UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id, nombre, correo, activo`,
      [activo, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizarUsuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

module.exports = { obtenerUsuariosPendientes, actualizarUsuario };
