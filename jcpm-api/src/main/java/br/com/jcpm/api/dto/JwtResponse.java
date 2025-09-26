package br.com.jcpm.api.dto;

import br.com.jcpm.api.enums.TipoUsuario;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";

    // CORRIGIDO: O tipo do ID foi alterado de Long para UUID
    private UUID id;
    private String username;
    private String email;
    private String nome;
    private TipoUsuario tipoUsuario;

    public JwtResponse(String accessToken, UUID id, String username, String email, String nome, TipoUsuario tipoUsuario) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.nome = nome;
        this.tipoUsuario = tipoUsuario;
    }
}
