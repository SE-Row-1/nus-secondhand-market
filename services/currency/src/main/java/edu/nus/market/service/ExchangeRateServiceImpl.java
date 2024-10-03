package edu.nus.market.service;

import edu.nus.market.pojo.exchangeRate.ExchangeResponse;
import edu.nus.market.pojo.exchangeRate.UpdExgRatReq;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExchangeRateServiceImpl implements edu.nus.market.service.exchangeRate.ExchangeRateService {

    //extract parameters from application.yml
    @Value("${currencyLayer.api.url}")
    String URL;

    @Value("${currencyLayer.api.access-key}")
    String KEY;

    @Value("${currencyLayer.api.format}")
    String FORMAT;


    @Override
    public ResponseEntity<Object> updateExchangeRate(UpdExgRatReq req) {

        System.out.println(req);
        RestTemplate restTemplate = new RestTemplate();

        // construct url
        String url = String.format("%s?access_key=%s&currencies=%s&source=%s&format=%s",
            URL, KEY, String.join(", ", req.getTargetCurrencies()), req.getSourceCurrency(), FORMAT);
        //get feedback from CurrencyLayer
        ExchangeResponse exchangeResponse = restTemplate.getForObject(url, ExchangeResponse.class);

        return ResponseEntity.status(HttpStatus.OK).body(exchangeResponse);
    }
}
