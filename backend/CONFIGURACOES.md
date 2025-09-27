# 📋 Documentação das Configurações - JCPM API

## 🔧 Melhorias Implementadas

### ✅ **Problemas Corrigidos**

1. **Dialect do Hibernate removido**: O Hibernate agora detecta automaticamente o dialect do MySQL
2. **spring.jpa.open-in-view desabilitado**: Evita lazy loading durante renderização da view
3. **Pool de conexões otimizado**: HikariCP configurado para melhor performance
4. **Compressão habilitada**: Responses HTTP comprimidos automaticamente
5. **Logging estruturado**: Logs organizados e configuráveis por ambiente

### 📊 **Configurações do Pool de Conexões (HikariCP)**

```properties
# Pool de Conexões Otimizado
spring.datasource.hikari.maximum-pool-size=20          # Máximo 20 conexões
spring.datasource.hikari.minimum-idle=5                # Mínimo 5 conexões ociosas
spring.datasource.hikari.idle-timeout=300000           # Timeout de conexão ociosa (5 min)
spring.datasource.hikari.max-lifetime=1200000          # Vida máxima da conexão (20 min)
spring.datasource.hikari.connection-timeout=20000      # Timeout para obter conexão (20s)
spring.datasource.hikari.validation-timeout=3000       # Timeout de validação (3s)
spring.datasource.hikari.leak-detection-threshold=60000 # Detecção de vazamento (60s)
```

### 🚀 **Configurações de Performance**

```properties
# Hibernate Performance
spring.jpa.properties.hibernate.jdbc.batch_size=20     # Batch de inserções
spring.jpa.properties.hibernate.order_inserts=true     # Ordenar inserções
spring.jpa.properties.hibernate.order_updates=true     # Ordenar atualizações

# Compressão HTTP
server.compression.enabled=true                        # Habilita compressão
server.compression.min-response-size=1024             # Comprime responses > 1KB

# Tomcat Otimizado
server.tomcat.max-threads=200                         # Máximo 200 threads
server.tomcat.min-spare-threads=10                    # Mínimo 10 threads ociosas
```

### 🔒 **Configurações de Segurança**

```properties
# URL do Banco com Parâmetros de Segurança
spring.datasource.url=jdbc:mysql://localhost:3306/jcpm_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&characterEncoding=utf8&useUnicode=true

# JWT (Para Produção use variáveis de ambiente)
jwt.secret=mySecretKey123456789abcdefghijklmnopqrstuvwxyz
jwt.expiration=86400000  # 24 horas
```

## 🌍 **Ambientes de Configuração**

### 🔧 **Desenvolvimento (Padrão)**
- SQL logging habilitado
- Devtools habilitado
- Pool de conexões menor
- Referências circulares permitidas (temporariamente)

### 🏭 **Produção** (`application-prod.properties`)
- SQL logging desabilitado
- Pool de conexões maior
- Logging em arquivos
- Segurança aprimorada
- Referências circulares desabilitadas

## 📝 **Como Usar**

### Para Desenvolvimento:
```bash
./mvnw spring-boot:run
```

### Para Produção:
```bash
java -jar backend.jar --spring.profiles.active=prod
```

### Com Variáveis de Ambiente (Produção):
```bash
export DB_USERNAME=usuario_prod
export DB_PASSWORD=senha_segura
export JWT_SECRET=chave_jwt_super_secreta
java -jar backend.jar --spring.profiles.active=prod
```

## ⚠️ **Ações Recomendadas**

### 🔴 **Crítico - Fazer Antes da Produção**
1. **Corrigir referências circulares** no código Spring Security
2. **Configurar SSL/HTTPS** no servidor
3. **Usar variáveis de ambiente** para credenciais sensíveis
4. **Atualizar MySQL** para versão 8.0+

### 🟡 **Recomendado**
1. Implementar cache Redis para sessões JWT
2. Configurar monitoramento com Actuator + Micrometer
3. Implementar rate limiting
4. Configurar CORS adequadamente

### 🟢 **Opcional**
1. Implementar cache de segundo nível do Hibernate
2. Configurar connection pooling avançado
3. Implementar health checks personalizados

## 📈 **Monitoramento**

### Logs Importantes:
- `logs/backend.log` - Log principal da aplicação
- Console - SQL queries (apenas desenvolvimento)
- HikariCP metrics - Pool de conexões

### Métricas a Monitorar:
- **Pool de Conexões**: Uso, vazamentos, timeouts
- **Performance**: Tempo de resposta, throughput
- **Erros**: Exceptions, timeouts de banco
- **Recursos**: CPU, memória, conexões ativas

## 🔄 **Versionamento das Configurações**

- **v1.0**: Configurações básicas
- **v2.0**: ✅ **ATUAL** - Pool otimizado, logging estruturado, profiles
- **v3.0**: Planejado - Cache Redis, SSL, monitoramento avançado

---

> **📌 Nota**: Este arquivo deve ser mantido atualizado sempre que novas configurações forem adicionadas ao projeto.
