import { defaultLists } from "./task-lists.js";
import { defaultTasks } from "./task-operations.js";

let state = {
  lists: [],
  tasks: [],
  currentListId: null,
  currentTask: null,
  user: null,
};

export function getState(key) {
  return key ? state[key] : state;
}

export function setState(key, value) {
  state[key] = value;
}

export function saveData() {
  localStorage.setItem("taskMasterLists", JSON.stringify(state.lists));
  localStorage.setItem("taskMasterTasks", JSON.stringify(state.tasks));
}

export function initialize() {
  // Inicializa listas
  const savedLists = localStorage.getItem("taskMasterLists");
  if (savedLists) {
    state.lists = JSON.parse(savedLists);
  } else {
    state.lists = defaultLists;
    localStorage.setItem("taskMasterLists", JSON.stringify(defaultLists));
  }

  // Inicializa tarefas
  const savedTasks = localStorage.getItem("taskMasterTasks");
  if (savedTasks) {
    state.tasks = JSON.parse(savedTasks);
  } else {
    state.tasks = defaultTasks;
    localStorage.setItem("taskMasterTasks", JSON.stringify(defaultTasks));
  }
}
