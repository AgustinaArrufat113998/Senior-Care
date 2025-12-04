package com.ps.careRequest_service.Dto.Request;

import com.ps.careRequest_service.Model.Enum.StatusRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusRequestDto {
    public StatusRequest status;
}
