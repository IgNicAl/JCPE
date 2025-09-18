package br.com.jcpm.api.dto;

import br.com.jcpm.api.enums.TipoUsuario;

public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String nome;
    private TipoUsuario tipoUsuario;
    
    public JwtResponse(String accessToken, Long id, String username, String email, String nome, TipoUsuario tipoUsuario) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.nome = nome;
        this.tipoUsuario = tipoUsuario;
    }
    
    // Getters and Setters
    public String getAccessToken() { return token; }
    public void setAccessToken(String accessToken) { this.token = accessToken; }
    
    public String getTokenType() { return type; }
    public void setTokenType(String tokenType) { this.type = tokenType; }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
}