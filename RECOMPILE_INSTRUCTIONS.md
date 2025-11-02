# 🔧 Instruções para Recompilar o Backend

## Erro Corrigido

O erro de SQL Syntax foi corrigido. O problema era no tipo de dado da coluna `isFeatured`.

**Antes (erro):**
```java
@Column(nullable = false)
private Boolean isFeatured = false;
```

**Depois (correto):**
```java
@Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
private Boolean isFeatured = false;
```

## Como Recompilar

### Opção 1: Usar Maven Wrapper (Recomendado)
```bash
# No diretório do backend
cd backend

# Limpar e compilar
mvnw.cmd clean package -DskipTests

# Ou compilar e rodar direto
mvnw.cmd clean spring-boot:run
```

### Opção 2: Se ainda tiver erro, executar SQL manualmente
1. Abra o MySQL/MariaDB
2. Execute o script `add-featured-columns.sql`:
```bash
mysql -u root -p jcpm_db < add-featured-columns.sql
```

### Opção 3: Pelo MySQL Workbench ou phpMyAdmin
1. Conecte ao banco `jcpm_db`
2. Execute o conteúdo do arquivo `add-featured-columns.sql`

## Campos Adicionados

✅ **page** (VARCHAR 50): Página onde a notícia será publicada
- Valores: 'noticias', 'recife', 'clima', 'empreendedorismo', 'jogos'
- Padrão: 'noticias'

✅ **is_featured** (TINYINT 1): Se é notícia principal/destaque
- Valores: 0 (false) ou 1 (true)
- Padrão: 0 (false)

## Verificação

Após recompilar, verifique:
1. Backend rodando em `http://localhost:8080`
2. Frontend rodando em `http://localhost:3001`
3. Tente criar uma notícia com sucesso
4. Verifique no banco se as colunas foram criadas:
```sql
DESCRIBE noticias;
```

## Próximos Passos

1. ✅ Recompile o backend
2. ✅ Reinicie o backend
3. ✅ Teste criar uma notícia com a página e destaque selecionados
4. ✅ Verifique se a notícia aparece na página correta como destaque
