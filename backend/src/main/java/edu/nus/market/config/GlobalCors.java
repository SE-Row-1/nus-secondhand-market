package edu.nus.market.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCors implements WebMvcConfigurer {

    // Inject EC2 public IP from the custom field in application.yaml
    @Value("${custom.ec2-public-ip}")
    private String ec2PublicIp;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Build allowed origins dynamically using the injected IP
        String[] allowedOrigins = new String[] {
            "http://" + ec2PublicIp,
            "http://localhost"
        };

        registry.addMapping("/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}

