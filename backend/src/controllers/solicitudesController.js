const pool = require("../config/db");

// Usuario crea solicitud
const crearSolicitud = async (req, res) => {
  try {
    const { equipo_id, fecha_prestamo, fecha_devolucion, motivo } = req.body;
    const usuario_id = req.usuario.id;

    if (!equipo_id || !fecha_prestamo || !fecha_devolucion) {
      return res.status(400).json({ mensaje: "Faltan campos requeridos" });
    }

    if (new Date(fecha_devolucion) <= new Date(fecha_prestamo)) {
      return res.status(400).json({ mensaje: "La fecha de devolución debe ser posterior al préstamo" });
    }

    // Verificar que el equipo existe y está disponible
    const equipo = await pool.query(
      "SELECT * FROM equipos WHERE id = $1",
      [equipo_id]
    );

    if (equipo.rows.length === 0) {
      return res.status(404).json({ mensaje: "Equipo no encontrado" });
    }

    if (equipo.rows[0].estado === "no_disponible") {
      return res.status(400).json({ mensaje: "El equipo no está disponible" });
    }

    const result = await pool.query(
      `INSERT INTO solicitudes (usuario_id, equipo_id, fecha_prestamo, fecha_devolucion, motivo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuario_id, equipo_id, fecha_prestamo, fecha_devolucion, motivo || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error crearSolicitud:", error);
    res.status(500).json({ mensaje: "Error al crear solicitud" });
  }
};

// Admin obtiene todas las solicitudes; usuario solo las suyas
const obtenerSolicitudes = async (req, res) => {
  try {
    const { rol, id: usuario_id } = req.usuario;

    let query;
    let params;

    if (rol === "admin") {
      query = `
        SELECT s.*, u.nombre AS usuario_nombre, u.correo AS usuario_correo,
               e.nombre AS equipo_nombre, e.tipo AS equipo_tipo, e.imagen AS equipo_imagen
        FROM solicitudes s
        INNER JOIN usuarios u ON u.id = s.usuario_id
        INNER JOIN equipos e ON e.id = s.equipo_id
        ORDER BY s.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT s.*, u.nombre AS usuario_nombre, u.correo AS usuario_correo,
               e.nombre AS equipo_nombre, e.tipo AS equipo_tipo, e.imagen AS equipo_imagen
        FROM solicitudes s
        INNER JOIN usuarios u ON u.id = s.usuario_id
        INNER JOIN equipos e ON e.id = s.equipo_id
        WHERE s.usuario_id = $1
        ORDER BY s.created_at DESC
      `;
      params = [usuario_id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error obtenerSolicitudes:", error);
    res.status(500).json({ mensaje: "Error al obtener solicitudes" });
  }
};

// Admin aprueba o rechaza una solicitud
const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, nota_admin } = req.body;

    const estadosValidos = ["aprobado", "rechazado", "devuelto"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: "Estado no válido" });
    }

    const result = await pool.query(
      `UPDATE solicitudes
       SET estado = $1, nota_admin = $2
       WHERE id = $3
       RETURNING *`,
      [estado, nota_admin || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizarEstado:", error);
    res.status(500).json({ mensaje: "Error al actualizar solicitud" });
  }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstado };
