document.addEventListener("DOMContentLoaded", () => {
    const productsTableBody = document.getElementById("products-table-body");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const addProductForm = document.getElementById("addProductForm");
    const addProductModal = document.getElementById("addProductModal");
    const editProductForm = document.getElementById("editProductForm");
    const editProductModal = document.getElementById("editProductModal");

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
              <button class="btn btn-warning btn-sm edit-button" data-id="${product.id}">Editar</button>
              <button class="btn btn-danger btn-sm delete-button" data-id="${product.id}">Eliminar</button>
            </td>
          `;
          productsTableBody.appendChild(row);
        });

        // Agregar eventos a los botones de editar
        document.querySelectorAll(".edit-button").forEach((button) => {
          button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            openEditModal(productId);
          });
        });
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    // Función para abrir el modal de edición
    const openEditModal = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:8080/products/${productId}`);
        const product = response.data;

        // Llenar el formulario con los datos del producto
        document.getElementById("editProductId").value = product.id;
        document.getElementById("editProductName").value = product.name || "";
        document.getElementById("editProductPrice").value = product.price || "";
        document.getElementById("editProductStock").value = product.stock || "";

        // Mostrar el modal
        const modalInstance = new bootstrap.Modal(editProductModal);
        modalInstance.show();
      } catch (error) {
        console.error("Error al obtener el producto:", error);
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

    // Manejar el envío del formulario de edición
    editProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("editProductId").value;
      const name = document.getElementById("editProductName").value;
      const price = document.getElementById("editProductPrice").value;
      const stock = document.getElementById("editProductStock").value;

      // Crear el objeto JSON para enviar
      const productData = {};
      if (name) productData.name = name;
      if (price) productData.price = parseFloat(price);
      if (stock) productData.stock = parseInt(stock);

      try {
        if (name && price && stock) {
          // Si todos los campos están completos, usar PUT
          await axios.put("http://localhost:8080/products", {
            id,
            ...productData,
          });
        } else {
          // Si hay campos vacíos, usar PATCH
          await axios.patch("http://localhost:8080/products", {
            id,
            ...productData,
          });
        }

        // Cerrar el modal
        const modalInstance = bootstrap.Modal.getInstance(editProductModal);
        modalInstance.hide();

        // Recargar la tabla
        loadProducts(currentPage);
      } catch (error) {
        console.error("Error al editar el producto:", error);
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