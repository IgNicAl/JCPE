package br.com.jcpm.api.enums;

public enum TipoUsuario {
    USUARIO("Usuario"),
    JORNALISTA("Jornalista"), 
    ADMIN("Administrador");
    
    private final String descricao;
    
    TipoUsuario(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}