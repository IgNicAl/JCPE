package br.com.jcpm.api.dto;

import br.com.jcpm.api.enums.TipoUser;
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
    private String name;
    private TipoUser tipoUser;

    public JwtResponse(String accessToken, UUID id, String username, String email, String name, TipoUser tipoUser) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.tipoUser = tipoUser;
    }
}
