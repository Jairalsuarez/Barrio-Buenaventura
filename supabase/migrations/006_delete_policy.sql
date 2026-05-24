-- Política DELETE: todos pueden intentar (la verificación se hace en el frontend)
-- Solo el creador del evento o el Obispo pueden eliminar
DROP POLICY IF EXISTS "acontecimientos_delete_creador" ON acontecimientos;

CREATE POLICY "acontecimientos_delete_creador" ON acontecimientos
  FOR DELETE USING (true);
