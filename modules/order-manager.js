export class OrderManager {
  constructor(storageManager, priorityCalculator) {
    this.storageManager = storageManager;
    this.priorityCalculator = priorityCalculator;
    this.orders = this.storageManager.getOrders();
    this.nextId = this.storageManager.getNextId();
  }

  addOrder(newOrder) {
    newOrder.id = this.nextId++;
    newOrder.priorityScore =
      this.priorityCalculator.calculatePriorityScore(newOrder);
    newOrder.createdAt = new Date();
    newOrder.status = "pending";

    this.insertOrderSorted(newOrder);
    this.storageManager.saveOrders(this.orders);
    this.storageManager.saveNextId(this.nextId);
  }

  insertOrderSorted(newOrder) {
    let i = this.orders.length - 1;
    while (i >= 0 && this.orders[i].priorityScore > newOrder.priorityScore) {
      i--;
    }
    this.orders.splice(i + 1, 0, newOrder);
  }

  updateOrder(orderId, updatedData) {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return false;

    const updatedOrder = {
      ...this.orders[orderIndex],
      ...updatedData,
      priorityScore: this.priorityCalculator.calculatePriorityScore({
        ...this.orders[orderIndex],
        ...updatedData,
      }),
    };

    this.orders.splice(orderIndex, 1);
    this.insertOrderSorted(updatedOrder);
    this.storageManager.saveOrders(this.orders);
    return true;
  }

  deleteOrder(orderId) {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return false;

    this.orders.splice(orderIndex, 1);
    this.storageManager.saveOrders(this.orders);
    return true;
  }

  getOrders(filter = "all") {
    if (filter === "all") return [...this.orders];
    return this.orders.filter((order) => order.status === filter);
  }
}
