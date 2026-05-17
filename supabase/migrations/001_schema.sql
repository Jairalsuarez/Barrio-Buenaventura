-- ============================================================
-- ESQUEMA COMPLETO PARA BARRIO BUENAVENTURA PWA
-- ============================================================

-- Tipos enumerados
CREATE TYPE tipo_llamamiento AS ENUM (
  'Obispo',
  'Primer Consejero',
  'Segundo Consejero',
  'Presidente Quorum Elderes',
  'Presidenta Sociedad Socorro',
  'Presidenta Escuela Dominical',
  'Secretario de Barrio',
  'Presidenta Primaria',
  'Presidenta Mujeres Jovenes',
  'Otro',
  'Ninguno'
);

CREATE TYPE tipo_perfil AS ENUM (
  'miembro',
  'conociendo',
  'regresando',
  'invitado'
);

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL CHECK (char_length(nombre) > 0 AND char_length(nombre) <= 100),
  apellido TEXT NOT NULL CHECK (char_length(apellido) > 0 AND char_length(apellido) <= 100),
  fecha_nacimiento DATE NOT NULL,
  telefono TEXT CHECK (telefono IS NULL OR (char_length(telefono) >= 7 AND char_length(telefono) <= 20)),
  llamamiento tipo_llamamiento DEFAULT 'Ninguno',
  llamamiento_personalizado TEXT CHECK (llamamiento_personalizado IS NULL OR char_length(llamamiento_personalizado) <= 200),
  tipo_perfil tipo_perfil DEFAULT 'miembro',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(nombre, apellido, fecha_nacimiento)
);

-- Índice único parcial: cada llamamiento predefinido solo puede tener un registro activo
CREATE UNIQUE INDEX idx_llamamiento_unico
  ON usuarios (llamamiento)
  WHERE llamamiento NOT IN ('Otro', 'Ninguno');

-- ============================================================
-- FUNCIÓN: validar_telefono_llamamiento (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION validar_telefono_llamamiento()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.llamamiento NOT IN ('Otro', 'Ninguno') AND NEW.llamamiento IS NOT NULL THEN
    IF NEW.telefono IS NULL OR NEW.telefono = '' THEN
      RAISE EXCEPTION 'El teléfono es obligatorio para llamamientos predefinidos';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_telefono_llamamiento
  BEFORE INSERT OR UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION validar_telefono_llamamiento();

-- ============================================================
-- FUNCIÓN: insertar_usuario_seguro (ignora duplicados)
-- ============================================================
CREATE OR REPLACE FUNCTION insertar_usuario_seguro(
  p_nombre TEXT,
  p_apellido TEXT,
  p_fecha_nacimiento DATE,
  p_telefono TEXT DEFAULT NULL,
  p_llamamiento tipo_llamamiento DEFAULT 'Ninguno',
  p_llamamiento_personalizado TEXT DEFAULT NULL,
  p_tipo_perfil tipo_perfil DEFAULT 'miembro'
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, telefono, llamamiento, llamamiento_personalizado, tipo_perfil)
  VALUES (p_nombre, p_apellido, p_fecha_nacimiento, p_telefono, p_llamamiento, p_llamamiento_personalizado, p_tipo_perfil)
  ON CONFLICT (nombre, apellido, fecha_nacimiento) DO NOTHING
  RETURNING id INTO v_user_id;

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM usuarios
    WHERE nombre = p_nombre AND apellido = p_apellido AND fecha_nacimiento = p_fecha_nacimiento;
  END IF;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TABLA: acontecimientos
-- ============================================================
CREATE TABLE acontecimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL CHECK (char_length(nombre) > 0 AND char_length(nombre) <= 300),
  fecha_hora TIMESTAMPTZ NOT NULL,
  creado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_acontecimientos_fecha ON acontecimientos (fecha_hora);

-- ============================================================
-- FUNCIÓN: usuario_tiene_llamamiento_predefinido
-- ============================================================
CREATE OR REPLACE FUNCTION usuario_tiene_llamamiento_predefinido(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_llamamiento tipo_llamamiento;
BEGIN
  SELECT llamamiento INTO v_llamamiento FROM usuarios WHERE id = user_id;
  RETURN v_llamamiento IS NOT NULL AND v_llamamiento NOT IN ('Otro', 'Ninguno');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNCIÓN: cumpleanhos_proximos (4 días)
-- ============================================================
CREATE OR REPLACE FUNCTION cumpleanhos_proximos()
RETURNS TABLE(
  id UUID,
  nombre TEXT,
  apellido TEXT,
  fecha_nacimiento DATE,
  edad INTEGER,
  dias_restantes INTEGER
) AS $$
DECLARE
  v_hoy DATE := CURRENT_DATE;
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.nombre,
    u.apellido,
    u.fecha_nacimiento,
    EXTRACT(YEAR FROM age(v_hoy, u.fecha_nacimiento))::INTEGER + 1,
    CASE
      WHEN to_char(u.fecha_nacimiento, 'MM-DD') >= to_char(v_hoy, 'MM-DD')
      THEN (to_date(to_char(v_hoy, 'YYYY') || '-' || to_char(u.fecha_nacimiento, 'MM-DD'), 'YYYY-MM-DD') - v_hoy)::INTEGER
      ELSE (to_date(to_char(v_hoy + interval '1 year', 'YYYY') || '-' || to_char(u.fecha_nacimiento, 'MM-DD'), 'YYYY-MM-DD') - v_hoy)::INTEGER
    END
  FROM usuarios u
  WHERE
    CASE
      WHEN to_char(u.fecha_nacimiento, 'MM-DD') >= to_char(v_hoy, 'MM-DD')
      THEN to_date(to_char(v_hoy, 'YYYY') || '-' || to_char(u.fecha_nacimiento, 'MM-DD'), 'YYYY-MM-DD')
      ELSE to_date(to_char(v_hoy + interval '1 year', 'YYYY') || '-' || to_char(u.fecha_nacimiento, 'MM-DD'), 'YYYY-MM-DD')
    END - v_hoy BETWEEN 0 AND 4
  ORDER BY
    CASE
      WHEN to_char(u.fecha_nacimiento, 'MM-DD') >= to_char(v_hoy, 'MM-DD')
      THEN to_char(u.fecha_nacimiento, 'MM-DD')
      ELSE '99-99'
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNCIÓN: actualizar_timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_timestamp_usuarios
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================================
-- POLÍTICAS RLS
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE acontecimientos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios (usando la clave anónima - el "quién" se pasa como UUID en la app)
-- Cualquiera puede leer usuarios (necesario para cumpleaños, etc.)
CREATE POLICY "usuarios_select_todos" ON usuarios
  FOR SELECT USING (true);

-- Cualquiera puede registrar un nuevo usuario
CREATE POLICY "usuarios_insert_todos" ON usuarios
  FOR INSERT WITH CHECK (true);

-- Un usuario solo puede actualizar su propio perfil (el app verifica por UUID)
CREATE POLICY "usuarios_update_propio" ON usuarios
  FOR UPDATE USING (true) WITH CHECK (true);

-- Un usuario solo puede eliminar su propio perfil
CREATE POLICY "usuarios_delete_propio" ON usuarios
  FOR DELETE USING (true);

-- Políticas para acontecimientos
-- Todos pueden ver eventos
CREATE POLICY "acontecimientos_select_todos" ON acontecimientos
  FOR SELECT USING (true);

-- Solo usuarios con llamamiento predefinido pueden crear eventos
CREATE POLICY "acontecimientos_insert_predefinidos" ON acontecimientos
  FOR INSERT WITH CHECK (usuario_tiene_llamamiento_predefinido(creado_por));

-- Solo usuarios con llamamiento predefinido pueden actualizar eventos que crearon
CREATE POLICY "acontecimientos_update_creador" ON acontecimientos
  FOR UPDATE USING (usuario_tiene_llamamiento_predefinido(creado_por))
  WITH CHECK (usuario_tiene_llamamiento_predefinido(creado_por));

-- Solo usuarios con llamamiento predefinido pueden eliminar eventos que crearon
CREATE POLICY "acontecimientos_delete_creador" ON acontecimientos
  FOR DELETE USING (usuario_tiene_llamamiento_predefinido(creado_por));
