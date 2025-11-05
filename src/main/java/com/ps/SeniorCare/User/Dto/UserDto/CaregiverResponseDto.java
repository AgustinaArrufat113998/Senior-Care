package com.ps.SeniorCare.User.Dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CaregiverResponseDto {
    private String name;
    private String email;
    private String studies;
    private String availability;
    private Double rate;
}