package com.atelier.common.exception;

import org.springframework.http.HttpStatus;

/** Mã lỗi dùng chung cho API theo quy ước README. */
public enum ErrorCode {
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm đang hoạt động"),
    CLOUDINARY_NOT_CONFIGURED(HttpStatus.SERVICE_UNAVAILABLE, "Cloudinary chưa được cấu hình"),
    FILE_UPLOAD_FAILED(HttpStatus.BAD_GATEWAY, "Upload file lên Cloudinary thất bại"),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "Định dạng file không được hỗ trợ"),
    FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE, "File vượt quá kích thước cho phép"),
    CART_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy giỏ hàng"),
    CART_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong giỏ hàng"),
    VARIANT_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy biến thể sản phẩm"),
    INSUFFICIENT_STOCK(HttpStatus.BAD_REQUEST, "Số lượng tồn kho không đủ");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
