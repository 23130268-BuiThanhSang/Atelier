package com.atelier.ai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/** Cấu hình kết nối tới AI server (Colab) phân tích đánh giá sản phẩm. */
@Component
@ConfigurationProperties(prefix = "ai.sentiment")
@Getter
@Setter
public class SentimentProperties {

    /** Địa chỉ gốc của AI server, ví dụ https://xxxx.ngrok-free.app. Để trống = chưa cấu hình. */
    private String baseUrl = "";

    /** Đường dẫn endpoint dự đoán. */
    private String path = "/predict";

    /** Khóa gửi kèm header X-API-Key. */
    private String apiKey = "";

    /** Thời gian chờ kết nối tối đa (ms). */
    private int connectTimeoutMs = 5000;

    /** Thời gian chờ phản hồi tối đa (ms). Colab/GPU có thể chậm nên để rộng. */
    private int readTimeoutMs = 20000;
}
