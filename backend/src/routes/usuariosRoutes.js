const express = require("express");
const router = express.Router();
const { obtenerUsuariosPendientes, actualizarUsuario } = require("../controllers/usuariosController");
const { verificarToken, soloAdmin } = require("../middleware/auth");

router.get("/", verificarToken, soloAdmin, obtenerUsuariosPendientes);
router.put("/:id", verificarToken, soloAdmin, actualizarUsuario);

module.exports = router;
