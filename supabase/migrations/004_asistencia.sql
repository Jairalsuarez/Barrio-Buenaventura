ALTER TABLE acontecimientos ADD COLUMN descripcion TEXT CHECK (descripcion IS NULL OR char_length(descripcion) <= 1000);

CREATE TABLE asistencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acontecimiento_id UUID NOT NULL REFERENCES acontecimientos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  asistira BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(acontecimiento_id, usuario_id)
);

ALTER TABLE asistencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asistencia_insert" ON asistencia
  FOR INSERT WITH CHECK (true);

CREATE POLICY "asistencia_select" ON asistencia
  FOR SELECT USING (true);

CREATE POLICY "asistencia_update" ON asistencia
  FOR UPDATE USING (true) WITH CHECK (true);
