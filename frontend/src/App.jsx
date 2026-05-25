import { useState, useEffect } from "react";
import api from "./services/api";

// ── Constantes de color ────────────────────────────────────
const C = {
  primary: "#1a56db",
  primaryDark: "#1e40af",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray600: "#4b5563",
  gray800: "#1f2937",
  green: "#16a34a",   greenBg: "#dcfce7",
  red: "#dc2626",     redBg: "#fee2e2",
  amber: "#d97706",   amberBg: "#fef3c7",
  blue: "#2563eb",    blueBg: "#dbeafe",
};

// ── Helpers ────────────────────────────────────────────────
const fmtFecha = (iso) => iso ? new Date(iso).toLocaleDateString("es-CO") : "-";

const Badge = ({ status }) => {
  const map = {
    disponible:    { bg: C.greenBg,  color: C.green,  label: "Disponible" },
    no_disponible: { bg: C.redBg,    color: C.red,    label: "No disponible" },
    pendiente:     { bg: C.amberBg,  color: C.amber,  label: "Pendiente" },
    aprobado:      { bg: C.greenBg,  color: C.green,  label: "Aprobado" },
    rechazado:     { bg: C.redBg,    color: C.red,    label: "Rechazado" },
    devuelto:      { bg: C.blueBg,   color: C.blue,   label: "Devuelto" },
  };
  const s = map[status] || { bg: C.gray100, color: C.gray600, label: status };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px",
      borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const Btn = ({ children, onClick, disabled, color = C.primary, outline, style = {} }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ padding: "9px 18px", background: outline ? "transparent" : color,
      color: outline ? color : "#fff", border: `2px solid ${color}`, borderRadius: 8,
      cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14,
      opacity: disabled ? 0.6 : 1, ...style }}>
    {children}
  </button>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", marginBottom: 4, fontWeight: 600,
      fontSize: 13, color: C.gray800 }}>{label}</label>}
    <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8,
      border: `1px solid ${C.gray200}`, boxSizing: "border-box", fontSize: 14 }} {...props} />
  </div>
);

// ── Login / Registro ───────────────────────────────────────
function LoginPage({ onLogin }) {
  const [modo, setModo] = useState("login"); // login | registro
  const [form, setForm] = useState({ nombre: "", correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    if (modo === "login" && (!form.correo || !form.password)) {
      return setError("Completa todos los campos");
    }
    if (modo === "registro" && (!form.nombre || !form.correo || !form.password)) {
      return setError("Completa todos los campos");
    }
    setLoading(true);
    try {
      const res = modo === "login"
        ? await api.login({ correo: form.correo, password: form.password })
        : await api.registro(form);

      if (modo === "registro") {
        setModo("login");
        setError("✅ Cuenta creada. Inicia sesión.");
        return;
      }
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("usuario", JSON.stringify(res.usuario));
        onLogin(res.usuario);
      } else {
        setError(res.mensaje || "Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", minHeight: "100vh" }}>
      <div style={{ flex: 1, minWidth: 300, background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`,
        display: "flex", justifyContent: "center", alignItems: "center", padding: 40,
        color: "#fff", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 80 }}>💻📽️📷</div>
          <h1 style={{ margin: "16px 0 8px" }}>Sistema de Préstamo</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Universidad · Laboratorios</p>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 420, padding: 40, boxSizing: "border-box",
        display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <h2 style={{ marginBottom: 24 }}>
            {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          {modo === "registro" && (
            <Input label="Nombre completo" value={form.nombre} onChange={set("nombre")} placeholder="Tu nombre" />
          )}
          <Input label="Correo" type="email" value={form.correo} onChange={set("correo")} placeholder="correo@ejemplo.com" />
          <Input label="Contraseña" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />

          {error && (
            <p style={{ color: error.startsWith("✅") ? C.green : C.red,
              fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <Btn onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginBottom: 12 }}>
            {loading ? "Cargando..." : modo === "login" ? "Ingresar" : "Registrarse"}
          </Btn>

          <p style={{ textAlign: "center", fontSize: 13, color: C.gray600 }}>
            {modo === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); }}
              style={{ color: C.primary, background: "none", border: "none",
                cursor: "pointer", fontWeight: 600 }}>
              {modo === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────
function Sidebar({ page, setPage, logout, esAdmin }) {
  const links = [
    { id: "dashboard",       label: "Inicio",       icon: "🏠" },
    { id: "equipos",         label: "Equipos",      icon: "💻" },
    { id: "mis-solicitudes", label: "Mis solicitudes", icon: "📋" },
    ...(esAdmin ? [{ id: "admin", label: "Panel Admin", icon: "🛡️" }] : []),
  ];

  return (
    <div style={{ width: 220, minWidth: 220, background: C.white,
      borderRight: `1px solid ${C.gray200}`, display: "flex",
      flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ padding: "20px 20px 12px" }}>
        <h2 style={{ margin: 0, color: C.primary, fontSize: 18 }}>🖥️ Préstamos</h2>
        {esAdmin && <p style={{ margin: "4px 0 0", fontSize: 11, color: C.amber, fontWeight: 600 }}>ADMINISTRADOR</p>}
      </div>
      <nav style={{ padding: "8px 10px", flex: 1 }}>
        {links.map((l) => (
          <button key={l.id} onClick={() => setPage(l.id)}
            style={{ width: "100%", marginBottom: 4, padding: "11px 12px", borderRadius: 8,
              border: "none", cursor: "pointer", textAlign: "left",
              background: page === l.id ? C.blueBg : "transparent",
              color: page === l.id ? C.primary : C.gray600,
              fontWeight: 600, fontSize: 14 }}>
            {l.icon} {l.label}
          </button>
        ))}
      </nav>
      <button onClick={logout} style={{ margin: 10, padding: 12, borderRadius: 8, border: "none",
        cursor: "pointer", background: C.red, color: "#fff", fontWeight: 700 }}>
        Cerrar sesión
      </button>
    </div>
  );
}

const TopBar = ({ title, subtitle, usuario }) => (
  <div style={{ padding: "20px 28px 14px", borderBottom: `1px solid ${C.gray200}`,
    background: C.white, display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: 12 }}>
    <div>
      <h2 style={{ margin: 0, color: C.gray800 }}>{title}</h2>
      <p style={{ margin: 0, color: C.gray400, fontSize: 13 }}>{subtitle}</p>
    </div>
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.primary,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
      {usuario?.nombre?.slice(0, 2).toUpperCase() || "US"}
    </div>
  </div>
);

// ── Dashboard ──────────────────────────────────────────────
function DashboardPage({ setPage, usuario, solicitudes }) {
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aprobadas  = solicitudes.filter((s) => s.estado === "aprobado").length;

  const tarjetas = [
    { icon: "💻", titulo: "Equipos", desc: "Consulta los equipos disponibles y solicita préstamos.", accion: "Ver equipos", page: "equipos" },
    { icon: "📋", titulo: "Mis solicitudes", desc: "Revisa el estado de tus solicitudes de préstamo.", accion: "Ver solicitudes", page: "mis-solicitudes" },
  ];

  return (
    <div style={{ flex: 1, background: C.gray50 }}>
      <TopBar title={`Hola, ${usuario?.nombre?.split(" ")[0]} 👋`}
        subtitle="Sistema de préstamo de equipos" usuario={usuario} />
      <div style={{ padding: "clamp(16px,4vw,28px)" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Pendientes",  value: pendientes, bg: C.amberBg, color: C.amber },
            { label: "Aprobadas",   value: aprobadas,  bg: C.greenBg, color: C.green },
            { label: "Total",       value: solicitudes.length, bg: C.blueBg, color: C.blue },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px 24px", minWidth: 120 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 20 }}>
          {tarjetas.map((t) => (
            <div key={t.page} style={{ background: C.white, padding: 24, borderRadius: 12,
              border: `1px solid ${C.gray200}` }}>
              <h3 style={{ margin: "0 0 8px" }}>{t.icon} {t.titulo}</h3>
              <p style={{ margin: "0 0 16px", color: C.gray600, fontSize: 14 }}>{t.desc}</p>
              <Btn onClick={() => setPage(t.page)}>{t.accion}</Btn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Equipos ────────────────────────────────────────────────
function EquiposPage({ usuario }) {
  const [equipos,  setEquipos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // equipo seleccionado
  const [form,     setForm]     = useState({ fecha_prestamo: "", fecha_devolucion: "", motivo: "" });
  const [enviando, setEnviando] = useState(false);
  const [mensaje,  setMensaje]  = useState("");

  useEffect(() => {
    api.getEquipos()
      .then(setEquipos)
      .catch(() => setMensaje("Error al cargar equipos"))
      .finally(() => setLoading(false));
  }, []);

  const enviarSolicitud = async () => {
    if (!form.fecha_prestamo || !form.fecha_devolucion) {
      return setMensaje("Selecciona las fechas");
    }
    setEnviando(true);
    setMensaje("");
    try {
      const res = await api.crearSolicitud({
        equipo_id: modal.id,
        fecha_prestamo: form.fecha_prestamo,
        fecha_devolucion: form.fecha_devolucion,
        motivo: form.motivo,
      });
      if (res.id) {
        setMensaje("✅ Solicitud enviada. El admin la revisará pronto.");
        setModal(null);
        setForm({ fecha_prestamo: "", fecha_devolucion: "", motivo: "" });
      } else {
        setMensaje(res.mensaje || "Error al enviar solicitud");
      }
    } catch {
      setMensaje("Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: C.gray600 }}>Cargando equipos…</div>;

  return (
    <div style={{ flex: 1, background: C.gray50 }}>
      <TopBar title="Equipos disponibles" subtitle="Selecciona un equipo para solicitar préstamo" usuario={usuario} />

      <div style={{ padding: "clamp(16px,4vw,28px)" }}>
        {mensaje && (
          <p style={{ color: mensaje.startsWith("✅") ? C.green : C.red,
            background: mensaje.startsWith("✅") ? C.greenBg : C.redBg,
            padding: "10px 16px", borderRadius: 8, marginBottom: 16 }}>{mensaje}</p>
        )}

        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}` }}>
          {equipos.length === 0 && (
            <p style={{ padding: 24, color: C.gray400, textAlign: "center" }}>No hay equipos registrados.</p>
          )}
          {equipos.map((eq, i) => (
            <div key={eq.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center",
              gap: 16, padding: "16px 24px",
              borderBottom: i < equipos.length - 1 ? `1px solid ${C.gray200}` : "none" }}>
              <div style={{ fontSize: 38 }}>{eq.imagen || "💻"}</div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, color: C.gray800 }}>{eq.nombre}</div>
                <div style={{ color: C.gray400, fontSize: 13 }}>{eq.tipo}</div>
                {eq.descripcion && <div style={{ color: C.gray600, fontSize: 13 }}>{eq.descripcion}</div>}
              </div>
              <Badge status={eq.estado} />
              <Btn onClick={() => { setModal(eq); setMensaje(""); }}
                disabled={eq.estado === "no_disponible"}>
                Solicitar
              </Btn>
            </div>
          ))}
        </div>
      </div>

      {/* Modal solicitud */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: C.white, borderRadius: 16, padding: 28,
            width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 4px" }}>Solicitar préstamo</h3>
            <p style={{ color: C.gray600, margin: "0 0 20px", fontSize: 14 }}>{modal.nombre}</p>

            <Input label="Fecha de préstamo" type="date" value={form.fecha_prestamo}
              onChange={(e) => setForm({ ...form, fecha_prestamo: e.target.value })}
              min={new Date().toISOString().split("T")[0]} />

            <Input label="Fecha de devolución" type="date" value={form.fecha_devolucion}
              onChange={(e) => setForm({ ...form, fecha_devolucion: e.target.value })}
              min={form.fecha_prestamo || new Date().toISOString().split("T")[0]} />

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600,
                fontSize: 13, color: C.gray800 }}>Motivo (opcional)</label>
              <textarea value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="¿Para qué necesitas el equipo?"
                rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: `1px solid ${C.gray200}`, boxSizing: "border-box",
                  fontSize: 14, resize: "vertical" }} />
            </div>

            {mensaje && <p style={{ color: C.red, fontSize: 13, marginBottom: 10 }}>{mensaje}</p>}

            <div style={{ display: "flex", gap: 10 }}>
              <Btn outline color={C.gray600} onClick={() => setModal(null)} style={{ flex: 1 }}>Cancelar</Btn>
              <Btn onClick={enviarSolicitud} disabled={enviando} style={{ flex: 1 }}>
                {enviando ? "Enviando..." : "Confirmar"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mis Solicitudes (usuario) ──────────────────────────────
function SolicitudesPage({ usuario }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    api.getSolicitudes()
      .then(setSolicitudes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: C.gray600 }}>Cargando solicitudes…</div>;

  return (
    <div style={{ flex: 1, background: C.gray50 }}>
      <TopBar title="Mis solicitudes" subtitle="Estado de tus préstamos" usuario={usuario} />
      <div style={{ padding: "clamp(16px,4vw,28px)" }}>
        <div style={{ background: C.white, borderRadius: 12,
          border: `1px solid ${C.gray200}`, overflowX: "auto" }}>
          {solicitudes.length === 0 ? (
            <p style={{ padding: 32, textAlign: "center", color: C.gray400 }}>
              No tienes solicitudes aún. ¡Ve a Equipos para hacer tu primera solicitud!
            </p>
          ) : (
            <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse" }}>
              <thead style={{ background: C.gray50 }}>
                <tr>
                  {["Equipo", "Préstamo", "Devolución", "Motivo", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left",
                      fontSize: 12, fontWeight: 700, color: C.gray600, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${C.gray200}` }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{s.equipo_imagen} {s.equipo_nombre}</div>
                      <div style={{ fontSize: 12, color: C.gray400 }}>{s.equipo_tipo}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>{fmtFecha(s.fecha_prestamo)}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>{fmtFecha(s.fecha_devolucion)}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.gray600, maxWidth: 180 }}>
                      {s.motivo || "-"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge status={s.estado} />
                      {s.nota_admin && (
                        <div style={{ fontSize: 11, color: C.gray600, marginTop: 4 }}>
                          📝 {s.nota_admin}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Panel Admin ────────────────────────────────────────────
function AdminPage({ usuario }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filtro,      setFiltro]      = useState("todos");
  const [nota,        setNota]        = useState({});
  const [procesando,  setProcesando]  = useState(null);

  const cargar = () => {
    setLoading(true);
    api.getSolicitudes()
      .then(setSolicitudes)
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const cambiarEstado = async (id, estado) => {
    setProcesando(id + estado);
    try {
      const res = await api.actualizarEstado(id, { estado, nota_admin: nota[id] || null });
      if (res.id) cargar();
    } finally {
      setProcesando(null);
    }
  };

  const filtradas = filtro === "todos"
    ? solicitudes
    : solicitudes.filter((s) => s.estado === filtro);

  if (loading) return <div style={{ padding: 40, color: C.gray600 }}>Cargando…</div>;

  return (
    <div style={{ flex: 1, background: C.gray50 }}>
      <TopBar title="Panel de administración" subtitle="Gestiona todas las solicitudes" usuario={usuario} />

      <div style={{ padding: "clamp(16px,4vw,28px)" }}>
        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["todos", "pendiente", "aprobado", "rechazado", "devuelto"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ padding: "7px 16px", borderRadius: 20, border: `2px solid ${C.primary}`,
                background: filtro === f ? C.primary : "transparent",
                color: filtro === f ? "#fff" : C.primary,
                cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>
              {f === "todos" ? "Todas" : f}
              {f !== "todos" && (
                <span style={{ marginLeft: 6, background: "rgba(255,255,255,0.3)",
                  borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>
                  {solicitudes.filter((s) => s.estado === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtradas.length === 0 && (
            <p style={{ textAlign: "center", color: C.gray400, padding: 32 }}>
              No hay solicitudes {filtro !== "todos" ? `con estado "${filtro}"` : ""}.
            </p>
          )}
          {filtradas.map((s) => (
            <div key={s.id} style={{ background: C.white, borderRadius: 12,
              border: `1px solid ${C.gray200}`, padding: 20 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {s.equipo_imagen} {s.equipo_nombre}
                  </div>
                  <div style={{ color: C.gray600, fontSize: 13 }}>
                    👤 {s.usuario_nombre} · {s.usuario_correo}
                  </div>
                  <div style={{ color: C.gray600, fontSize: 13, marginTop: 2 }}>
                    📅 {fmtFecha(s.fecha_prestamo)} → {fmtFecha(s.fecha_devolucion)}
                  </div>
                  {s.motivo && (
                    <div style={{ color: C.gray600, fontSize: 13, marginTop: 2 }}>
                      📝 {s.motivo}
                    </div>
                  )}
                </div>
                <Badge status={s.estado} />
              </div>

              {s.estado === "pendiente" && (
                <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: 14 }}>
                  <input placeholder="Nota para el usuario (opcional)"
                    value={nota[s.id] || ""}
                    onChange={(e) => setNota({ ...nota, [s.id]: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8,
                      border: `1px solid ${C.gray200}`, boxSizing: "border-box",
                      fontSize: 13, marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Btn onClick={() => cambiarEstado(s.id, "aprobado")}
                      disabled={procesando === s.id + "aprobado"} color={C.green}>
                      ✅ Aprobar
                    </Btn>
                    <Btn onClick={() => cambiarEstado(s.id, "rechazado")}
                      disabled={procesando === s.id + "rechazado"} color={C.red}>
                      ❌ Rechazar
                    </Btn>
                  </div>
                </div>
              )}

              {s.estado === "aprobado" && (
                <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: 14 }}>
                  <Btn onClick={() => cambiarEstado(s.id, "devuelto")}
                    disabled={procesando === s.id + "devuelto"} color={C.blue}>
                    📦 Marcar como devuelto
                  </Btn>
                </div>
              )}

              {s.nota_admin && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: C.gray50,
                  borderRadius: 8, fontSize: 13, color: C.gray600 }}>
                  📌 Nota admin: {s.nota_admin}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App principal ──────────────────────────────────────────
export default function App() {
  const [usuario,  setUsuario]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuario")); } catch { return null; }
  });
  const [page,         setPage]         = useState("dashboard");
  const [solicitudes,  setSolicitudes]  = useState([]);

  const esAdmin = usuario?.rol === "admin";

  useEffect(() => {
    if (usuario) {
      api.getSolicitudes().then(setSolicitudes).catch(() => {});
    }
  }, [usuario]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setPage("dashboard");
  };

  if (!usuario) {
    return <LoginPage onLogin={(u) => { setUsuario(u); }} />;
  }

  const renderPage = () => {
    switch (page) {
      case "equipos":         return <EquiposPage usuario={usuario} />;
      case "mis-solicitudes": return <SolicitudesPage usuario={usuario} />;
      case "admin":           return esAdmin ? <AdminPage usuario={usuario} /> : null;
      default:                return <DashboardPage setPage={setPage} usuario={usuario} solicitudes={solicitudes} />;
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "system-ui, -apple-system, sans-serif",
      minHeight: "100vh", background: C.gray50 }}>
      <Sidebar page={page} setPage={setPage} logout={logout} esAdmin={esAdmin} />
      {renderPage()}
    </div>
  );
}
