document.addEventListener("DOMContentLoaded", () => {
    const productsTableBody = document.getElementById("products-table-body");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const addProductForm = document.getElementById("addProductForm");
    const addProductModal = document.getElementById("addProductModal");
  
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
  
    // Manejar el envío del formulario para agregar producto
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const name = document.getElementById("productName").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const stock = parseInt(document.getElementById("productStock").value);
  
      try {
        // Realizar la solicitud POST al backend
        await axios.post("http://localhost:8080/products", {
          name,
          price,
          stock,
        });
  
        // Cerrar el modal
        const modalInstance = bootstrap.Modal.getInstance(addProductModal);
        modalInstance.hide();
  
        // Limpiar el formulario
        addProductForm.reset();
  
        // Recargar la tabla
        loadProducts(currentPage);
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    });
  
    // Eliminar el fondo opaco al cerrar el modal
    addProductModal.addEventListener("hidden.bs.modal", () => {
      // Eliminar manualmente cualquier rastro de la clase modal-backdrop
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
  
      // Restaurar el estilo de opacidad del body
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });
  
    // Cargar los productos al cargar la página
    loadProducts(currentPage);
  });