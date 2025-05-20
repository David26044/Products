package com.practica.products.service;

import com.practica.products.entity.SaleEntity;
import com.practica.products.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    public List<SaleEntity> getAllSales() {
        return saleRepository.findAll();
    }

    public Optional<SaleEntity> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public SaleEntity saveSale(SaleEntity sale) {
        return saleRepository.save(sale);
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }
}
