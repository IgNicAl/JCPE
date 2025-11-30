package br.com.jcpm.api.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de anúncios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvertisementResponse {

    private String id;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private Integer width;
    private Integer height;
    private String location;
    private Boolean isActive;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer clickCount;
    private Integer impressionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
