package com.ps.careRequest_service.Service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.PaymentInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.PaymentInfoResponseDto;
import com.ps.careRequest_service.Repository.PaymentInfoRepository;
import com.ps.careRequest_service.Service.Interface.IPaymentInfoService;

@Service
public class PaymentInfoServiceImpl implements IPaymentInfoService {
    private final PaymentInfoRepository paymentInfoRepository;

    public PaymentInfoServiceImpl(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    @Override
    public PaymentInfoResponseDto createPaymentInfo(PaymentInfoRequestDto paymentInfoRequestDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createPaymentInfo'");
    }

    @Override
    public List<PaymentInfoResponseDto> getAllPaymentInfos() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllPaymentInfos'");
    }

    @Override
    public PaymentInfoResponseDto getPaymentInfoById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPaymentInfoById'");
    }

    @Override
    public PaymentInfoResponseDto updatePaymentInfo(Long id, PaymentInfoRequestDto paymentInfoRequestDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updatePaymentInfo'");
    }

    @Override
    public void deletePaymentInfo(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deletePaymentInfo'");
    }
    
}
