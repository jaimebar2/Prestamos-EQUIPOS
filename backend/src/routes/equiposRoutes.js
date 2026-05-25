const express = require("express");
const router = express.Router();
const { obtenerEquipos } = require("../controllers/equiposController");
const { verificarToken } = require("../middleware/auth");

router.get("/", verificarToken, obtenerEquipos);

module.exports = router;
