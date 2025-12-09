package com.ps.user_service.Carer.Service.Interface;

import java.util.List;

import com.ps.user_service.Carer.Dto.Request.RatingRequest;
import com.ps.user_service.Carer.Dto.Response.RatingResponse;

public interface IRatingService {
    RatingResponse createRating(Long carerId, RatingRequest request);

    List<RatingResponse> getRatingsByCarer(Long carerId);
}
