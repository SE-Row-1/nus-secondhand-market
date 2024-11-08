
package edu.nus.market.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 根据需要禁用 CSRF
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().permitAll() // 允许其他请求
            )
            .formLogin(form -> form // 配置表单登录
                .permitAll() // 允许所有用户访问登录页
            );

        return http.build();
    }
}


