import { initTaskManager } from '../modules/task-manager.js';
import { initialize } from '../modules/storage-manager.js';

initialize();
document.addEventListener('DOMContentLoaded', initTaskManager);
