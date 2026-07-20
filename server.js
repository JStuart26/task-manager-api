const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Task Manager API is running");
});

app.get("/tasks", async (request, response) => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
  response.json(result.rows);
});

app.get("/tasks/:id", async (request, response) => {
  const taskId = Number(request.params.id);

  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1",
    [taskId]
  );

  const task = result.rows[0];

  if (!task) {
    return response.status(404).json({
      error: "Task not found"
    });
  }

  response.json(task);
});

app.post("/tasks", async (request, response) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, completed) VALUES ($1, false) RETURNING *",
    [request.body.title]
  );

  response.status(201).json(result.rows[0]);
});

app.put("/tasks/:id", async (request, response) => {
  const taskId = Number(request.params.id);

  const result = await pool.query(
    `UPDATE tasks
     SET
       title = COALESCE($1, title),
       completed = COALESCE($2, completed)
     WHERE id = $3
     RETURNING *`,
    [request.body.title, request.body.completed, taskId]
  );

  const task = result.rows[0];

  if (!task) {
    return response.status(404).json({
      error: "Task not found"
    });
  }

  response.json(task);
});

app.delete("/tasks/:id", async (request, response) => {
  const taskId = Number(request.params.id);

  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [taskId]
  );

  const task = result.rows[0];

  if (!task) {
    return response.status(404).json({
      error: "Task not found"
    });
  }

  response.json({
    message: "Task deleted",
    task: task
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task Manager API listening on port ${PORT}`);
});
