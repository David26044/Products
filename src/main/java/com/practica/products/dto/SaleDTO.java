package com.practica.products.dto;

import java.math.BigDecimal;
import java.util.List;

public class SaleDTO {

    private List<DetailDTO> details;

    public List<DetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<DetailDTO> details) {
        this.details = details;
    }

}
