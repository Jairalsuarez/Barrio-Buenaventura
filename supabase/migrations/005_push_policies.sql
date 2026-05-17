-- Agrega política UPDATE faltante para upsert con anon key
CREATE POLICY "push_subscriptions_update" ON push_subscriptions
  FOR UPDATE USING (true) WITH CHECK (true);
