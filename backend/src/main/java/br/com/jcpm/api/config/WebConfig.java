package br.com.jcpm.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração para servir arquivos estáticos do diretório de uploads.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${app.upload.dir:uploads/news-media}")
  private String uploadDir;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry
      .addResourceHandler("/uploads/**")
      .addResourceLocations("file:" + uploadDir + "/")
      .addResourceLocations("file:uploads/");
  }
}
