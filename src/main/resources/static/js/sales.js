document.addEventListener("DOMContentLoaded", () => {
  const salesTableBody = document.getElementById("sales-table-body");
  const addSaleForm = document.getElementById("addSaleForm");
  const addSaleModal = document.getElementById("addSaleModal");
  const productSelect = document.getElementById("productSelect");
  const productQuantity = document.getElementById("productQuantity");
  const addProductButton = document.getElementById("addProductButton");
  const selectedProductsTableBody = document.getElementById("selectedProductsTableBody");

  let salesDistributionChart, salesTotalChart, salesOverTimeChart, topSellingProductsChart, revenueByProductChart;
  let selectedProducts = [];

  // Función para cargar los productos desde el backend
  const loadProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products");
      const products = response.data;

      // Llenar el select con los productos
      productSelect.innerHTML = "";
      products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} (Stock: ${product.stock})`;
        productSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  // Función para agregar un producto a la lista de seleccionados
  addProductButton.addEventListener("click", () => {
    const productId = productSelect.value;
    const productName = productSelect.options[productSelect.selectedIndex].text.split(" (")[0];
    const quantity = parseInt(productQuantity.value);

    if (!productId || !quantity || quantity <= 0) {
      alert("Seleccione un producto y una cantidad válida.");
      return;
    }

    // Verificar si el producto ya está en la lista
    const existingProduct = selectedProducts.find((p) => p.productId === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      selectedProducts.push({ productId, productName, quantity });
    }

    // Actualizar la tabla de productos seleccionados
    updateSelectedProductsTable();
  });

  // Función para actualizar la tabla de productos seleccionados
  const updateSelectedProductsTable = () => {
    selectedProductsTableBody.innerHTML = "";
    selectedProducts.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.productName}</td>
        <td>${product.quantity}</td>
        <td>
          <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
        </td>
      `;
      selectedProductsTableBody.appendChild(row);
    });

    // Agregar eventos a los botones de eliminar
    selectedProductsTableBody.querySelectorAll(".btn-danger").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        selectedProducts.splice(index, 1);
        updateSelectedProductsTable();
      });
    });
  };

  // Manejar el envío del formulario para registrar venta
  addSaleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }

    try {
      // Realizar la solicitud POST al backend
      await axios.post("http://localhost:8080/sale", { details: selectedProducts });

      // Cerrar el modal
      const modalInstance = bootstrap.Modal.getInstance(addSaleModal);
      modalInstance.hide();

      // Limpiar el formulario y la lista de productos seleccionados
      addSaleForm.reset();
      selectedProducts = [];
      updateSelectedProductsTable();

      // Recargar la tabla de ventas y actualizar las gráficas
      loadSales();
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    }
  });

  // Función para cargar las ventas desde el backend
  const loadSales = async () => {
    try {
      const response = await axios.get("http://localhost:8080/sale");
      const sales = response.data;

      // Limpiar la tabla
      salesTableBody.innerHTML = "";

      // Llenar la tabla con las ventas
      sales.forEach((sale) => {
        const row = document.createElement("tr");

        // Formatear los detalles de la venta
        const formattedDetails = sale.details
          .map(detail => 
            `${detail.product.name} (Cantidad: ${detail.quantity}, Subtotal: ${detail.subtotal.toFixed(2)})`
          )
          .join("<br>");

        row.innerHTML = `
          <td>${sale.id}</td>
          <td>${new Date(sale.date).toLocaleString()}</td>
          <td>${sale.total.toFixed(2)}</td>
          <td>${formattedDetails}</td>
        `;
        salesTableBody.appendChild(row);
      });

      // Actualizar las gráficas
      updateCharts(sales);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
    }
  };

  // Función para inicializar las gráficas
  const initializeCharts = () => {
    const salesOverTimeCtx = document.getElementById("salesOverTimeChart").getContext("2d");
    const topSellingProductsCtx = document.getElementById("topSellingProductsChart").getContext("2d");
    const revenueByProductCtx = document.getElementById("revenueByProductChart").getContext("2d");

    salesOverTimeChart = new Chart(salesOverTimeCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Ventas Totales",
          data: [],
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "#007bff",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: { enabled: true, backgroundColor: "#333", titleColor: "#fff", bodyColor: "#fff" },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#e9ecef" }, beginAtZero: true },
        },
      },
    });

    topSellingProductsChart = new Chart(topSellingProductsCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "Productos Más Vendidos",
          data: [],
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
          borderColor: "#fff",
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true, backgroundColor: "#333", titleColor: "#fff", bodyColor: "#fff" },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#e9ecef" }, beginAtZero: true },
        },
      },
    });

    revenueByProductChart = new Chart(revenueByProductCtx, {
      type: "pie",
      data: {
        labels: [],
        datasets: [{
          label: "Ingresos por Producto",
          data: [],
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
          borderColor: "#fff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "right" },
          tooltip: { enabled: true, backgroundColor: "#333", titleColor: "#fff", bodyColor: "#fff" },
        },
      },
    });
  };

  // Función para actualizar las gráficas
  const updateCharts = (sales) => {
    // Ventas totales a lo largo del tiempo
    const salesDates = sales.map((sale) => new Date(sale.date).toLocaleDateString());
    const salesTotals = sales.map((sale) => sale.total);

    salesOverTimeChart.data.labels = salesDates;
    salesOverTimeChart.data.datasets[0].data = salesTotals;
    salesOverTimeChart.update();

    // Productos más vendidos
    const productQuantities = {};
    sales.forEach((sale) => {
      sale.details.forEach((detail) => {
        if (!productQuantities[detail.product.name]) {
          productQuantities[detail.product.name] = 0;
        }
        productQuantities[detail.product.name] += detail.quantity;
      });
    });

    const topProducts = Object.entries(productQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    topSellingProductsChart.data.labels = topProducts.map(([name]) => name);
    topSellingProductsChart.data.datasets[0].data = topProducts.map(([_, quantity]) => quantity);
    topSellingProductsChart.update();

    // Ingresos por producto
    const productRevenues = {};
    sales.forEach((sale) => {
      sale.details.forEach((detail) => {
        if (!productRevenues[detail.product.name]) {
          productRevenues[detail.product.name] = 0;
        }
        productRevenues[detail.product.name] += detail.subtotal;
      });
    });

    const revenueData = Object.entries(productRevenues);

    revenueByProductChart.data.labels = revenueData.map(([name]) => name);
    revenueByProductChart.data.datasets[0].data = revenueData.map(([_, revenue]) => revenue);
    revenueByProductChart.update();
  };

  // Inicializar las gráficas al cargar la página
  initializeCharts();

  // Cargar los productos y las ventas al cargar la página
  loadProducts();
  loadSales();
});