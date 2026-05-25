const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const api = {
  // ── Auth ──────────────────────────────────────────
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  registro: async (data) => {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── Equipos ───────────────────────────────────────
  getEquipos: async () => {
    const res = await fetch(`${API_URL}/equipos`, { headers: headers() });
    return res.json();
  },

  // ── Solicitudes ───────────────────────────────────
  getSolicitudes: async () => {
    const res = await fetch(`${API_URL}/solicitudes`, { headers: headers() });
    return res.json();
  },

  crearSolicitud: async (data) => {
    const res = await fetch(`${API_URL}/solicitudes`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  actualizarEstado: async (id, data) => {
    const res = await fetch(`${API_URL}/solicitudes/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default api;
