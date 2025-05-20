package com.practica.products.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import com.practica.products.entity.ProductEntity;
import com.practica.products.service.IProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    IProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductEntity>> getProducts(){
        return ResponseEntity.ok().body(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductEntity> getProductById(@PathVariable Long id){
        return ResponseEntity.ok().body(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductEntity> postProduct(@RequestBody ProductEntity product) {
        ProductEntity savedProduct = productService.saveProduct(product);
        return ResponseEntity.created(ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedProduct.getId())
                .toUri())
                .body(savedProduct);
    }

    @PutMapping
    public ResponseEntity<ProductEntity> putProduct(@RequestBody ProductEntity product){
        return ResponseEntity.status(HttpStatus.OK).body(productService.updateProduct(product));
    }

    @PatchMapping
    public ResponseEntity<ProductEntity> patchProduct(@RequestBody ProductEntity product){
        return ResponseEntity.ok().body(productService.partialUpdateProducy(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductEntity> deleteProduct(@PathVariable Long id){
        return ResponseEntity.ok().body(productService.deleteProductByProductId(id));
    }
}
