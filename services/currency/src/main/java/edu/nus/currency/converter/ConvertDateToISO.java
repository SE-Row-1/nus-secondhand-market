package edu.nus.currency.converter;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ConvertDateToISO {
    public static String convert(Date date) {
        SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        return isoFormat.format(date);
    }

}
