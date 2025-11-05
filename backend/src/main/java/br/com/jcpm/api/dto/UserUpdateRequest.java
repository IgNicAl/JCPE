package br.com.jcpe.api.dto;

import br.com.jcpe.api.domain.enums.UserType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String name;
    private String email;
    private UserType userType;
    private Boolean ativo;
    private String biografia;
    private String urlImagemPerfil;

    // Getters e Setters Explícitos (gerados por Lombok, mas adicionados para
    // suporte IDE)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public String getUrlImagemPerfil() {
        return urlImagemPerfil;
    }

    public void setUrlImagemPerfil(String urlImagemPerfil) {
        this.urlImagemPerfil = urlImagemPerfil;
    }
}
