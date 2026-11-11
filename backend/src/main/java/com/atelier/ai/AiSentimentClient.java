package com.atelier.ai;

import com.atelier.ai.dto.AiPredictRequest;
import com.atelier.ai.dto.AiPredictResponse;
import java.net.http.HttpClient;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Gọi AI server (FastAPI trên Colab) để kiểm tra độ liên quan và cảm xúc của bình luận. */
@Slf4j
@Component
public class AiSentimentClient {

    private static final String NGROK_SKIP_HEADER = "ngrok-skip-browser-warning";
    private static final String API_KEY_HEADER = "X-API-Key";
    private static final String DEFAULT_PATH = "/predict";

    private final SentimentProperties properties;
    private final RestClient restClient;

    public AiSentimentClient(SentimentProperties properties) {
        this.properties = properties;

        if (properties.getBaseUrl() == null || properties.getBaseUrl().isBlank()) {
            this.restClient = null;
            log.info("AI sentiment server chưa được cấu hình (ai.sentiment.base-url trống).");
            return;
        }

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(Math.max(properties.getConnectTimeoutMs(), 1000)))
                .build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofMillis(Math.max(properties.getReadTimeoutMs(), 1000)));

        String baseUrl = trimTrailingSlash(properties.getBaseUrl().trim());
        String path = resolvePath();
        // Cho phép dán thẳng URL đầy đủ (.../predict) mà không bị lặp path.
        if (baseUrl.endsWith(path)) {
            baseUrl = trimTrailingSlash(baseUrl.substring(0, baseUrl.length() - path.length()));
        }

        RestClient.Builder builder = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                // Ngrok free hiện trang cảnh báo cho request dạng trình duyệt, header này bỏ qua trang đó.
                .defaultHeader(NGROK_SKIP_HEADER, "true");

        if (properties.getApiKey() != null && !properties.getApiKey().isBlank()) {
            builder.defaultHeader(API_KEY_HEADER, properties.getApiKey().trim());
        }

        this.restClient = builder.build();
    }

    /**
     * Phân tích một bình luận.
     *
     * @throws AiUnavailableException khi chưa cấu hình, timeout hoặc server trả lỗi.
     */
    public AiPredictResponse analyze(String comment) {
        if (restClient == null) {
            throw new AiUnavailableException("AI sentiment server chưa được cấu hình");
        }

        try {
            AiPredictResponse response = restClient.post()
                    .uri(resolvePath())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new AiPredictRequest(comment))
                    .retrieve()
                    .body(AiPredictResponse.class);

            if (response == null) {
                throw new AiUnavailableException("AI sentiment server trả về dữ liệu rỗng");
            }
            return response;
        } catch (AiUnavailableException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new AiUnavailableException("Không gọi được AI sentiment server", ex);
        }
    }

    private String resolvePath() {
        if (properties.getPath() == null || properties.getPath().isBlank()) {
            return DEFAULT_PATH;
        }
        String path = properties.getPath().trim();
        return path.startsWith("/") ? path : "/" + path;
    }

    private String trimTrailingSlash(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
