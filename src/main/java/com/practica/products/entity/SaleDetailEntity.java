package com.practica.products.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "sale_detail")
public class SaleDetailEntity implements Serializable {

    @EmbeddedId
    private SaleDetailPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("saleId")
    @JoinColumn(name = "sale_id")
    private SaleEntity sale;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

}
