package br.com.jcpm.api.dto;

import java.time.LocalDate;

import br.com.jcpm.api.domain.enums.UserType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para o registro de um novo usuário.
 */
@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "Username é obrigatório")
  @Size(min = 3, max = 20, message = "Username deve ter entre 3 e 20 caracteres")
  private String username;

  @NotBlank(message = "Email é obrigatório")
  @Email(message = "Email deve ser válido")
  private String email;

  @NotBlank(message = "Password é obrigatório")
  @Size(min = 6, message = "Password deve ter no mínimo 6 caracteres")
  private String password;

  private String confirmPassword;

  @NotBlank(message = "Name é obrigatório")
  private String name;

  private UserType userType = UserType.USER;
  private String biography;
  private String profileImageUrl;
  private String gender;
  private LocalDate birthDate;

  // Garante que a validação de senha funcione mesmo com o campo nulo
  @AssertTrue(message = "As senhas não coincidem")
  @SuppressWarnings("unused") // Utilizado pelo Bean Validation
  private boolean isPasswordConfirmed() {
    if (password == null) {
      return confirmPassword == null;
    }
    return password.equals(confirmPassword);
  }

  // Getters e Setters Explícitos (gerados por Lombok, mas adicionados para
  // suporte IDE)
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getConfirmPassword() {
    return confirmPassword;
  }

  public void setConfirmPassword(String confirmPassword) {
    this.confirmPassword = confirmPassword;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public UserType getUserType() {
    return userType;
  }

  public void setUserType(UserType userType) {
    this.userType = userType;
  }

  public String getBiography() {
    return biography;
  }

  public void setBiography(String biography) {
    this.biography = biography;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public void setProfileImageUrl(String profileImageUrl) {
    this.profileImageUrl = profileImageUrl;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public LocalDate getBirthDate() {
    return birthDate;
  }

  public void setBirthDate(LocalDate birthDate) {
    this.birthDate = birthDate;
  }
}
