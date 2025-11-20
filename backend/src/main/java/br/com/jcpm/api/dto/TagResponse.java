package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {
  private UUID id;
  private String name;
  private String slug;
  private String createdByName;
  private LocalDateTime createdAt;
}
