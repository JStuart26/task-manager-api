const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Learn Express basics",
    completed: false
  },
  {
    id: 2,
    title: "Build my first Task Manager API",
    completed: false
  }
];

app.get("/", (request, response) => {
  response.send("Task Manager API is running");
});

app.get("/tasks", (request, response) => {
  response.json(tasks);
});

app.get("/tasks/:id", (request, response) => {
  const taskId = Number(request.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return response.status(404).json({
      error: "Task not found"
    });
  }

  response.json(task);
});

app.post("/tasks", (request, response) => {
  const newTask = {
    id: tasks.length + 1,
    title: request.body.title,
    completed: false
  };

  tasks.push(newTask);

  response.status(201).json(newTask);
});

app.put("/tasks/:id", (request, response) => {
  const taskId = Number(request.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return response.status(404).json({
      error: "Task not found"
    });
  }

  task.title = request.body.title ?? task.title;
  task.completed = request.body.completed ?? task.completed;

  response.json(task);
});

app.delete("/tasks/:id", (request, response) => {
  const taskId = Number(request.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return response.status(404).json({
      error: "Task not found"
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  response.json({
    message: "Task deleted",
    task: deletedTask[0]
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task Manager API listening on port ${PORT}`);
});
