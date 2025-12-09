package com.ps.user_service.Carer.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ps.user_service.Carer.Dto.Request.RatingRequest;
import com.ps.user_service.Carer.Dto.Response.RatingResponse;
import com.ps.user_service.Carer.Service.Interface.IRatingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/carer/{carerId}/ratings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RatingController {

    private final IRatingService ratingService;

    public RatingController(IRatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<RatingResponse> createRating(@PathVariable("carerId") Long carerId,
                                                       @Valid @RequestBody RatingRequest request) {
        RatingResponse created = ratingService.createRating(carerId, request);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<RatingResponse>> getRatings(@PathVariable("carerId") Long carerId) {
        List<RatingResponse> ratings = ratingService.getRatingsByCarer(carerId);
        if (ratings.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ratings);
    }
}
