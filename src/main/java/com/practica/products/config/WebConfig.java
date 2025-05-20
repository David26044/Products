package com.practica.products.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permitir todas las rutas
                .allowedOrigins("http://localhost:8080") // Cambia esto según el dominio de tu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Métodos permitidos
                .allowedHeaders("*") // Permitir todos los encabezados
                .allowCredentials(true); // Permitir credenciales
    }
}