CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO tasks (title, completed)
VALUES
  ('Learn Express basics', false),
  ('Connect API to PostgreSQL', false)
ON CONFLICT DO NOTHING;
