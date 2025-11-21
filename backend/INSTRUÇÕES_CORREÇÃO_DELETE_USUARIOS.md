# Correção do Problema de Deleção de Usuários

## Problema Identificado

O problema ao deletar usuários no painel administrativo ocorre porque existem constraints de foreign key nas tabelas relacionadas (`noticias`, `news_comments`, `news_likes`, `news_ratings`, `news_shares`) que impedem a exclusão de um usuário que possui dados vinculados.

## Correções Aplicadas

### Backend (Java/JPA)

As seguintes entidades foram modificadas para adicionar anotações `@OnDelete`:

1. **News.java** - `@OnDelete(action = OnDeleteAction.SET_NULL)` - As notícias ficam órfãs quando o autor é deletado
2. **NewsComment.java** - `@OnDelete(action = OnDeleteAction.CASCADE)` - Comentários são deletados junto com o usuário
3. **NewsLike.java** - `@OnDelete(action = OnDeleteAction.CASCADE)` - Curtidas são deletadas junto com o usuário
4. **NewsRating.java** - `@OnDelete(action = OnDeleteAction.CASCADE)` - Avaliações são deletadas junto com o usuário
5. **NewsShare.java** - `@OnDelete(action = OnDeleteAction.CASCADE)` - Compartilhamentos são deletados junto com o usuário

### Banco de Dados (MySQL)

Para aplicar essas mudanças no banco de dados, execute o script SQL criado em:
`/home/ignical/Documentos/3_Trabalho/JCPE/backend/db_cascade_fix.sql`

## Como Aplicar as Mudanças no Banco de Dados

### Opção 1: Via linha de comando MySQL

```bash
cd /home/ignical/Documentos/3_Trabalho/JCPE/backend
mysql -u root -p jcpe_db < db_cascade_fix.sql
```

Quando solicitado, digite a senha do MySQL.

### Opção 2: Via MySQL Workbench ou phpMyAdmin

1. Abra o arquivo `db_cascade_fix.sql` no MySQL Workbench ou phpMyAdmin
2. Execute o script completo
3. Verifique se não há erros

### Opção 3: Via terminal interativo do MySQL

```bash
mysql -u root -p
```

Digite a senha e depois:

```sql
USE jcpe_db;
SOURCE /home/ignical/Documentos/3_Trabalho/JCPE/backend/db_cascade_fix.sql;
```

## Verificação

Após executar o script SQL, você poderá:

1. Deletar usuários que possuem notícias (as notícias ficarão sem autor)
2. Deletar usuários que possuem comentários, likes, ratings ou compartilhamentos (todos serão removidos automaticamente)
3. O sistema não permitirá deletar sua própria conta (validação no frontend)

## Comportamento Esperado

- **Notícias**: Quando um usuário autor é deletado, suas notícias permanecem no sistema mas ficam sem autor (autor = NULL)
- **Comentários**: São deletados automaticamente quando o usuário é removido
- **Curtidas**: São deletadas automaticamente quando o usuário é removido
- **Avaliações**: São deletadas automaticamente quando o usuário é removido
- **Compartilhamentos**: São deletados automaticamente quando o usuário é removido

## Reinício do Backend

O backend já foi reiniciado automaticamente para carregar as mudanças das entidades Java.
