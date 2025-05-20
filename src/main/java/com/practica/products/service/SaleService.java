package com.practica.products.service;

import com.practica.products.dto.DetailDTO;
import com.practica.products.dto.SaleDTO;
import com.practica.products.entity.ProductEntity;
import com.practica.products.entity.SaleDetailEntity;
import com.practica.products.entity.SaleDetailPK;
import com.practica.products.entity.SaleEntity;
import com.practica.products.exception.InsufficientStockException;
import com.practica.products.exception.ResourceNotFoundException;
import com.practica.products.repository.ProductRepository;
import com.practica.products.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class SaleService implements ISaleService{

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private IProductService productService;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<SaleEntity> getAllSales() {
        return saleRepository.findAll();
    }

    @Override
    public SaleEntity getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la venta con ID: " + id));
    }


    /*1. Obtengo todos los productos. Para esto hago una lista con IDS y los consulto
    * 2. calcular subtotal y verificar quantity en cada rol
    * 3. Armar lista de detalles
    * 4. settear la lista en sale
    * 5. Armar el objeto sale*/
    @Override
    public SaleEntity saveSale(SaleDTO saleDTO) {
        // Crear la venta que voy a settear y guardar
        SaleEntity saleSaved = new SaleEntity();

        //Lista de detalles que voy a llenar y luego settear en la venta
        List<SaleDetailEntity> details = new ArrayList<>();
        List<Long> productsIds = new ArrayList<>();

        //Comienzo recorriendo la lista, almacenando IDS en una lista
        for(DetailDTO saleDetail : saleDTO.getDetails()) {
            productsIds.add(saleDetail.getProductId());
        }

        List<ProductEntity> productsList = productRepository.findAllById(productsIds);

        //Debo de recorrer details y a cada detail buscarle su producto
        //Hacer dos ciclos anidados es poco eficiente, mejor armar un HashMap para obtener cada producto en O(1)
        Map<Long, ProductEntity> productsMap = new HashMap<>();

        //Agrego cada producto al Map
        for(ProductEntity product : productsList) {
            productsMap.put(product.getId(), product);
        }

        //Proceso cada detalle de venta, primero verifico todos si está el stock necesario y si existen
        //Comienzo recorriendo la lista, almacenando IDS en una lista
        BigDecimal total = BigDecimal.ZERO;//Para setearlo a la venta al final.
        for(DetailDTO saleDetail : saleDTO.getDetails()) {

            SaleDetailEntity detailEntity = new SaleDetailEntity();
            ProductEntity product = productsMap.get(saleDetail.getProductId());

            if (product == null){
                saleRepository.delete(saleSaved);
                throw new ResourceNotFoundException("No existe el producto con ID: " + saleDetail.getProductId());
            }

            if (product.getStock() < saleDetail.getQuantity()){
                saleRepository.delete(saleSaved);
                throw new InsufficientStockException("Stock insuficiente para el producto con ID: " + saleDetail.getProductId());
            }

            //Significa que si es valido entonces armo el detalle.
            //Primero la pk
            SaleDetailPK pk = new SaleDetailPK();
            pk.setProductId(product.getId());

            //Seteo los valores del detalle
            detailEntity.setId(pk);
            detailEntity.setProduct(product);
            detailEntity.setSale(saleSaved);
            detailEntity.setUnitPrice(product.getPrice());
            detailEntity.setQuantity(saleDetail.getQuantity());
            detailEntity.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(saleDetail.getQuantity())));
            total =total.add(detailEntity.getSubtotal());

            //guardo el detalle en la lista.
            details.add(detailEntity);
        }

        for(SaleDetailEntity detail: details){
            productService.reduceStock(detail.getProduct(), detail.getQuantity());
        }

        saleSaved.setDetails(details);
        saleSaved.setTotal(total);
        saleRepository.save(saleSaved);
        return saleSaved;
    }


    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }
}
