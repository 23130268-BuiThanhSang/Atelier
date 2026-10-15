package com.atelier.controller;

import com.atelier.catalog.dto.ProductCatalogResponse;
import java.util.List;

import com.atelier.catalog.dto.ProductDetailResponse;
import com.atelier.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** API công khai cho trang Catalog; trả trực tiếp mảng JSON theo README mục 10. */
    @GetMapping
    public List<ProductCatalogResponse> getProducts() {
        return productService.getActiveProducts();
    }
    /** API công khai cho trang chi tiết; chỉ trả sản phẩm đang ACTIVE. */
    @GetMapping("/{id}")
    public ProductDetailResponse getProductById(@PathVariable Long id) {
        return productService.getActiveProductById(id);
    }
}
