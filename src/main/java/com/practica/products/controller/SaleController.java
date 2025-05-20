package com.practica.products.controller;

import com.practica.products.dto.SaleDTO;
import com.practica.products.entity.SaleEntity;
import com.practica.products.service.ISaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sale")
public class SaleController {

    @Autowired
    ISaleService saleService;

    @PostMapping
    public ResponseEntity<SaleEntity> postSale(@RequestBody SaleDTO dto){
        return ResponseEntity.ok(saleService.saveSale(dto));
    }

}
