package com.atelier.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Phản hồi từ AI server.
 *
 * <p>{@code relevant = 1} nghĩa là bình luận liên quan tới sản phẩm; khi đó server mới
 * trả thêm {@code sentiment} (1 = positive, 0 = negative) và {@code sentimentLabel}.
 * Với bình luận không liên quan, các trường sentiment bằng {@code null}.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AiPredictResponse(
        String comment,
        Integer relevant,
        @JsonProperty("relevant_label") String relevantLabel,
        @JsonProperty("prob_relevant") List<Double> probRelevant,
        Integer sentiment,
        @JsonProperty("sentiment_label") String sentimentLabel,
        @JsonProperty("prob_sentiment") List<Double> probSentiment
) {
}
