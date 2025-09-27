package br.com.jcpm.api.dto;

import br.com.jcpm.api.enums.TipoUsuario;
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
    private String nome;
    private TipoUsuario tipoUsuario;
    private String biografia;
    private String urlImagemPerfil;
    private Boolean ativo;
    private LocalDateTime dataCadastro;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.nome = user.getNome();
        this.tipoUsuario = user.getTipoUsuario();
        this.biografia = user.getBiografia();
        this.urlImagemPerfil = user.getUrlImagemPerfil();
        this.ativo = user.getAtivo();
        this.dataCadastro = user.getDataCadastro();
    }
}
