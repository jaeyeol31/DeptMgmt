//package yeol.boot.begin.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.SecurityFilterChain;
//import yeol.boot.begin.emp.service.CustomUserDetailsService;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http
////            .cors() // CORS 설정 허용
////            .and()
////            .authorizeHttpRequests(auth -> auth
////                .requestMatchers("/login", "/resources/**", "/api/auth/**").permitAll() // "/api/auth/**" 추가
////                .anyRequest().authenticated()
////            )
////            .formLogin(form -> form
////            	    .loginPage("/login")
////            	    .loginProcessingUrl("/perform_login")  // 실제 로그인 요청 경로
////            	    .permitAll()
////            	    .defaultSuccessUrl("/home", true)
////            	)
////            .logout(logout -> logout
////                .permitAll()
////            )
////            .sessionManagement(session -> session
////                .maximumSessions(1) // 한 사용자당 하나의 세션만 허용
////            );
//        http
//        .cors() // CORS 설정 허용
//        .and()
//        .csrf().disable() // CSRF 비활성화 (선택 사항)
//        .authorizeHttpRequests(auth -> auth
//            .anyRequest().permitAll() // 모든 요청 허용
//        );
//        return http.build();
//    }
//
//    @Bean
//    public UserDetailsService userDetailsService() {
//        return new CustomUserDetailsService();
//    }
//}
package yeol.boot.begin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import yeol.boot.begin.emp.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors() // CORS 설정 허용
            .and()
            .csrf().disable() // CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // 모든 요청 허용
            );
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }
}

