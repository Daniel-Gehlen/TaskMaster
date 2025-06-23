import { initialize } from '../modules/storage-manager.js';
import { initTaskManager } from '../modules/task-manager.js';
import { initTaskOperations } from '../modules/task-operations.js'; // Adicione esta linha

async function initApp() {
  await initialize();
  initTaskOperations(); // Garante que as tarefas padrão são carregadas
  initTaskManager();
}

document.addEventListener('DOMContentLoaded', initApp);
