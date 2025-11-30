package br.com.jcpm.api.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para criação e atualização de anúncios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvertisementRequest {

    @NotBlank(message = "Título é obrigatório")
    private String title;

    @NotBlank(message = "URL da imagem é obrigatória")
    private String imageUrl;

    @NotBlank(message = "URL de destino é obrigatória")
    private String linkUrl;

    @NotNull(message = "Largura é obrigatória")
    @Min(value = 1, message = "Largura deve ser maior que 0")
    private Integer width;

    @NotNull(message = "Altura é obrigatória")
    @Min(value = 1, message = "Altura deve ser maior que 0")
    private Integer height;

    @NotBlank(message = "Localização é obrigatória")
    private String location; // 'id' ou 'class'

    @NotNull(message = "Status ativo é obrigatório")
    private Boolean isActive;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
