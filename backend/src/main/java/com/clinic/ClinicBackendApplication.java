package com.clinic;

import com.clinic.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(FileStorageProperties.class)
public class ClinicBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicBackendApplication.class, args);
	}

}
