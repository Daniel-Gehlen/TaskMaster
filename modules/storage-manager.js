import { defaultTasks } from "./task-operations.js"; // Adicione esta linha no topo

export function initialize() {
  if (!localStorage.getItem("taskMasterLists")) {
    localStorage.setItem("taskMasterLists", JSON.stringify([]));
  }
  if (!localStorage.getItem("taskMasterTasks")) {
    // Carrega as tarefas padrão se não existirem tarefas
    localStorage.setItem("taskMasterTasks", JSON.stringify(defaultTasks));
    state.tasks = defaultTasks; // Atualiza o estado também
  }
}

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
  if (!localStorage.getItem("taskMasterLists")) {
    localStorage.setItem("taskMasterLists", JSON.stringify([]));
  }
  if (!localStorage.getItem("taskMasterTasks")) {
    localStorage.setItem("taskMasterTasks", JSON.stringify([]));
  }
}
