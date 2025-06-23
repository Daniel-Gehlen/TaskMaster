export class UIManager {
  constructor(orderManager, priorityCalculator) {
    this.orderManager = orderManager;
    this.priorityCalculator = priorityCalculator;
    this.currentFilter = "all";
  }

  init() {
    this.renderOrders();
    this.setupEventListeners();
  }

  renderOrders() {
    const ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";

    const orders = this.orderManager.getOrders(this.currentFilter);

    if (orders.length === 0) {
      ordersList.innerHTML =
        '<div class="order-item">Nenhum pedido encontrado</div>';
      return;
    }

    orders.forEach((order) => {
      const orderElement = document.createElement("div");
      orderElement.className = "order-item";
      orderElement.dataset.id = order.id;

      const priorityClass = this.priorityCalculator.getPriorityClass(
        order.priority
      );
      const priorityText = this.priorityCalculator.getPriorityText(
        order.priority
      );

      const statusClass = `status-${order.status}`;
      const statusText =
        order.status === "pending"
          ? "Pendente"
          : order.status === "preparing"
          ? "Preparando"
          : "Entregue";

      orderElement.innerHTML = `
                <div class="order-info">
                    <h3>
                        <span class="order-priority ${priorityClass}" title="Prioridade: ${priorityText}"></span>
                        ${order.clientName}
                        <span class="order-status ${statusClass}">${statusText}</span>
                    </h3>
                    <p><strong>Itens:</strong> ${order.orderItems}</p>
                    <p><strong>Endereço:</strong> ${order.deliveryAddress}</p>
                    <p><strong>Distância:</strong> ${
                      order.distance
                    } km | <strong>Preparo:</strong> ${
        order.preparationTime
      } min</p>
                    <p><strong>Pedido feito em:</strong> ${order.createdAt.toLocaleString()}</p>
                </div>
                <div class="order-actions">
                    ${
                      order.status !== "delivered"
                        ? `
                        <button class="status-button" data-status="${
                          order.status === "pending" ? "preparing" : "delivered"
                        }">
                            ${
                              order.status === "pending"
                                ? "Preparar"
                                : "Entregue"
                            }
                        </button>
                    `
                        : ""
                    }
                    <button class="edit-button warning">Editar</button>
                    <button class="delete-button danger">Excluir</button>
                </div>
                <div class="edit-form" id="editForm-${order.id}">
                    <h4>Editar Pedido</h4>
                    <form class="edit-order-form">
                        <div class="form-group">
                            <label for="editClientName-${
                              order.id
                            }">Nome do Cliente</label>
                            <input type="text" id="editClientName-${
                              order.id
                            }" value="${order.clientName}" required>
                        </div>
                        <div class="form-group">
                            <label for="editOrderItems-${
                              order.id
                            }">Itens do Pedido</label>
                            <input type="text" id="editOrderItems-${
                              order.id
                            }" value="${order.orderItems}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDeliveryAddress-${
                              order.id
                            }">Endereço</label>
                            <input type="text" id="editDeliveryAddress-${
                              order.id
                            }" value="${order.deliveryAddress}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDistance-${
                              order.id
                            }">Distância (km)</label>
                            <input type="number" id="editDistance-${
                              order.id
                            }" value="${
        order.distance
      }" min="0" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label for="editPreparationTime-${
                              order.id
                            }">Tempo de Preparo (min)</label>
                            <input type="number" id="editPreparationTime-${
                              order.id
                            }" value="${
        order.preparationTime
      }" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="editPriority-${
                              order.id
                            }">Prioridade</label>
                            <select id="editPriority-${order.id}" required>
                                <option value="high" ${
                                  order.priority === "high" ? "selected" : ""
                                }>Alta</option>
                                <option value="medium" ${
                                  order.priority === "medium" ? "selected" : ""
                                }>Média</option>
                                <option value="low" ${
                                  order.priority === "low" ? "selected" : ""
                                }>Baixa</option>
                            </select>
                        </div>
                        <button type="submit">Salvar</button>
                        <button type="button" class="cancel-edit">Cancelar</button>
                    </form>
                </div>
            `;

      ordersList.appendChild(orderElement);
    });
  }

  setupEventListeners() {
    document.getElementById("newOrderForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const newOrder = {
        clientName: document.getElementById("clientName").value,
        orderItems: document.getElementById("orderItems").value,
        deliveryAddress: document.getElementById("deliveryAddress").value,
        distance: parseFloat(document.getElementById("distance").value),
        preparationTime: parseInt(
          document.getElementById("preparationTime").value
        ),
        priority: document.getElementById("priority").value,
      };

      this.orderManager.addOrder(newOrder);
      this.renderOrders();
      e.target.reset();
    });

    document
      .getElementById("filterAll")
      .addEventListener("click", () => this.setFilter("all"));
    document
      .getElementById("filterPending")
      .addEventListener("click", () => this.setFilter("pending"));
    document
      .getElementById("filterPreparing")
      .addEventListener("click", () => this.setFilter("preparing"));
    document
      .getElementById("filterDelivered")
      .addEventListener("click", () => this.setFilter("delivered"));

    document.getElementById("ordersList").addEventListener("click", (e) => {
      const orderItem = e.target.closest(".order-item");
      if (!orderItem) return;

      const orderId = parseInt(orderItem.dataset.id);

      if (e.target.classList.contains("status-button")) {
        this.updateOrderStatus(orderId, e.target.dataset.status);
      }

      if (e.target.classList.contains("edit-button")) {
        orderItem.querySelector(".edit-form").classList.toggle("active");
      }

      if (e.target.classList.contains("cancel-edit")) {
        e.target.closest(".edit-form").classList.remove("active");
      }

      if (e.target.classList.contains("delete-button")) {
        if (confirm("Tem certeza que deseja excluir este pedido?")) {
          this.deleteOrder(orderId);
        }
      }

      if (e.target.closest(".edit-order-form")) {
        e.preventDefault();
        this.handleEditFormSubmit(e, orderId);
      }
    });
  }

  setFilter(filter) {
    this.currentFilter = filter;
    document.querySelectorAll(".filter-buttons button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .getElementById(
        `filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`
      )
      .classList.add("active");
    this.renderOrders();
  }

  updateOrderStatus(orderId, newStatus) {
    this.orderManager.updateOrder(orderId, { status: newStatus });
    this.renderOrders();
  }

  deleteOrder(orderId) {
    this.orderManager.deleteOrder(orderId);
    this.renderOrders();
  }

  handleEditFormSubmit(e, orderId) {
    const form = e.target.closest(".edit-order-form");

    const updatedData = {
      clientName: form.querySelector(`#editClientName-${orderId}`).value,
      orderItems: form.querySelector(`#editOrderItems-${orderId}`).value,
      deliveryAddress: form.querySelector(`#editDeliveryAddress-${orderId}`)
        .value,
      distance: parseFloat(
        form.querySelector(`#editDistance-${orderId}`).value
      ),
      preparationTime: parseInt(
        form.querySelector(`#editPreparationTime-${orderId}`).value
      ),
      priority: form.querySelector(`#editPriority-${orderId}`).value,
    };

    this.orderManager.updateOrder(orderId, updatedData);
    this.renderOrders();
  }
}
