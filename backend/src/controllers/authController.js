const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });

    const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
    if (result.rows.length === 0) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    const usuario = result.rows[0];
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Verificar si está aprobado
    if (!usuario.activo) {
      return res.status(403).json({ mensaje: "Tu cuenta está pendiente de aprobación por el administrador." });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const registro = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ mensaje: "Todos los campos son requeridos" });

    const existe = await pool.query("SELECT id FROM usuarios WHERE correo = $1", [correo]);
    if (existe.rows.length > 0) return res.status(400).json({ mensaje: "El correo ya está registrado" });

    const hash = await bcrypt.hash(password, 10);

    // activo = false hasta que el admin apruebe
    await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, rol, activo) VALUES ($1, $2, $3, 'usuario', false)`,
      [nombre, correo, hash]
    );

    res.status(201).json({ mensaje: "Registro exitoso. Espera que el administrador apruebe tu cuenta." });
  } catch (error) {
    console.error("Error registro:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

module.exports = { login, registro };
