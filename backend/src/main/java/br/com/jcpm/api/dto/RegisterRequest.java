package br.com.jcpm.api.dto;

import br.com.jcpm.api.enums.TipoUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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

    @NotBlank(message = "Name é obrigatório")
    private String name;

    private TipoUser tipoUser = TipoUser.USER;
    private String biografia;
    private String urlImagemPerfil;

    // Constructors
    public RegisterRequest() {}

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public TipoUser getTipoUser() { return tipoUser; }
    public void setTipoUser(TipoUser tipoUser) { this.tipoUser = tipoUser; }

    public String getBiografia() { return biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }

    public String getUrlImagemPerfil() { return urlImagemPerfil; }
    public void setUrlImagemPerfil(String urlImagemPerfil) { this.urlImagemPerfil = urlImagemPerfil; }
}
