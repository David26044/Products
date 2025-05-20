package com.practica.products.service;

import com.practica.products.entity.ProductEntity;
import java.util.List;

public interface IProductService {
    
    ProductEntity getProductById(Long id);
    
    List<ProductEntity> getAllProducts();
    ProductEntity saveProduct(ProductEntity product);
    ProductEntity deleteProductByProductId(Long id);
    ProductEntity updateProduct(ProductEntity product);
    ProductEntity partialUpdateProducy(ProductEntity product);


}
