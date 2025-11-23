package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.UserType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para expor os dados de um usuário de forma segura.
 */
@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

  private UUID id;
  private String username;
  private String email;
  private String name;
  private UserType userType;
  private String biografia;
  private String urlImagemPerfil;
  private String bannerUrl;
  private Boolean ativo;
  private LocalDateTime dataCadastro;

  public UserResponse(User user) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.email = user.getEmail();
    this.name = user.getName();
    this.userType = user.getUserType();
    this.biografia = user.getBiography();
    this.urlImagemPerfil = user.getProfileImageUrl();
    this.bannerUrl = user.getBannerUrl();
    this.ativo = user.getActive();
    this.dataCadastro = user.getRegistrationDate();
  }
}
