package com.ps.SeniorCare.User.Dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CaregiverUpdateDto {
    private String studies;
    private String experience;
    private String availability;
    private Double rate;
    private String secondaryContact;
}
