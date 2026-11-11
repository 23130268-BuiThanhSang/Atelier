-- Migration: nhãn cảm xúc cho đánh giá sản phẩm (product_reviews)
-- Mục tiêu: lưu kết quả AI phân tích bình luận (POSITIVE / NEGATIVE / NEUTRAL).
-- Chạy thủ công trên DB Aiven giống các migration trong backend/db.
--
-- Lưu ý:
-- - Đánh giá cũ sẽ có sentiment = NULL (UI không hiển thị badge).
-- - NEUTRAL dùng cho bình luận rỗng hoặc khi AI server không phản hồi.

ALTER TABLE product_reviews
    ADD COLUMN sentiment VARCHAR(20) NULL AFTER comment;

-- Tăng tốc truy vấn/lọc đánh giá theo sản phẩm, trạng thái và cảm xúc.
CREATE INDEX idx_product_reviews_product_status_sentiment
    ON product_reviews (product_id, status, sentiment);
