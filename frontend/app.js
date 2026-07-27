const API_URL = `${window.location.protocol}//${window.location.hostname}:3001`;

function showMessage(text) {
  const message = document.querySelector("#message");
  message.textContent = text;
}

function clearMessage() {
  const message = document.querySelector("#message");
  message.textContent = "";
}

async function loadTasks() {
  try {
    clearMessage();

    const response = await fetch(`${API_URL}/tasks`);

    if (!response.ok) {
      showMessage("Could not load tasks. Please try again.");
      return;
    }

  const tasks = await response.json();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  const taskSummary = document.querySelector("#task-summary");
  taskSummary.textContent = `Total tasks: ${totalTasks} | Completed: ${completedTasks} | Remaining: ${remainingTasks}`;
  const taskList = document.querySelector("#task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = `${task.title} - ${task.completed ? "Done" : "Not done"}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", async () => {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "DELETE"
      });
    });

    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Undo" : "Mark Done";

    completeButton.addEventListener("click", async () => {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      });

      loadTasks();
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", async () => {
      const newTitle = prompt("Edit task title:", task.title);

      if (!newTitle || newTitle.trim() === "") {
        return;
      }

      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newTitle
        })
      });

      loadTasks();
    });

    item.appendChild(taskText);
    item.appendChild(completeButton);
    item.appendChild(editButton);
    item.appendChild(deleteButton);
    taskList.appendChild(item);
  });
  } catch (error) {
    showMessage("Could not connect to the task server.");
  }
}

const form = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();

  if (title === "") {
    showMessage("Please enter a task title.");
    return;
  }

  clearMessage();

  await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title
    })
  });

  taskTitle.value = "";
  loadTasks();
});

loadTasks();
