CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  task_status text,
  tasks_to_do text,
  created_date date
);