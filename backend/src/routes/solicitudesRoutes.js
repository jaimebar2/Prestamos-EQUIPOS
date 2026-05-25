const express = require("express");
const router = express.Router();
const { crearSolicitud, obtenerSolicitudes, actualizarEstado } = require("../controllers/solicitudesController");
const { verificarToken, soloAdmin } = require("../middleware/auth");

// Todos los autenticados pueden crear y ver sus solicitudes
router.post("/", verificarToken, crearSolicitud);
router.get("/", verificarToken, obtenerSolicitudes);

// Solo admin puede cambiar el estado
router.put("/:id", verificarToken, soloAdmin, actualizarEstado);

module.exports = router;
