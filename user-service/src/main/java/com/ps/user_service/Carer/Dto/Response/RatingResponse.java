package com.ps.user_service.Carer.Dto.Response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Long id;
    private int score;
    private String comment;
    private String punctuality;
    private String treatment;
    private Long userId;
    private Long carerId;
    private LocalDateTime createdAt;
}
