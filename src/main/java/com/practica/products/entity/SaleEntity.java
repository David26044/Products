package com.practica.products.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="sales")
public class SaleEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime date = LocalDateTime.now();

    @Column
    private BigDecimal total;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.PERSIST)
    private List<SaleDetailEntity> details;

    public SaleEntity(Long id, LocalDateTime date, BigDecimal total) {
        this.id = id;
        this.date = date;
        this.total = total;
    }

    public SaleEntity(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
