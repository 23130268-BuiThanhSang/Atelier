package com.atelier.service;

import com.atelier.common.config.CloudinaryProperties;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;

    /**
     * Upload ảnh dạng MultipartFile (file đính kèm tải từ máy tính)
     */
    public Map<?, ?> uploadImage(MultipartFile file, String subFolder) throws IOException {
        String targetFolder = resolveFolder(subFolder);

        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", targetFolder
                )
        );
    }

    /**
     * Upload ảnh từ chuỗi Base64 / Data URL (xuất trực tiếp từ Canvas Studio)
     * @param base64Content Chuỗi bắt đầu bằng "data:image/..." hoặc Base64 raw
     * @param subFolder Thư mục con (ví dụ: "designs", "avatars")
     * @return URL ảnh an toàn (secure_url)
     */
    public String uploadBase64(String base64Content, String subFolder) throws IOException {
        if (base64Content == null || base64Content.isBlank()) {
            return null;
        }

        String targetFolder = resolveFolder(subFolder);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                base64Content,
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", targetFolder
                )
        );

        return (String) uploadResult.get("secure_url");
    }

    private String resolveFolder(String subFolder) {
        String rootFolder = properties.getDefaultFolder() != null ? properties.getDefaultFolder() : "atelier";
        if (subFolder == null || subFolder.isBlank()) {
            return rootFolder;
        }
        return rootFolder + "/" + subFolder;
    }
}