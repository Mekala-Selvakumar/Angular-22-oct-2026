package com.example.productservice.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import com.example.productservice.model.Product;
import java.util.List;

@RestController 
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping ("/api/products")
public class ProductController {

    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {

        List<Product> products = List.of(
            new Product(1, "Product 1", 100),
            new Product(2, "Product 2", 200),
            new Product(3, "Product 3", 300)
        );
        System.out.println("Products: " + products);
        return ResponseEntity.ok(products);
    }

}
