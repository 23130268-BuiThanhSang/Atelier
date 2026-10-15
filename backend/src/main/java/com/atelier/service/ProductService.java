package com.atelier.service;

import com.atelier.catalog.dto.ProductCatalogResponse;
import com.atelier.catalog.dto.ProductDetailResponse;
import com.atelier.catalog.dto.ProductVariantResponse;
import com.atelier.common.exception.BusinessException;
import com.atelier.common.exception.ErrorCode;
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

    /**
     * Trả dữ liệu cần cho trang chi tiết, gồm tất cả ảnh, các biến thể ACTIVE
     * và điểm tổng hợp từ product_reviews. Không đọc bảng reviews.
     */
    public ProductDetailResponse getActiveProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .filter(item -> ACTIVE.equalsIgnoreCase(item.getStatus()))
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        List<String> imageUrls = productImageRepository.findProductImages(productId).stream()
                .map(ProductImage::getImageUrl)
                .filter(url -> url != null && !url.isBlank())
                .distinct()
                .toList();

        List<ProductVariant> activeVariants = productVariantRepository
                .findActiveCatalogVariants(List.of(productId));
        List<ProductVariantResponse> variants = activeVariants.stream()
                .map(variant -> new ProductVariantResponse(
                        variant.getId(),
                        variant.getSku(),
                        variant.getSize(),
                        variant.getColor(),
                        variant.getPrice(),
                        variant.getStockQuantity() == null ? 0 : variant.getStockQuantity()))
                .toList();

        List<String> colors = activeVariants.stream()
                .map(ProductVariant::getColor)
                .filter(value -> value != null && !value.isBlank())
                .distinct()
                .toList();
        List<String> sizes = activeVariants.stream()
                .map(ProductVariant::getSize)
                .filter(value -> value != null && !value.isBlank())
                .distinct()
                .toList();

        ProductRatingSummary rating = productReviewRepository
                .summarizeByProductIds(List.of(productId), VISIBLE)
                .stream()
                .findFirst()
                .orElse(null);
        Double averageRating = rating == null || rating.averageRating() == null
                ? 0.0 : rating.averageRating();
        Long reviewCount = rating == null || rating.reviewCount() == null
                ? 0L : rating.reviewCount();

        return new ProductDetailResponse(
                product.getId(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getBasePrice(),
                imageUrls.isEmpty() ? null : imageUrls.get(0),
                imageUrls,
                colors,
                sizes,
                variants,
                product.getViewCount() == null ? 0 : product.getViewCount(),
                product.getSoldCount() == null ? 0 : product.getSoldCount(),
                product.getCreatedAt(),
                averageRating,
                reviewCount
        );
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
