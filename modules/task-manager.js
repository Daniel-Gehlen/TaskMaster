import { initLists } from "./task-lists.js";
import { initTaskOperations } from "./task-operations.js";
import { initCalendarIntegration } from "./calendar-integration.js";
import { initAuth } from "./auth-manager.js";

export function initTaskManager() {
  initLists();
  initTaskOperations();
  initCalendarIntegration();
  initAuth();
}
