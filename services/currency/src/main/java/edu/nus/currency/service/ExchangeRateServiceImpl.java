package edu.nus.currency.service;

import edu.nus.currency.pojo.ResEntity.ExchangeResponse;
import edu.nus.currency.pojo.ReqEntity.UpdExgRatReq;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.TimeUnit;

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
    public ResponseEntity<Object> updateCurrenciesService(UpdExgRatReq req) {

        System.out.println(req);
        RestTemplate restTemplate = new RestTemplate();

        // construct url
        String url = String.format("%s?access_key=%s&currencies=%s&source=%s&format=%s",
            URL, KEY, String.join(", ", req.getTargetCurrencies()), req.getSourceCurrency(), FORMAT);
        //get feedback from CurrencyLayer
        ExchangeResponse exchangeResponse = restTemplate.getForObject(url, ExchangeResponse.class);

        for (Map.Entry<String, Double> vo : exchangeResponse.getQuotes().entrySet()){
//            TODO: set expire time when U really gonna use it
            redisTemplate.opsForValue().set(vo.getKey(), String.valueOf(vo.getValue()), 30, TimeUnit.SECONDS);
        }

        return ResponseEntity.status(HttpStatus.OK).body(exchangeResponse);
    }

    @Override
    public ResponseEntity<Object> getPreferredCurrencyService(String preferredCurrency) {
        return null;
    }


}
