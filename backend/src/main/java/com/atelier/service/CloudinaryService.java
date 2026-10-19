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

    /**
     * Xóa ảnh trên Cloudinary bằng URL đầy đủ
     */
    public boolean deleteImageByUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return false; // Bỏ qua nếu là ảnh ngoài như Picsum, Unsplash
        }

        try {
            String publicId = extractPublicId(imageUrl);
            if (publicId != null) {
                Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Đã xóa ảnh Cloudinary public_id {}: {}", publicId, result.get("result"));
                return "ok".equals(result.get("result"));
            }
        } catch (Exception e) {
            log.error("Lỗi khi xóa ảnh Cloudinary {}: {}", imageUrl, e.getMessage());
        }
        return false;
    }

    /**
     * Trích xuất public_id kèm folder từ URL Cloudinary
     * Ví dụ: https://res.cloudinary.com/demo/image/upload/v1234567/atelier/products/sample.jpg
     * -> atelier/products/sample
     */
    private String extractPublicId(String imageUrl) {
        try {
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) return null;

            String pathAfterUpload = imageUrl.substring(uploadIndex + 8); // Bỏ qua "/upload/"
            // Bỏ version nếu có (ví dụ: "v162817281/")
            if (pathAfterUpload.startsWith("v") && pathAfterUpload.indexOf("/") != -1) {
                pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf("/") + 1);
            }
            // Bỏ phần đuôi mở rộng file (.jpg, .png, .webp)
            int dotIndex = pathAfterUpload.lastIndexOf(".");
            if (dotIndex != -1) {
                return pathAfterUpload.substring(0, dotIndex);
            }
            return pathAfterUpload;
        } catch (Exception e) {
            return null;
        }
    }
}