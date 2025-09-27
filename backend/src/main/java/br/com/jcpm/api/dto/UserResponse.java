package br.com.jcpm.api.dto;

import br.com.jcpm.api.enums.TipoUser;
import br.com.jcpm.api.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

    // CORRIGIDO: O tipo do ID foi alterado de Long para UUID
    private UUID id;
    private String username;
    private String email;
    private String name;
    private TipoUser tipoUser;
    private String biografia;
    private String urlImagemPerfil;
    private Boolean ativo;
    private LocalDateTime dataCadastro;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.name = user.getName();
        this.tipoUser = user.getTipoUser();
        this.biografia = user.getBiografia();
        this.urlImagemPerfil = user.getUrlImagemPerfil();
        this.ativo = user.getAtivo();
        this.dataCadastro = user.getDataCadastro();
    }
}
