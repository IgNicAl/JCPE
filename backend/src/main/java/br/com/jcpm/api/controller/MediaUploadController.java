package br.com.jcpm.api.controller;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controlador REST para gerenciar upload de mídia (imagens e vídeos).
 */
@RestController
@RequestMapping("/api/media")
public class MediaUploadController {

  @Value("${app.upload.dir:uploads/news-media}")
  private String uploadDir;

  private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp"
  );

  private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
    "video/mp4",
    "video/webm",
    "video/quicktime" // .mov
  );

  private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
  private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

  /**
   * Faz upload de um arquivo de mídia (imagem ou vídeo).
   *
   * @param file Arquivo enviado
   * @return URL do arquivo carregado
   */
  @PostMapping("/upload")
  public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
      // Validar se o arquivo está vazio
      if (file.isEmpty()) {
        return ResponseEntity.badRequest().body(createErrorResponse("Arquivo vazio"));
      }

      // Detectar tipo de mídia
      String contentType = file.getContentType();
      if (contentType == null) {
        return ResponseEntity.badRequest().body(createErrorResponse("Tipo de arquivo não identificado"));
      }

      String mediaType;
      long maxSize;

      if (ALLOWED_IMAGE_TYPES.contains(contentType)) {
        mediaType = "image";
        maxSize = MAX_IMAGE_SIZE;
      } else if (ALLOWED_VIDEO_TYPES.contains(contentType)) {
        mediaType = "video";
        maxSize = MAX_VIDEO_SIZE;
      } else {
        return ResponseEntity.badRequest().body(
          createErrorResponse("Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WEBP, MP4, WEBM ou MOV")
        );
      }

      // Validar tamanho
      if (file.getSize() > maxSize) {
        String maxSizeStr = mediaType.equals("image") ? "10 MB" : "100 MB";
        return ResponseEntity.badRequest().body(
          createErrorResponse("Arquivo muito grande. Tamanho máximo para " + mediaType + ": " + maxSizeStr)
        );
      }

      // Criar diretório se não existir
      Path uploadPath = Paths.get(uploadDir);
      if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      // Gerar nome único
      String originalFilename = file.getOriginalFilename();
      String extension = "";
      if (originalFilename != null && originalFilename.contains(".")) {
        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
      }
      String uniqueFilename = UUID.randomUUID().toString() + extension;

      // Salvar arquivo
      Path filePath = uploadPath.resolve(uniqueFilename);
      Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

      // Retornar URL
      String fileUrl = "/uploads/news-media/" + uniqueFilename;

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("url", fileUrl);
      response.put("mediaType", mediaType);
      response.put("mediaSource", "uploaded");
      response.put("filename", uniqueFilename);

      return ResponseEntity.ok(response);

    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(createErrorResponse("Erro ao salvar arquivo: " + e.getMessage()));
    }
  }

  /**
   * Valida uma URL externa e detecta o tipo de mídia.
   *
   * @param request Objeto contendo a URL
   * @return Informações sobre a URL validada
   */
  @PostMapping("/validate-url")
  public ResponseEntity<?> validateUrl(@RequestBody Map<String, String> request) {
    String url = request.get("url");

    if (url == null || url.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(createErrorResponse("URL não fornecida"));
    }

    try {
      // Detectar YouTube
      if (url.contains("youtube.com") || url.contains("youtu.be")) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("url", url);
        response.put("mediaType", "video");
        response.put("mediaSource", "external_url");
        response.put("provider", "youtube");
        return ResponseEntity.ok(response);
      }

      // Detectar Vimeo
      if (url.contains("vimeo.com")) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("url", url);
        response.put("mediaType", "video");
        response.put("mediaSource", "external_url");
        response.put("provider", "vimeo");
        return ResponseEntity.ok(response);
      }

      // Validar URL genérica
      URL urlObj = new URL(url);
      HttpURLConnection connection = (HttpURLConnection) urlObj.openConnection();
      connection.setRequestMethod("HEAD");
      connection.setConnectTimeout(5000);
      connection.setReadTimeout(5000);

      int responseCode = connection.getResponseCode();

      if (responseCode >= 200 && responseCode < 300) {
        String contentType = connection.getContentType();
        String mediaType = "image"; // padrão

        if (contentType != null) {
          if (contentType.startsWith("video/")) {
            mediaType = "video";
          } else if (contentType.startsWith("image/")) {
            mediaType = "image";
          }
        } else {
          // Detectar pela extensão
          String lowerUrl = url.toLowerCase();
          if (lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".mov")) {
            mediaType = "video";
          }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("url", url);
        response.put("mediaType", mediaType);
        response.put("mediaSource", "external_url");
        response.put("contentType", contentType);
        return ResponseEntity.ok(response);
      } else {
        return ResponseEntity.badRequest().body(createErrorResponse("URL inacessível (código: " + responseCode + ")"));
      }

    } catch (Exception e) {
      return ResponseEntity.badRequest().body(createErrorResponse("URL inválida ou inacessível: " + e.getMessage()));
    }
  }

  private Map<String, Object> createErrorResponse(String message) {
    Map<String, Object> error = new HashMap<>();
    error.put("success", false);
    error.put("message", message);
    return error;
  }
}
