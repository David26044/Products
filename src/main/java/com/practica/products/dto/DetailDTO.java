package com.practica.products.dto;

import java.math.BigDecimal;

public class DetailDTO {

    private Long productId;
    private Integer quantity;

    public DetailDTO(){}

    public DetailDTO(Long productId, Integer quantity, BigDecimal unitPrice) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
