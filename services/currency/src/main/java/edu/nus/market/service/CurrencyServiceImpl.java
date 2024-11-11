package edu.nus.market.service;

import edu.nus.market.converter.ConvertDateToISO;
import edu.nus.market.pojo.CurrenciesList;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ResEntity.ExchangeResponse;
import edu.nus.market.pojo.ReqEntity.UpdateCurrencyReq;
import edu.nus.market.pojo.ResEntity.ResCurrency;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    //extract parameters from application.yml
    @Value("${currencyLayer.api.url}")
    String URL;

    @Value("${currencyLayer.api.access-key}")
    String KEY;

    @Value("${currencyLayer.api.format}")
    String FORMAT;

    private static final String UPDATED_TIME_KEY = "updatedTime";
    private static final String SUBSCRIPTION_KEY = "subscription";
    private static final String SOURCE_CURRENCY = "SGD";

    @Resource
    private RedisTemplate<String, String> redisTemplate;


    @Override
    public ResponseEntity<Object> getCurrencyListService() {
        return ResponseEntity.ok(CurrenciesList.getAllCurrencies());
    }
    @Override
    public ResponseEntity<Object> getPreferredCurrencyService(String preferredCurrency) {

        Object currencyValueString;
        if (!preferredCurrency.equals("SGD")){
            // get target currency value from Redis
            currencyValueString = redisTemplate.opsForValue().get(SOURCE_CURRENCY+preferredCurrency);
            if (currencyValueString == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Preferred currency not found");
            }
        }else{
            currencyValueString = "1";
        }


        // parse currency value string to double
        double currencyValue;
        try {
            currencyValue = Double.parseDouble(currencyValueString.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid currency value format");
        }

        // get updated time from Redis
        String updatedTime = redisTemplate.opsForValue().get(UPDATED_TIME_KEY);
        if (updatedTime == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Updated time not found");
        }

        ResCurrency resCurrency = new ResCurrency(preferredCurrency, currencyValue, updatedTime);
        return ResponseEntity.status(HttpStatus.OK).body(resCurrency);
    }

    @Override
    public ResponseEntity<Object> updateCurrenciesService(UpdateCurrencyReq req) {

        if (req.getTargetCurrencies().isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        System.out.println(req);
        RestTemplate restTemplate = new RestTemplate();

        // construct url
        String url = String.format("%s?access_key=%s&currencies=%s&source=%s&format=%s",
            URL, KEY, String.join(", ", req.getTargetCurrencies()), req.getSourceCurrency(), FORMAT);
        //get feedback from CurrencyLayer
        ExchangeResponse exchangeResponse = restTemplate.getForObject(url, ExchangeResponse.class);

        if (exchangeResponse == null || exchangeResponse.getQuotes() == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.THIRD_PARTY_API_ERROR.ErrorMsg));
        // save currencies into Redis
        for (Map.Entry<String, Double> vo : exchangeResponse.getQuotes().entrySet()){
            redisTemplate.opsForValue().set(vo.getKey(), String.valueOf(vo.getValue()));
        }

        // update UPDATED_TIME_KEY in Redis
        redisTemplate.opsForValue().set(UPDATED_TIME_KEY, ConvertDateToISO.convert(new Date()));

        return ResponseEntity.status(HttpStatus.OK).body(exchangeResponse);
    }
    @Override
    @PostConstruct
    @Scheduled(cron = "0 0 */2 * * ?") // Every 5 minutes
    public void scheduleUpdateCurrencies() {
        // get all currency keys from Redis
        List<String> targetCurrencies = Optional.ofNullable(redisTemplate.keys("SGD*"))
            .orElse(Collections.emptySet())
            .stream()
            .map(key -> key.substring(3)) // 提取以 "SGD" 开头的键的后缀部分
            .collect(Collectors.toList());

        // check null
        if (targetCurrencies.isEmpty()) {
            return;
        }
        // set sourceCurrency
        String sourceCurrency = SOURCE_CURRENCY;

        UpdateCurrencyReq updateCurrencyReq = new UpdateCurrencyReq(targetCurrencies, sourceCurrency);

        // updateCurrenciesService
        updateCurrenciesService(updateCurrencyReq);
        System.out.println("Currencies updated");
    }




}
