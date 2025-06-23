import { StorageManager } from '../modules/storage-manager.js';
import { PriorityCalculator } from '../modules/priority-calculator.js';
import { OrderManager } from '../modules/order-manager.js';
import { UIManager } from '../modules/ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    const storageManager = new StorageManager();
    const priorityCalculator = new PriorityCalculator();
    const orderManager = new OrderManager(storageManager, priorityCalculator);
    const uiManager = new UIManager(orderManager, priorityCalculator);

    uiManager.init();
});
