document.addEventListener("DOMContentLoaded", () => {
  const salesTableBody = document.getElementById("sales-table-body");
  const addSaleForm = document.getElementById("addSaleForm");
  const addSaleModal = document.getElementById("addSaleModal");
  const productSelect = document.getElementById("productSelect");
  const productQuantity = document.getElementById("productQuantity");
  const addProductButton = document.getElementById("addProductButton");
  const selectedProductsTableBody = document.getElementById("selectedProductsTableBody");

  let salesDistributionChart, salesTotalChart;
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
        row.innerHTML = `
          <td>${sale.id}</td>
          <td>${new Date(sale.date).toLocaleString()}</td>
          <td>${sale.total}</td>
          <td>${JSON.stringify(sale.details)}</td>
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
    const salesDistributionCtx = document.getElementById("salesDistributionChart").getContext("2d");
    const salesTotalCtx = document.getElementById("salesTotalChart").getContext("2d");

    salesDistributionChart = new Chart(salesDistributionCtx, {
      type: "pie",
      data: {
        labels: [],
        datasets: [{
          label: "Distribución de Ventas",
          data: [],
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
        }],
      },
    });

    salesTotalChart = new Chart(salesTotalCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "Totales de Ventas",
          data: [],
          backgroundColor: "#007bff",
        }],
      },
    });
  };

  // Función para actualizar las gráficas
  const updateCharts = (sales) => {
    // Actualizar datos de distribución de ventas
    const distributionLabels = sales.map((sale) => `Venta ${sale.id}`);
    const distributionData = sales.map((sale) => sale.details.length);

    salesDistributionChart.data.labels = distributionLabels;
    salesDistributionChart.data.datasets[0].data = distributionData;
    salesDistributionChart.update();

    // Actualizar datos de totales de ventas
    const totalLabels = sales.map((sale) => `Venta ${sale.id}`);
    const totalData = sales.map((sale) => sale.total);

    salesTotalChart.data.labels = totalLabels;
    salesTotalChart.data.datasets[0].data = totalData;
    salesTotalChart.update();
  };

  // Inicializar las gráficas al cargar la página
  initializeCharts();

  // Cargar los productos y las ventas al cargar la página
  loadProducts();
  loadSales();
});