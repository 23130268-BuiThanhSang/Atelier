package com.atelier.controller;

import com.atelier.design.dto.SaveDesignRequest;
import com.atelier.design.dto.MyDesignResponse;
import com.atelier.service.DesignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/designs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DesignController {

    private final DesignService designService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveDesign(@RequestBody SaveDesignRequest req) {
        return ResponseEntity.ok(designService.saveDesign(req, 1L));
    }

    @GetMapping("/my-designs")
    public ResponseEntity<List<MyDesignResponse>> getMyDesigns(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(designService.getMyDesigns(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MyDesignResponse> getDesignById(@PathVariable Long id) {
        return ResponseEntity.ok(designService.getDesignById(id));
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<MyDesignResponse> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(designService.toggleVisibility(id));
    }
}