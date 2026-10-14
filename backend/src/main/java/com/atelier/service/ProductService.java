package com.atelier.service;

import com.atelier.catalog.dto.ProductCatalogResponse;
import com.atelier.catalog.dto.ProductRatingSummary;
import com.atelier.catalog.entity.Product;
import com.atelier.catalog.entity.ProductImage;
import com.atelier.catalog.entity.ProductVariant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.atelier.repository.ProductImageRepository;
import com.atelier.repository.ProductRepository;
import com.atelier.repository.ProductReviewRepository;
import com.atelier.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private static final String ACTIVE = "ACTIVE";
    private static final String VISIBLE = "VISIBLE";

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductReviewRepository productReviewRepository;

    public List<ProductCatalogResponse> getActiveProducts() {
        List<Product> products = productRepository.findByStatusIgnoreCaseOrderByCreatedAtDesc(ACTIVE);
        if (products.isEmpty()) {
            return List.of();
        }

        List<Long> productIds = products.stream()
                .map(Product::getId)
                .toList();

        Map<Long, String> imageByProductId = loadPrimaryImages(productIds);
        Map<Long, ProductFacets> facetsByProductId = loadActiveVariantFacets(productIds);
        Map<Long, ProductRatingSummary> ratingsByProductId = productReviewRepository
                .summarizeByProductIds(productIds, VISIBLE)
                .stream()
                .collect(Collectors.toMap(ProductRatingSummary::productId, summary -> summary));

        return products.stream()
                .map(product -> toCatalogResponse(
                        product,
                        imageByProductId.get(product.getId()),
                        facetsByProductId.get(product.getId()),
                        ratingsByProductId.get(product.getId())
                ))
                .toList();
    }

    private Map<Long, String> loadPrimaryImages(List<Long> productIds) {
        Map<Long, String> imageByProductId = new HashMap<>();
        for (ProductImage image : productImageRepository.findCatalogImages(productIds)) {
            imageByProductId.putIfAbsent(image.getProduct().getId(), image.getImageUrl());
        }
        return imageByProductId;
    }

    private Map<Long, ProductFacets> loadActiveVariantFacets(List<Long> productIds) {
        Map<Long, Set<String>> colorsByProductId = new HashMap<>();
        Map<Long, Set<String>> sizesByProductId = new HashMap<>();

        for (ProductVariant variant : productVariantRepository.findActiveCatalogVariants(productIds)) {
            Long productId = variant.getProduct().getId();
            colorsByProductId.computeIfAbsent(productId, ignored -> new LinkedHashSet<>())
                    .add(variant.getColor());
            sizesByProductId.computeIfAbsent(productId, ignored -> new LinkedHashSet<>())
                    .add(variant.getSize());
        }

        Map<Long, ProductFacets> facetsByProductId = new HashMap<>();
        for (Long productId : productIds) {
            facetsByProductId.put(productId, new ProductFacets(
                    new ArrayList<>(colorsByProductId.getOrDefault(productId, Set.of())),
                    new ArrayList<>(sizesByProductId.getOrDefault(productId, Set.of()))
            ));
        }
        return facetsByProductId;
    }

    private ProductCatalogResponse toCatalogResponse(
            Product product,
            String imageUrl,
            ProductFacets facets,
            ProductRatingSummary ratingSummary
    ) {
        double averageRating = ratingSummary == null || ratingSummary.averageRating() == null
                ? 0.0
                : ratingSummary.averageRating();
        long reviewCount = ratingSummary == null || ratingSummary.reviewCount() == null
                ? 0L
                : ratingSummary.reviewCount();

        return new ProductCatalogResponse(
                product.getId(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getBasePrice(),
                imageUrl,
                facets == null ? List.of() : facets.colors(),
                facets == null ? List.of() : facets.sizes(),
                product.getViewCount() == null ? 0 : product.getViewCount(),
                product.getSoldCount() == null ? 0 : product.getSoldCount(),
                product.getCreatedAt(),
                averageRating,
                reviewCount
        );
    }

    private record ProductFacets(List<String> colors, List<String> sizes) {
    }
}
