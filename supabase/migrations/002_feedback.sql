-- ============================================================
-- TABLA: feedback
-- ============================================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mensaje TEXT NOT NULL CHECK (char_length(mensaje) > 0 AND char_length(mensaje) <= 2000),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_todos" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "feedback_select_todos" ON feedback
  FOR SELECT USING (true);
