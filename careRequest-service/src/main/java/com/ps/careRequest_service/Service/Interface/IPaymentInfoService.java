package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.PaymentInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.PaymentInfoResponseDto;

public interface IPaymentInfoService {
    PaymentInfoResponseDto createPaymentInfo(PaymentInfoRequestDto paymentInfoRequestDto);
    List<PaymentInfoResponseDto> getAllPaymentInfos();
    PaymentInfoResponseDto getPaymentInfoById(Long id);
    PaymentInfoResponseDto updatePaymentInfo(Long id, PaymentInfoRequestDto paymentInfoRequestDto);
    void deletePaymentInfo(Long id);
}
