package com.practica.products.repository;

import com.practica.products.entity.SaleDetailEntity;
import com.practica.products.entity.SaleDetailPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleDetailRepository extends JpaRepository<SaleDetailEntity, SaleDetailPK> {
}
