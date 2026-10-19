package com.atelier.design.dto;

import java.time.LocalDateTime;
import java.util.List;

public record MyDesignResponse(
        Long designId,
        String name,
        String visibility, // "PRIVATE" hoặc "PUBLIC"
        Long latestVersionId,
        Integer versionNumber,
        String garmentColor,
        String previewImageUrl,
        LocalDateTime updatedAt,
        List<SaveDesignRequest.ElementDto> elements
) {}