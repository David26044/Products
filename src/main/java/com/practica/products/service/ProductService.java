package com.practica.products.service;

import com.practica.products.exception.InsufficientStockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.practica.products.entity.ProductEntity;
import com.practica.products.exception.ResourceAlreadyExistsException;
import com.practica.products.exception.ResourceNotFoundException;
import com.practica.products.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService implements IProductService{
    
    @Autowired
    ProductRepository productRepository;

    @Override
    public List<ProductEntity> getAllProducts(){
        return productRepository.findAll();
    }
    
    @Override
    public ProductEntity getProductById(Long id){
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No existe el producto con ID: " + id));
    }

    @Override
    public ProductEntity saveProduct(ProductEntity product){
        productRepository.findByName(product.getName())
        .ifPresent(existingProduct -> {
            throw new ResourceAlreadyExistsException("Ya existe el producto con nombre: " + product.getName());
        });
        return productRepository.save(product);
    }

    @Override
    public ProductEntity deleteProductByProductId(Long id){
        ProductEntity product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No existe el producto con ID: " +id));
        productRepository.deleteById(id);
        return product;
    }

    @Override
    public ProductEntity updateProduct(ProductEntity product){
        productRepository.findById(product.getId())
            .orElseThrow(() -> new ResourceNotFoundException("No existe el producto con ID: " + product.getId()));
        return productRepository.save(product);
    }

    @Override
    public ProductEntity partialUpdateProducy(ProductEntity product){

        ProductEntity updateProduct = productRepository.findById(product.getId())
            .orElseThrow(() -> new ResourceNotFoundException("No existe el producto con ID: " + product.getId()));

        if (product.getName() != null) {
            updateProduct.setName(product.getName());
        }
        if (product.getPrice() != null) {
            updateProduct.setPrice(product.getPrice());           
        }
        if (product.getStock() != 0) {
            updateProduct.setStock(product.getStock());
        }
        return productRepository.save(updateProduct);
        
    }

    @Override
    public List<ProductEntity> getProductsByIds(List<Long> ids){
        return productRepository.findAllById(ids);
    }

    @Override
    public void reduceStock(ProductEntity product, Integer quantity) {
        int currentStock = product.getStock();
        if (quantity > currentStock) {
            throw new InsufficientStockException(
                    "No se puede reducir el stock del producto con ID: " + product.getId() +
                            ". Stock actual: " + currentStock + ", cantidad a reducir: " + quantity
            );
        } else {
            product.setStock(currentStock - quantity);
        }
        productRepository.save(product);
    }

}
