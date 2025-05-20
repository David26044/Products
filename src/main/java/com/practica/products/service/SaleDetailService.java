package com.practica.products.service;

import com.practica.products.entity.SaleDetailEntity;
import com.practica.products.entity.SaleDetailPK;
import com.practica.products.repository.SaleDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleDetailService {

    @Autowired
    private SaleDetailRepository saleDetailRepository;

    public List<SaleDetailEntity> getAllSaleDetails() {
        return saleDetailRepository.findAll();
    }

    public Optional<SaleDetailEntity> getSaleDetailById(SaleDetailPK id) {
        return saleDetailRepository.findById(id);
    }

    public SaleDetailEntity saveSaleDetail(SaleDetailEntity detail) {
        return saleDetailRepository.save(detail);
    }

    public void deleteSaleDetail(SaleDetailPK id) {
        saleDetailRepository.deleteById(id);
    }
}
