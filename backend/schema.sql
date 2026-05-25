-- =============================================
-- ESQUEMA BASE DE DATOS - Sistema de Préstamos
-- Ejecutar en Neon PostgreSQL
-- =============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(10) DEFAULT '💻',
  estado VARCHAR(30) NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'no_disponible')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  equipo_id INTEGER NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
  fecha_prestamo DATE NOT NULL,
  fecha_devolucion DATE NOT NULL,
  motivo TEXT,
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'devuelto')),
  nota_admin TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Admin por defecto: admin@prestamos.com / admin123
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
  ('Administrador', 'admin@prestamos.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (correo) DO NOTHING;

-- Equipos de ejemplo
INSERT INTO equipos (nombre, tipo, descripcion, imagen, estado) VALUES
  ('Laptop Dell Inspiron 15', 'Laptop', 'Laptop para trabajo y presentaciones', '💻', 'disponible'),
  ('Proyector Epson X2000', 'Proyector', 'Proyector Full HD para aulas', '📽️', 'disponible'),
  ('Cámara Canon EOS 200D', 'Cámara', 'Cámara réflex para eventos', '📷', 'disponible'),
  ('Cable HDMI 5m', 'Accesorio', 'Cable HDMI de alta velocidad', '🔌', 'disponible'),
  ('Micrófono Blue Yeti', 'Audio', 'Micrófono USB para grabaciones', '🎙️', 'disponible')
ON CONFLICT DO NOTHING;
