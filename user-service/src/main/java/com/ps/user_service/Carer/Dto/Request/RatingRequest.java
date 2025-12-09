package com.ps.user_service.Carer.Dto.Request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {
    @Min(1)
    @Max(5)
    private int score;
    private String comment;
    private String punctuality;
    private String treatment;

    @NotNull
    private Long userId;
}
