import { initialize } from "../modules/storage-manager.js";
import { initTaskManager } from "../modules/task-manager.js";
import { initTaskOperations } from "../modules/task-operations.js";
import { initLists } from "../modules/task-lists.js";

async function initApp() {
  try {
    await initialize();
    initLists(); // Inicializa as listas (incluindo as padrão)
    initTaskOperations(); // Garante que as tarefas padrão são carregadas
    initTaskManager();
  } catch (error) {
    console.error("Falha na inicialização:", error);
    alert(
      "O aplicativo encontrou um erro ao carregar. Por favor, recarregue a página."
    );
  }
}

document.addEventListener("DOMContentLoaded", initApp);
