export class StorageManager {
  constructor() {
    this.ORDERS_KEY = "delivery_orders";
    this.NEXT_ID_KEY = "delivery_next_id";
  }

  getOrders() {
    const orders = localStorage.getItem(this.ORDERS_KEY);
    return orders ? JSON.parse(orders) : this.getInitialOrders();
  }

  saveOrders(orders) {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  getNextId() {
    const nextId = localStorage.getItem(this.NEXT_ID_KEY);
    return nextId ? parseInt(nextId) : 5;
  }

  saveNextId(id) {
    localStorage.setItem(this.NEXT_ID_KEY, id.toString());
  }

  getInitialOrders() {
    return [
      {
        id: 1,
        clientName: "João Silva",
        orderItems: "Pizza Margherita, Refrigerante",
        deliveryAddress: "Rua A, 123 - Centro",
        distance: 2.5,
        preparationTime: 20,
        priority: "high",
        status: "pending",
        createdAt: new Date("2023-05-15T10:30:00"),
      },
      {
        id: 2,
        clientName: "Maria Oliveira",
        orderItems: "Hambúrguer, Batata Frita, Suco",
        deliveryAddress: "Av. B, 456 - Jardim",
        distance: 1.2,
        preparationTime: 15,
        priority: "medium",
        status: "preparing",
        createdAt: new Date("2023-05-15T10:45:00"),
      },
      {
        id: 3,
        clientName: "Carlos Souza",
        orderItems: "Salada Caesar, Água Mineral",
        deliveryAddress: "Rua C, 789 - Vila Nova",
        distance: 3.8,
        preparationTime: 10,
        priority: "low",
        status: "pending",
        createdAt: new Date("2023-05-15T11:00:00"),
      },
      {
        id: 4,
        clientName: "Ana Costa",
        orderItems: "Sushi Variado, Chá Gelado",
        deliveryAddress: "Alameda D, 321 - Centro",
        distance: 0.8,
        preparationTime: 25,
        priority: "high",
        status: "delivered",
        createdAt: new Date("2023-05-15T09:15:00"),
      },
    ];
  }
}
