package br.com.jcpe.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para encapsular as credenciais de login.
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

  @NotBlank(message = "Username é obrigatório")
  private String username;

  @NotBlank(message = "Password é obrigatório")
  private String password;

  public LoginRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }

  // Getters e Setters Explícitos (gerados por Lombok, mas adicionados para suporte IDE)
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
