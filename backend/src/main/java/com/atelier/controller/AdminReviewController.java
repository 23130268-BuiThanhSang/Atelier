package com.atelier.controller;

import com.atelier.catalog.dto.AdminReviewPageResponse;
import com.atelier.catalog.dto.AdminReviewResponse;
import com.atelier.catalog.dto.UpdateReviewStatusRequest;
import com.atelier.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** API quản trị đánh giá sản phẩm. */
@RestController
@RequestMapping("/api/v1/admin/reviews")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public AdminReviewPageResponse getReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String status
    ) {
        return reviewService.getAdminReviews(page, size, keyword, rating, status);
    }

    /** Ẩn hoặc hiện lại một đánh giá. */
    @PatchMapping("/{id}/status")
    public AdminReviewResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewStatusRequest request
    ) {
        return reviewService.updateReviewStatus(id, request.status());
    }

    /** Xóa vĩnh viễn một đánh giá. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReviewAsAdmin(id);
    }
}
