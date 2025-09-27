package br.com.jcpm.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "noticias")
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private User autor;

    @NotBlank(message = "Título é obrigatório")
    @Column(nullable = false)
    private String titulo;

    @NotBlank(message = "Resumo é obrigatório")
    @Column(length = 512, nullable = false)
    private String resumo;

    @NotBlank(message = "Conteúdo é obrigatório")
    @Lob // Para textos longos
    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @NotBlank(message = "URL da imagem de destaque é obrigatória")
    @Column(nullable = false)
    private String urlImagemDestaque;

    @NotNull(message = "Prioridade é obrigatória")
    @Column(nullable = false)
    private Integer prioridade = 1;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataPublicacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;
}
