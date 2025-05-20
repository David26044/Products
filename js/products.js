document.addEventListener("DOMContentLoaded", () => {
    const productsTableBody = document.getElementById("products-table-body");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
  
    let currentPage = 1;
    const pageSize = 10;
  
    // Función para cargar los productos desde el backend
    const loadProducts = async (page) => {
      try {
        const response = await axios.get(`http://localhost:8080/products?page=${page}&size=${pageSize}`);
        const products = response.data;
  
        // Limpiar la tabla
        productsTableBody.innerHTML = "";
  
        // Llenar la tabla con los productos
        products.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>
              <button class="btn btn-warning btn-sm">Editar</button>
              <button class="btn btn-danger btn-sm">Eliminar</button>
            </td>
          `;
          productsTableBody.appendChild(row);
        });
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
  
    // Manejar la paginación
    prevPageButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        loadProducts(currentPage);
      }
    });
  
    nextPageButton.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage++;
      loadProducts(currentPage);
    });
  
    // Cargar los productos al cargar la página
    loadProducts(currentPage);
  });