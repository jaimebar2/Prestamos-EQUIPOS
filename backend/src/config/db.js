const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // requerido por Neon
  },
});

pool.on("connect", () => {
  console.log("✅ Conectado a Neon PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Error en pool PostgreSQL:", err);
});

module.exports = pool;
