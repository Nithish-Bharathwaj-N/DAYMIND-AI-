package com.daymind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DayMindApplication {

    public static void main(String[] args) {
        SpringApplication.run(DayMindApplication.class, args);
        System.out.println("=================================================");
        System.out.println("☕ DayMind AI — Spring Boot 3 Engine Initialized!");
        System.out.println("H2 In-Memory DB: jdbc:h2:mem:dayminddb");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("REST API Port: 8080");
        System.out.println("=================================================");
    }
}
