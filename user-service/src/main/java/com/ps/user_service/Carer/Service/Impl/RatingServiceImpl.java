package com.ps.user_service.Carer.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ps.user_service.Carer.Dto.Request.RatingRequest;
import com.ps.user_service.Carer.Dto.Response.RatingResponse;
import com.ps.user_service.Carer.Model.Carer;
import com.ps.user_service.Carer.Model.Rating;
import com.ps.user_service.Carer.Repository.CarerRepository;
import com.ps.user_service.Carer.Repository.RatingRepository;
import com.ps.user_service.Carer.Service.Interface.IRatingService;
import com.ps.user_service.User.Models.User;
import com.ps.user_service.User.Repository.UserRepository;

@Service
public class RatingServiceImpl implements IRatingService {

    private final RatingRepository ratingRepository;
    private final CarerRepository carerRepository;
    private final UserRepository userRepository;

    public RatingServiceImpl(RatingRepository ratingRepository,
                             CarerRepository carerRepository,
                             UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.carerRepository = carerRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public RatingResponse createRating(Long carerId, RatingRequest request) {
        Carer carer = carerRepository.findById(carerId)
                .orElseThrow(() -> new RuntimeException("Carer not found with ID: " + carerId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        Rating rating = new Rating();
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());
        rating.setPunctuality(request.getPunctuality());
        rating.setTreatment(request.getTreatment());
        rating.setUser(user);
        rating.setCarer(carer);

        Rating saved = ratingRepository.save(rating);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByCarer(Long carerId) {
        if (!carerRepository.existsById(carerId)) {
            throw new RuntimeException("Carer not found with ID: " + carerId);
        }

        return ratingRepository.findByCarer_Id(carerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RatingResponse mapToResponse(Rating rating) {
        return new RatingResponse(
                rating.getId(),
                rating.getScore(),
                rating.getComment(),
                rating.getPunctuality(),
                rating.getTreatment(),
                rating.getUser() != null ? rating.getUser().getId() : null,
                rating.getCarer() != null ? rating.getCarer().getId() : null,
                rating.getCreatedAt()
        );
    }
}
