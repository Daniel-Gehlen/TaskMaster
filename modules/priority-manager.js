export function getPriorityText(priority) {
  switch (priority) {
    case 1:
      return "Prioridade Máxima";
    case 2:
      return "Alta Prioridade";
    case 3:
      return "Prioridade Média";
    case 4:
      return "Baixa Prioridade";
    default:
      return "";
  }
}
