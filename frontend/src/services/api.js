const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const api = {
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

  getEquipos: async () => {
    const res = await fetch(`${API_URL}/equipos`, { headers: headers() });
    return res.json();
  },

  crearEquipo: async (data) => {
    const res = await fetch(`${API_URL}/equipos`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  editarEquipo: async (id, data) => {
    const res = await fetch(`${API_URL}/equipos/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  eliminarEquipo: async (id) => {
    const res = await fetch(`${API_URL}/equipos/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },

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

  getUsuarios: async () => {
    const res = await fetch(`${API_URL}/usuarios`, { headers: headers() });
    return res.json();
  },

  actualizarUsuario: async (id, data) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
};

export default api;
