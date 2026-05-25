const express = require("express");
const router = express.Router();
const { obtenerEquipos, crearEquipo, editarEquipo, eliminarEquipo } = require("../controllers/equiposController");
const { verificarToken, soloAdmin } = require("../middleware/auth");

router.get("/", verificarToken, obtenerEquipos);
router.post("/", verificarToken, soloAdmin, crearEquipo);
router.put("/:id", verificarToken, soloAdmin, editarEquipo);
router.delete("/:id", verificarToken, soloAdmin, eliminarEquipo);

module.exports = router;
