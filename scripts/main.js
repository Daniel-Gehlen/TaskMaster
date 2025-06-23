import { initialize } from "/modules/storage-manager.js";
import { initTaskManager } from "/modules/task-manager.js";
import { initLists } from "/modules/task-lists.js";

async function initApp() {
  try {
    await initialize(); // Garante que os dados estão carregados
    initLists(); // Inicializa as listas
    initTaskManager(); // Inicializa o gerenciador de tarefas

    // Força uma renderização completa
    const renderUI = (await import("/modules/ui-components.js")).renderUI;
    renderUI();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

document.addEventListener("DOMContentLoaded", initApp);
