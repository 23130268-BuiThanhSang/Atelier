-- Migration: đánh giá sản phẩm (product_reviews)
-- Mục tiêu: cho phép đánh giá không gắn đơn hàng và mỗi người dùng chỉ 1 đánh giá / sản phẩm.
-- Đã chạy trên DB Aiven ngày 29/10/2026.
--
-- Lưu ý: bảng product_reviews đã tồn tại từ trước.
-- Kiểm tra trùng trước khi thêm unique mới:
--   SELECT user_id, product_id, COUNT(*) FROM product_reviews
--   GROUP BY user_id, product_id HAVING COUNT(*) > 1;

-- 1. Cho phép order_id rỗng (đánh giá không bắt buộc phải có đơn hàng).
ALTER TABLE product_reviews MODIFY order_id BIGINT NULL;

-- 2. Mỗi người dùng chỉ đánh giá một sản phẩm một lần.
--    Thêm unique mới trước để cột user_id vẫn có index phục vụ khóa ngoại.
ALTER TABLE product_reviews
    ADD CONSTRAINT uk_product_reviews_user_product UNIQUE (user_id, product_id);

-- 3. Bỏ unique key cũ (user_id, order_id, product_id).
ALTER TABLE product_reviews DROP INDEX product_reviews_index_3;

-- 4. Tăng tốc truy vấn danh sách đánh giá theo sản phẩm + trạng thái.
CREATE INDEX idx_product_reviews_product_status
    ON product_reviews (product_id, status);
