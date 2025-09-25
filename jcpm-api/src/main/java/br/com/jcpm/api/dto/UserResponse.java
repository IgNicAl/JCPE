package br.com.jcpm.api.dto;

import java.time.LocalDateTime;

import br.com.jcpm.api.enums.TipoUsuario;
import br.com.jcpm.api.model.User;

public class UserResponse {
    
    private Long id;
    private String username;
    private String email;
    private String nome;
    private TipoUsuario tipoUsuario;
    private Boolean ativo;
    private LocalDateTime dataCadastro;
    private String biografia;
    private String urlImagemPerfil;
    
    // Construtor padrão
    public UserResponse() {}
    
    // Construtor a partir de User
    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.nome = user.getNome();
        this.tipoUsuario = user.getTipoUsuario();
        this.ativo = user.getAtivo();
        this.dataCadastro = user.getDataCadastro();
        this.biografia = user.getBiografia();
        this.urlImagemPerfil = user.getUrlImagemPerfil();
    }
    
    // Getters e Setters
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
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
    
    public String getBiografia() { return biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }
    
    public String getUrlImagemPerfil() { return urlImagemPerfil; }
    public void setUrlImagemPerfil(String urlImagemPerfil) { this.urlImagemPerfil = urlImagemPerfil; }
}
