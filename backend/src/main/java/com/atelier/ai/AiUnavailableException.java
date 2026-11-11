package com.atelier.ai;

/** AI server không phản hồi, trả lỗi hoặc chưa được cấu hình. */
public class AiUnavailableException extends RuntimeException {

    public AiUnavailableException(String message) {
        super(message);
    }

    public AiUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
