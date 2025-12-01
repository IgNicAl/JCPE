# 🚀 Guia de Deploy com Docker

## 📋 Pré-requisitos no Servidor

```bash
# Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

---

## ⚙️ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.docker.example .env

# Editar configurações
nano .env
```

**Configurações obrigatórias:**

- `MYSQL_ROOT_PASSWORD` - Senha forte
- `MYSQL_PASSWORD` - Senha forte
- Escolher LLM provider (Gemini ou Ollama)

---

## 🎯 Opção A: Deploy com Gemini API

### Vantagens

- Sem necessidade de GPU
- Menor uso de recursos
- Configuração mais simples

### Configuração no `.env`

```bash
LLM_PROVIDER=gemini
GEMINI_API_KEY=sua_api_key_aqui
```

### Iniciar

```bash
docker-compose up -d
```

---

## 🎯 Opção B: Deploy com Ollama (LLM Local)

### Vantagens

- ✅ Gratuito e ilimitado
- ✅ Privado
- ✅ Sem dependência de API externa

### Requisitos Mínimos do Servidor

- **CPU:** 4+ cores
- **RAM:** 8GB+ (16GB recomendado)
- **Disco:** 10GB+ livre
- **GPU:** Opcional (acelera muito)

### Configuração

1. **Editar `docker-compose.yml`** - Descomentar serviço ollama:

```yaml
# Remover os # das linhas abaixo:
ollama:
  image: ollama/ollama:latest
  container_name: jcpe-ollama
  restart: unless-stopped
  ports:
    - "11434:11434"
  volumes:
    - ollama_data:/root/.ollama
  networks:
    - jcpe_net
```

2. **Descomentar volume** no final do arquivo:

```yaml
volumes:
  mysql_data:
  redis_data:
  ollama_data: # Remover o #
```

3. **Editar `.env`:**

```bash
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=gemma2:9b

# Comentar linhas do Gemini:
# GEMINI_API_KEY=...
```

4. **Iniciar serviços:**

```bash
docker-compose up -d
```

5. **Baixar modelo Ollama:**

```bash
# Entrar no container
docker exec -it jcpe-ollama bash

# Baixar modelo (escolha um):
ollama pull gemma2:9b      # Recomendado - 5GB
ollama pull llama3.1:8b    # Alternativa - 4.7GB
ollama pull qwen2.5:7b     # Mais leve - 4.4GB

# Sair do container
exit
```

6. **Reiniciar serviço agents:**

```bash
docker-compose restart agents
```

---

## 📊 Verificar Status

```bash
# Ver logs
docker-compose logs -f

# Ver apenas logs dos agents
docker-compose logs -f agents

# Ver status de todos os serviços
docker-compose ps
```

**Serviços esperados:**

- ✅ database (MySQL)
- ✅ redis (Cache)
- ✅ backend (Spring Boot)
- ✅ agents (FastAPI)
- ✅ frontend (React/Nginx)
- ⚪ ollama (opcional)

---

## 🔍 Healthchecks

Todos os serviços têm healthchecks automáticos:

```bash
# Verificar saúde
docker-compose ps

# Deve mostrar:
# database  healthy
# redis     healthy
# backend   running
# agents    running
```

---

## 🛠️ Comandos Úteis

```bash
# Parar tudo
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Rebuild após mudanças no código
docker-compose up -d --build

# Ver uso de recursos
docker stats

# Limpar imagens antigas
docker system prune -a
```

---

## 🔄 Atualizações

```bash
# 1. Baixar nova versão
git pull

# 2. Rebuild
docker-compose up -d --build

# 3. Verificar
docker-compose logs -f agents
```

---

## 📈 Monitoramento Redis

```bash
# Conectar ao Redis
docker exec -it jcpe-redis redis-cli

# Comandos úteis:
INFO stats           # Estatísticas
DBSIZE              # Número de chaves
KEYS *              # Listar chaves (cuidado em produção)
MONITOR             # Ver comandos em tempo real
```

---

## 🐛 Troubleshooting

### Agents não inicia

```bash
# Ver logs
docker-compose logs agents

# Comum: MySQL não está pronto
# Solução: Aguardar ~30s após docker-compose up
```

### Redis não conecta

```bash
# Verificar se está rodando
docker-compose ps redis

# Testar conexão
docker exec -it jcpe-redis redis-cli ping
# Deve retornar: PONG
```

### Ollama modelo não carregado

```bash
# Listar modelos
docker exec -it jcpe-ollama ollama list

# Baixar se necessário
docker exec -it jcpe-ollama ollama pull gemma2:9b
```

---

## 📦 Volumes (Persistência)

Dados persistidos automaticamente:

- `mysql_data` - Banco de dados
- `redis_data` - Cache do Redis
- `ollama_data` - Modelos Ollama (se habilitado)

**Backup:**

```bash
# Todas as opções incluem volumes
docker run --rm -v jcpe_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz /data
```

---

## ✅ Checklist de Deploy

- [ ] `.env` configurado com senhas fortes
- [ ] LLM provider escolhido (Gemini ou Ollama)
- [ ] `docker-compose up -d` executado
- [ ] Healthchecks passando (database + redis)
- [ ] Logs sem erros críticos
- [ ] Teste de requisição funcionando

**Teste rápido:**

```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "message": "olá"}'
```
