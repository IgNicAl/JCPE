# 🚀 Scripts de Gerenciamento - JCPE

Este diretório contém scripts automatizados para facilitar o gerenciamento da aplicação.

---

## 📜 Scripts Disponíveis

### 1. `start.sh` - Atualização e Inicialização Completa ⭐

Script principal que automatiza todo o processo de atualização segura da aplicação.

#### **Funcionalidades:**

- ✅ Backup automático do arquivo `.env` com timestamp
- ✅ Parada segura de todos os containers
- ✅ Atualização do código via Git com tratamento de conflitos
- ✅ Rebuild inteligente das imagens Docker
- ✅ Verificação automática do status dos serviços
- ✅ Interface colorida e interativa
- ✅ Relatório completo de status

#### **Uso:**

```bash
# Execução simples
bash start.sh

# Ou tornar executável e executar
chmod +x start.sh
./start.sh
```

#### **O que o script faz:**

1. **Backup do .env** 📦

   - Cria cópia de segurança com timestamp
   - Ex: `.env.backup_20251201_122453`

2. **Parada dos Containers** 🛑

   - Para todos os containers com segurança
   - Preserva volumes de dados

3. **Atualização do Código** 📥

   - Executa `git pull origin main`
   - Detecta mudanças locais não commitadas
   - Oferece opções: stash, descartar ou cancelar

4. **Rebuild e Inicialização** 🔨

   - Opção de rebuild com ou sem cache
   - Inicia todos os containers

5. **Verificação de Status** ✅
   - Verifica se todos os serviços estão rodando
   - Exibe relatório colorido
   - Sugere comandos úteis

---

### 2. `rebuild-agents.sh` - Rebuild Rápido do Serviço Agents

Script focado em reconstruir apenas o container de agentes IA.

#### **Uso:**

```bash
bash rebuild-agents.sh
```

---

## 🎨 Exemplos de Uso

### Cenário 1: Atualização Normal (Recomendado)

```bash
# Executa o script principal
bash start.sh

# Durante a execução:
# 1. Confirma backup do .env ✓
# 2. Para containers ✓
# 3. Atualiza código (se houver mudanças locais, escolhe opção) ✓
# 4. Escolhe "N" para build com cache (mais rápido) ✓
# 5. Verifica status ✓
```

### Cenário 2: Atualização com Build Limpo

```bash
bash start.sh

# Durante a execução:
# Escolhe "S" quando perguntado sobre rebuild sem cache
# Mais lento, mas garante build completamente limpo
```

### Cenário 3: Apenas Rebuild dos Agents

```bash
bash rebuild-agents.sh
```

---

## 🔧 Comandos Manuais Úteis

Caso prefira executar manualmente:

```bash
# Backup do .env
cp .env .env.backup_$(date +%Y%m%d_%H%M%S)

# Parar containers
sudo docker compose down

# Atualizar código
git pull origin main

# Reconstruir e iniciar
sudo docker compose up -d --build

# Verificar status
sudo docker compose ps

# Ver logs
sudo docker compose logs -f

# Ver logs de um serviço específico
sudo docker compose logs -f backend
```

---

## 🐛 Troubleshooting

### Se o script falhar no Git Pull

**Problema:** Conflitos de merge ou mudanças locais

**Solução:**

```bash
# Ver mudanças locais
git status

# Opção 1: Guardar mudanças temporariamente
git stash

# Opção 2: Descartar mudanças (CUIDADO!)
git reset --hard HEAD

# Depois execute o script novamente
bash start.sh
```

### Se containers não iniciarem

**Verificar logs:**

```bash
sudo docker compose logs
```

**Verificar serviço específico:**

```bash
sudo docker compose logs database
sudo docker compose logs backend
sudo docker compose logs agents
```

**Reiniciar serviço específico:**

```bash
sudo docker compose restart backend
```

### Se precisar de rebuild completo sem cache

```bash
sudo docker compose build --no-cache
sudo docker compose up -d
```

---

## 📋 Checklist de Atualização Manual

Se preferir fazer passo a passo manualmente:

- [ ] Fazer backup do `.env`
- [ ] Parar containers: `sudo docker compose down`
- [ ] Atualizar código: `git pull origin main`
- [ ] Reconstruir: `sudo docker compose up -d --build`
- [ ] Verificar status: `sudo docker compose ps`
- [ ] Verificar logs se necessário: `sudo docker compose logs`

---

## ⚙️ Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém todas as variáveis necessárias:

```bash
# Banco de Dados
MYSQL_ROOT_PASSWORD=...
MYSQL_DATABASE=...
MYSQL_USER=...
MYSQL_PASSWORD=...

# Gemini API
GEMINI_API_KEY=...

# Outras configurações
SPRING_PROFILES_ACTIVE=prod
```

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs:** `sudo docker compose logs -f`
2. **Verifique o status:** `sudo docker compose ps`
3. **Tente rebuild limpo:** Execute `start.sh` e escolha rebuild sem cache

---

## 🎯 Melhores Práticas

1. **Sempre use o `start.sh`** para atualizações - ele garante segurança
2. **Faça backup do `.env`** antes de mudanças importantes
3. **Monitore os logs** após atualizações
4. **Teste em ambiente de desenvolvimento** antes de produção
5. **Mantenha backups dos volumes Docker** para dados críticos

---

**Última atualização:** 01/12/2025
