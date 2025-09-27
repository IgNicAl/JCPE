package br.com.jcpm.api.enums;

public enum TipoUser {
    USER("User"),
    JORNALISTA("Jornalista"),
    ADMIN("Administrador");

    private final String descricao;

    TipoUser(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
