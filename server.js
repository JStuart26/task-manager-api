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
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    response.json(result.rows);
  } catch (error) {
    response.status(500).json({
      error: "Failed to fetch tasks"
    });
  }
});

app.get("/tasks/:id", async (request, response) => {
  try {
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
  } catch (error) {
    response.status(500).json({
      error: "Failed to fetch task"
    });
  }
});

app.post("/tasks", async (request, response) => {
  try {
     if (!request.body.title || request.body.title.trim() === "") {
      return response.status(400).json({
        error: "Task title is required"
      });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, completed) VALUES ($1, false) RETURNING *",
      [request.body.title]
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({
      error: "Failed to create task"
    });
  }
});

app.put("/tasks/:id", async (request, response) => {
  try {
    const taskId = Number(request.params.id);

    if (
      request.body.title !== undefined &&
      request.body.title.trim() === ""
    ) {
      return response.status(400).json({
        error: "Task title cannot be empty"
      });
    }

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
  } catch (error) {
    response.status(500).json({
      error: "Failed to update task"
    });
  }
});

app.delete("/tasks/:id", async (request, response) => {
  try {
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
  } catch (error) {
    response.status(500).json({
      error: "Failed to delete task"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task Manager API listening on port ${PORT}`);
});
