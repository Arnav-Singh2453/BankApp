package org.arnav.bankapp;

import org.apache.catalina.core.ApplicationContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;

import java.lang.module.Configuration;
@SpringBootApplication(exclude = {
        DataSourceAutoConfiguration.class
})
public class BankAppApplication {

    public static void main(String[] args) {

        ConfigurableApplicationContext context =  SpringApplication.run(BankAppApplication.class, args);
    }

}
