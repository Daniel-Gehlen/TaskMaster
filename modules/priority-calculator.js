export class PriorityCalculator {
    calculatePriorityScore(order) {
        return (order.distance * 0.6) + (order.preparationTime * 0.4);
    }

    getPriorityClass(priority) {
        return `priority-${priority}`;
    }

    getPriorityText(priority) {
        return priority === 'high' ? 'Alta' :
               priority === 'medium' ? 'Média' : 'Baixa';
    }
}
