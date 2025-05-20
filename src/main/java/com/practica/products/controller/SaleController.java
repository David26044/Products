package com.practica.products.controller;

import com.practica.products.dto.SaleDTO;
import com.practica.products.entity.SaleEntity;
import com.practica.products.service.ISaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sale")
public class SaleController {

    @Autowired
    ISaleService saleService;

    @GetMapping("/{id}")
    public ResponseEntity<SaleEntity> getSaleById(@PathVariable Long id){
        return ResponseEntity.ok(saleService.getSaleById(id));
    }

    @GetMapping
    public ResponseEntity<List<SaleEntity>> getAllSales(){
        return ResponseEntity.ok(saleService.getAllSales());
    }

    @PostMapping
    public ResponseEntity<SaleEntity> postSale(@RequestBody SaleDTO dto){
        return ResponseEntity.ok(saleService.saveSale(dto));
    }

}
