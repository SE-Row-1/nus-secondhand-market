package edu.nus.currency.service;

import edu.nus.currency.pojo.ExchangeResponse;
import edu.nus.currency.pojo.UpdExgRatReq;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ExchangeRateServiceImpl implements ExchangeRateService {

    //extract parameters from application.yml
    @Value("${currencyLayer.api.url}")
    String URL;

    @Value("${currencyLayer.api.access-key}")
    String KEY;

    @Value("${currencyLayer.api.format}")
    String FORMAT;

    @Resource
    private RedisTemplate<String, String> redisTemplate;


    @Override
    public ResponseEntity<Object> updateExchangeRate(UpdExgRatReq req) {

        System.out.println(req);
        RestTemplate restTemplate = new RestTemplate();

        // construct url
        String url = String.format("%s?access_key=%s&currencies=%s&source=%s&format=%s",
            URL, KEY, String.join(", ", req.getTargetCurrencies()), req.getSourceCurrency(), FORMAT);
        //get feedback from CurrencyLayer
        ExchangeResponse exchangeResponse = restTemplate.getForObject(url, ExchangeResponse.class);

        for (Map.Entry<String, Double> vo : exchangeResponse.getQuotes().entrySet()){
            redisTemplate.opsForValue().append(vo.getKey(), String.valueOf(vo.getValue()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(exchangeResponse);
    }


}
