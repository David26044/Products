package com.practica.products.service;

import com.practica.products.dto.SaleDTO;
import com.practica.products.entity.SaleEntity;

import java.util.List;

public interface ISaleService {

    List<SaleEntity> getAllSales();
    SaleEntity getSaleById(Long id);
    SaleEntity  saveSale(SaleDTO sale);

}
