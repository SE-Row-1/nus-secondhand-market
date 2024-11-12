package edu.nus.market.ServiceTests;

import edu.nus.market.pojo.ResEntity.EmailMessage;
import edu.nus.market.pojo.ResEntity.UpdateCurrencyMessage;
import edu.nus.market.pojo.ResEntity.UpdateMessage;
import edu.nus.market.service.MQServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class MQServiceImplTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private MQServiceImpl mqService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendEmailMessage() {
        EmailMessage emailMessage = new EmailMessage("test@example.com", "OTP Code", "Your OTP is 123456");

        mqService.sendEmailMessage(emailMessage);

        verify(rabbitTemplate, times(1)).convertAndSend(eq("notification"), eq("email"), eq(emailMessage));
    }

    @Test
    public void testSendUpdateMessage() {
        UpdateMessage updateMessage = new UpdateMessage(1, "testAccount", "https://avatar.com");

        mqService.sendUpdateMessage(updateMessage);

        verify(rabbitTemplate, times(1)).convertAndSend(eq("account"), eq("account.updated.success"), eq(updateMessage));
    }

    @Test
    public void testSendDeleteMessageWithoutCurrency() {
        String message = "Account deleted successfully";

        mqService.sendDeleteMessage(message, null);

        verify(rabbitTemplate, times(1)).convertAndSend(eq("account"), eq("account.deleted.success"), eq(message));
        verify(rabbitTemplate, times(0)).convertAndSend(eq("currency"), eq("currency.account.currencyDeleted.success"), eq(message));
    }

    @Test
    public void testSendDeleteMessageWithCurrency() {
        String message = "Account deleted successfully";
        String currency = "USD";

        mqService.sendDeleteMessage(message, currency);

        verify(rabbitTemplate, times(1)).convertAndSend(eq("account"), eq("account.deleted.success"), eq(message));
        verify(rabbitTemplate, times(1)).convertAndSend(eq("currency"), eq("currency.account.currencyDeleted.success"), eq(message));
    }

    @Test
    public void testSendCurrencyMessage() {
        UpdateCurrencyMessage updateCurrencyMessage = new UpdateCurrencyMessage("USD", "Exchange rate updated");

        mqService.sendCurrencyMessage(updateCurrencyMessage);

        verify(rabbitTemplate, times(1)).convertAndSend(eq("currency"), eq("currency.updated.success"), eq(updateCurrencyMessage));
    }
}

