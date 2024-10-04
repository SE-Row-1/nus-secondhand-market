
package edu.nus.market.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


@Configuration
@EnableWebSecurity
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
            // .addFilter(new CorsFilter(corsConfigurationSource())); // 手动添加 CORS 过滤器
        return http.build();
    }
    //    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.addAllowedOrigin("http://localhost"); // 允许的域名"http://13.212.58.250", "http://localhost"
//        configuration.addAllowedOrigin("http://13.212.58.250");
//        configuration.addAllowedMethod("GET"); // 允许的 HTTP 方法
//        configuration.addAllowedMethod("POST");
//        configuration.addAllowedMethod("PUT");
//        configuration.addAllowedMethod("DELETE");
//        configuration.addAllowedMethod("PATCH");
//        configuration.addAllowedMethod("OPTION");
//        configuration.addAllowedMethod("HEAD");
//        configuration.addAllowedHeader("*"); // 允许所有的请求头
//        configuration.setAllowCredentials(true); // 允许携带认证信息（如 Cookies）
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration); // 应用到所有路径
//        return source;
//    }
}


