# 🔧 Correção do Erro SQL - contentJson

## ❌ Problema
```
java.sql.SQLSyntaxErrorException: You have an error in your SQL syntax near 'json)'
```

**Causa:** O tipo `JSON` do Hibernate não é totalmente suportado por MariaDB/MySQL da forma que foi configurado.

---

## ✅ Solução Implementada

### News.java - Campo contentJson
**ANTES (com erro):**
```java
@JdbcTypeCode(SqlTypes.JSON)
@Lob
@Column(columnDefinition = "JSON")
private String contentJson;
```

**DEPOIS (corrigido):**
```java
@Lob
@Column(columnDefinition = "LONGTEXT", nullable = true)
private String contentJson;
```

### Por que isso funciona:
- `LONGTEXT` é muito mais seguro em MariaDB/MySQL
- Suporta caracteres especiais e URLs sem problemas
- Não requer escaping especial de SQL
- Compatível com dados JSON em string

---

## 🚀 Próximos Passos

### 1. Recompilar o Backend
```bash
cd c:\Users\eriva\Documents\code\JCPM\backend
mvnw.cmd clean package -DskipTests
```

### 2. Executar SQL (OPCIONAL - se Hibernate falhar)
Se ainda tiver erro ao iniciar, execute em MySQL:
```sql
-- Arquivo: backend/fix-columns.sql
ALTER TABLE noticias MODIFY COLUMN content_json LONGTEXT NULL;
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS page VARCHAR(50) DEFAULT 'noticias' NULL;
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS is_featured TINYINT(1) DEFAULT 0 NOT NULL;
```

### 3. Iniciar Backend
```bash
mvnw.cmd spring-boot:run
```

---

## 📊 Resumo das Mudanças

| Campo | Antes | Depois |
|-------|-------|--------|
| `contentJson` | JSON type | LONGTEXT |
| `page` | N/A | VARCHAR(50) |
| `isFeatured` | N/A | TINYINT(1) |

---

## ✅ Verificação

Após compilar, o backend deve:
- ✅ Compilar sem erros
- ✅ Iniciar sem SQL errors
- ✅ Aceitar criação de notícias
- ✅ Salvar contentJson com caracteres especiais

