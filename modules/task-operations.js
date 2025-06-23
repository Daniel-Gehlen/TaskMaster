import { getState, setState, saveData } from "./storage-manager.js";
import { renderUI } from "./ui-components.js";
import { getPriorityText } from "./priority-manager.js";

const defaultTasks = [
  {
    id: "1",
    listId: "1",
    title: "Lavar roupa",
    description: "Separar as roupas brancas e coloridas",
    priority: 3,
    completed: false,
    dueDate: null,
  },
  {
    id: "2",
    listId: "1",
    title: "Limpar a geladeira",
    description: "Verificar validade dos produtos",
    priority: 2,
    completed: false,
    dueDate: "2023-12-15",
  },
  {
    id: "3",
    listId: "2",
    title: "Preparar apresentação",
    description: "Slides para reunião de equipe",
    priority: 1,
    completed: false,
    dueDate: "2023-12-10",
  },
  {
    id: "4",
    listId: "3",
    title: "Estudar para prova",
    description: "Capítulos 5 a 8 do livro",
    priority: 2,
    completed: false,
    dueDate: null,
  },
];

export function initTaskOperations() {
  loadTasks();
  setupTaskEventListeners();
}

function loadTasks() {
  const savedTasks = localStorage.getItem("taskMasterTasks");
  if (savedTasks && JSON.parse(savedTasks).length > 0) {
    setState("tasks", JSON.parse(savedTasks));
  } else {
    setState("tasks", defaultTasks);
    localStorage.setItem("taskMasterTasks", JSON.stringify(defaultTasks));
  }
}

export function addTask(taskData) {
  const newTask = {
    ...taskData,
    id: Date.now().toString(),
    completed: false,
  };

  const tasks = [...getState("tasks"), newTask];
  setState("tasks", tasks);
  saveData();
  renderUI();
}

export function updateTask(taskId, taskData) {
  const tasks = getState("tasks").map((task) =>
    task.id === taskId ? { ...task, ...taskData } : task
  );
  setState("tasks", tasks);
  saveData();
  renderUI();
}

export function toggleTaskCompletion(taskId) {
  const tasks = getState("tasks").map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  setState("tasks", tasks);
  saveData();
  renderUI();
}

export function deleteTask(taskId) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  const tasks = getState("tasks").filter((task) => task.id !== taskId);
  setState("tasks", tasks);
  saveData();
  renderUI();
}

export function editTask(taskId) {
  const task = getState("tasks").find((t) => t.id === taskId);
  if (!task) return;

  setState("currentTask", task);
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description || "";
  document.getElementById("taskPriority").value = task.priority.toString();
  document.getElementById("taskDueDate").value = task.dueDate || "";
  document.getElementById("taskForm").style.display = "block";
  document.getElementById("taskForm").scrollIntoView({ behavior: "smooth" });
}

function setupTaskEventListeners() {
  document
    .getElementById("addTaskButton")
    .addEventListener("click", showAddTaskForm);
  document.getElementById("saveTaskButton").addEventListener("click", saveTask);
  document
    .getElementById("cancelTaskButton")
    .addEventListener("click", hideTaskForm);
  document
    .getElementById("priorityFilter")
    .addEventListener("change", () => renderUI());
}

function showAddTaskForm() {
  document.getElementById("taskForm").style.display = "block";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "3";
  document.getElementById("taskDueDate").value = "";
  setState("currentTask", null);
  document.getElementById("taskForm").scrollIntoView({ behavior: "smooth" });
}

function hideTaskForm() {
  document.getElementById("taskForm").style.display = "none";
}

function saveTask() {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) {
    alert("O título da tarefa é obrigatório!");
    return;
  }

  const taskData = {
    title: title,
    description: document.getElementById("taskDescription").value.trim(),
    priority: parseInt(document.getElementById("taskPriority").value),
    dueDate: document.getElementById("taskDueDate").value || null,
    listId: getState("currentListId"),
  };

  const currentTask = getState("currentTask");
  if (currentTask) {
    updateTask(currentTask.id, taskData);
  } else {
    addTask(taskData);
  }
  hideTaskForm();
}
