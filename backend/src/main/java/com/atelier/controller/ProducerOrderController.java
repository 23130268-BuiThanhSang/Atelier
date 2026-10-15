package com.atelier.controller;

import com.atelier.production.dto.ProducerOrderDto;
import com.atelier.service.ProducerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/producer/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProducerOrderController {

    private final ProducerOrderService producerOrderService;

    @GetMapping
    public ResponseEntity<List<ProducerOrderDto.ListItem>> getProducerOrders(
            @RequestParam(value = "tab", defaultValue = "all") String tab
    ) {
        return ResponseEntity.ok(producerOrderService.getProducerOrders(tab));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProducerOrderDto.Detail> getOrderDetail(@PathVariable("id") Long id) {
        return ResponseEntity.ok(producerOrderService.getOrderDetail(id));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<Map<String, String>> updateProgress(
            @PathVariable("id") Long id,
            @RequestBody ProducerOrderDto.UpdateProgressRequest req
    ) {
        producerOrderService.updateProgress(id, req);
        return ResponseEntity.ok(Map.of("message", "Cập nhật tiến độ sản xuất thành công"));
    }
}