import { getState } from "./storage-manager.js";
import { getPriorityText } from "./priority-manager.js";
import { setCurrentList, deleteList } from "./task-lists.js";
import {
  toggleTaskCompletion,
  editTask,
  deleteTask,
} from "./task-operations.js";
import { openCalendarModal } from "./calendar-integration.js";

export function renderUI() {
  renderLists();
  renderTasks();
}

function renderLists() {
  const listsContainer = document.getElementById("listsContainer");
  listsContainer.innerHTML = "";

  getState("lists").forEach((list) => {
    const listItem = document.createElement("li");
    listItem.className = `list-item ${
      getState("currentListId") === list.id ? "active" : ""
    }`;
    listItem.dataset.id = list.id;

    listItem.innerHTML = `
            <i class="material-icons">${list.icon || "list"}</i>
            <span>${list.name}</span>
        `;

    listItem.addEventListener("click", () => setCurrentList(list.id));

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    deleteButton.className = "delete-list-button";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteList(list.id);
    });

    listItem.appendChild(deleteButton);
    listsContainer.appendChild(listItem);
  });
}

function renderTasks() {
  const tasksContainer = document.getElementById("tasksContainer");
  tasksContainer.innerHTML = "";

  const currentListId = getState("currentListId");
  if (!currentListId) {
    tasksContainer.innerHTML =
      '<p style="text-align: center; color: var(--gray-color);">Nenhuma lista selecionada.</p>';
    return;
  }

  const priorityFilter = document.getElementById("priorityFilter").value;
  let tasks = getState("tasks").filter((task) => task.listId === currentListId);

  if (priorityFilter !== "all") {
    tasks = tasks.filter((task) => task.priority.toString() === priorityFilter);
  }

  tasks.sort((a, b) => a.priority - b.priority);

  if (tasks.length === 0) {
    tasksContainer.innerHTML =
      '<p style="text-align: center; color: var(--gray-color);">Nenhuma tarefa encontrada.</p>';
    return;
  }

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item priority-${task.priority} ${
      task.completed ? "completed" : ""
    }`;
    taskItem.dataset.id = task.id;

    let dueDateText = "";
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      dueDateText = dueDate.toLocaleDateString("pt-BR");
    }

    taskItem.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                ${
                  task.description
                    ? `<div class="task-description">${task.description}</div>`
                    : ""
                }
                <div style="display: flex; align-items: center; margin-top: 5px;">
                    <span class="task-priority priority-${task.priority}">
                        ${getPriorityText(task.priority)}
                    </span>
                    ${
                      dueDateText
                        ? `<span class="task-due-date"><i class="material-icons" style="font-size: 14px;">event</i> ${dueDateText}</span>`
                        : ""
                    }
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-task" title="Editar"><i class="material-icons">edit</i></button>
                <button class="delete-task" title="Excluir"><i class="material-icons">delete</i></button>
                <button class="calendar-task" title="Adicionar ao Google Calendar">
                    <i class="material-icons">event</i>
                </button>
            </div>
        `;

    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));

    const editButton = taskItem.querySelector(".edit-task");
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = taskItem.querySelector(".delete-task");
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    const calendarButton = taskItem.querySelector(".calendar-task");
    calendarButton.addEventListener("click", () => openCalendarModal(task));

    tasksContainer.appendChild(taskItem);
  });

  const currentList = getState("lists").find(
    (list) => list.id === currentListId
  );
  if (currentList) {
    document.getElementById("currentListName").textContent = currentList.name;
  }
}
