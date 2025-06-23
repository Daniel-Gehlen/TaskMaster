import { getState, setState, saveData } from "./storage-manager.js";
import { renderUI } from "./ui-components.js";

const defaultLists = [
  { id: "1", name: "Tarefas Domésticas", icon: "home" },
  { id: "2", name: "Trabalho", icon: "work" },
  { id: "3", name: "Estudos", icon: "school" },
  { id: "4", name: "Pessoal", icon: "person" },
  { id: "5", name: "Compras", icon: "shopping_cart" },
];

export function initLists() {
  loadData();
  setupListEventListeners();
  // Seleciona a primeira lista automaticamente
  if (getState("lists").length > 0 && !getState("currentListId")) {
    setCurrentList(getState("lists")[0].id);
  }
}

function loadData() {
  const savedLists = localStorage.getItem("taskMasterLists");
  if (savedLists) {
    setState("lists", JSON.parse(savedLists));
  } else {
    setState("lists", defaultLists);
    saveData(); // Salva as listas padrão no localStorage
  }
}

export function addList(name) {
  if (!name.trim()) return;

  const newList = {
    id: Date.now().toString(),
    name: name.trim(),
    icon: "list",
  };

  const lists = [...getState("lists"), newList];
  setState("lists", lists);
  saveData();
  renderUI();
  setCurrentList(newList.id);
}

export function deleteList(listId) {
  if (
    !confirm(
      "Tem certeza que deseja excluir esta lista e todas as suas tarefas?"
    )
  )
    return;

  const lists = getState("lists").filter((list) => list.id !== listId);
  const tasks = getState("tasks").filter((task) => task.listId !== listId);

  setState("lists", lists);
  setState("tasks", tasks);
  saveData();

  if (getState("currentListId") === listId) {
    if (lists.length > 0) {
      setCurrentList(lists[0].id);
    } else {
      setState("currentListId", null);
    }
  }

  renderUI();
}

export function setCurrentList(listId) {
  setState("currentListId", listId);
  renderUI();
}

function setupListEventListeners() {
  document.getElementById("addListButton").addEventListener("click", () => {
    addList(document.getElementById("newListName").value);
    document.getElementById("newListName").value = "";
  });

  document.getElementById("newListName").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addList(e.target.value);
      e.target.value = "";
    }
  });
}
