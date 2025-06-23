import { getState } from "./storage-manager.js";

export function initCalendarIntegration() {
  setupCalendarEventListeners();
}

export function openCalendarModal(task) {
  document.getElementById("calendarTitle").value = task.title;
  document.getElementById("calendarDescription").value = task.description || "";

  // Configura data/hora padrão
  const now = new Date();
  const defaultStart = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000); // +1 hora

  document.getElementById("calendarStart").value =
    formatDateTimeLocal(defaultStart);
  document.getElementById("calendarEnd").value =
    formatDateTimeLocal(defaultEnd);

  // Se a tarefa tem data de vencimento, usa como padrão
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(12, 0, 0, 0); // Meio-dia
    document.getElementById("calendarStart").value =
      formatDateTimeLocal(dueDate);

    const endDate = new Date(dueDate.getTime() + 60 * 60 * 1000); // +1 hora
    document.getElementById("calendarEnd").value = formatDateTimeLocal(endDate);
  }

  document.getElementById("calendarModal").style.display = "flex";
}

function formatDateTimeLocal(date) {
  return date.toISOString().slice(0, 16);
}

function closeCalendarModal() {
  document.getElementById("calendarModal").style.display = "none";
}

function addToCalendar() {
  const title = document.getElementById("calendarTitle").value.trim();
  if (!title) {
    alert("O título do evento é obrigatório!");
    return;
  }

  const start = document.getElementById("calendarStart").value;
  const end = document.getElementById("calendarEnd").value;

  if (!start || !end) {
    alert("As datas de início e término são obrigatórias!");
    return;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate >= endDate) {
    alert("A data de término deve ser após a data de início!");
    return;
  }

  const event = {
    action: "TEMPLATE",
    text: encodeURIComponent(title),
    details: encodeURIComponent(
      document.getElementById("calendarDescription").value || ""
    ),
    dates: `${formatDateForGoogleCalendar(
      startDate
    )}/${formatDateForGoogleCalendar(endDate)}`,
    location: "",
    trp: false,
    sprop: "name:TaskMaster",
  };

  const queryString = Object.entries(event)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  window.open(
    `https://calendar.google.com/calendar/render?${queryString}`,
    "_blank"
  );
  closeCalendarModal();
}

function formatDateForGoogleCalendar(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function setupCalendarEventListeners() {
  document
    .getElementById("closeCalendarModal")
    .addEventListener("click", closeCalendarModal);
  document
    .getElementById("cancelCalendarButton")
    .addEventListener("click", closeCalendarModal);
  document
    .getElementById("addToCalendarButton")
    .addEventListener("click", addToCalendar);

  document.getElementById("calendarModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("calendarModal")) {
      closeCalendarModal();
    }
  });
}
