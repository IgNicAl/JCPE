# 🚨 Quota do Gemini Esgotada - Soluções Rápidas

## Situação Atual

- ❌ Quota gratuita esgotada (200 req/dia)
- ⏰ Reset em: ~24 horas
- ✅ Redis configurado e funcionando

---

## 🎯 Solução 1: Ollama (Recomendada - GRATUITA e ILIMITADA)

### Vantagens

✅ 100% Gratuito
✅ Sem limites de uso
✅ Privado (roda localmente)
✅ Rápido após instalação

### Instalação (5 minutos)

```bash
# 1. Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Baixar modelo (escolha um):

# Opção A: Gemma 2 (9B) - Rápido, bom desempenho
ollama pull gemma2:9b

# Opção B: Llama 3.1 (8B) - Mais preciso
ollama pull llama3.1:8b

# Opção C: Qwen 2.5 (7B) - Melhor custo-benefício
ollama pull qwen2.5:7b

# 3. Testar
ollama run gemma2:9b
```

### Configurar no CrewAI

Edite `/home/ignical/Documentos/3_Trabalho/JCPE/agents/app/crew.py`:

```python
# ANTES
from crewai import Crew, Agent, Task, LLM

llm = LLM(
    model="gemini/gemini-2.0-flash",
    api_key=os.getenv("GEMINI_API_KEY")
)

# DEPOIS
llm = LLM(
    model="ollama/gemma2:9b",  # ou llama3.1:8b
    base_url="http://localhost:11434"  # Ollama padrão
)
```

---

## 🎯 Solução 2: Criar Nova Conta Google (Temporária)

### Passos Rápidos

1. Criar nova conta Google em: https://accounts.google.com
2. Acessar: https://aistudio.google.com
3. Gerar nova API key
4. Atualizar `.env`:
   ```bash
   GEMINI_API_KEY=nova_key_aqui
   ```

**Limitação:** Mesmos limites (200 req/dia)

---

## 🎯 Solução 3: Migrar para Tier Pago

### Custos (Pay-as-you-go)

- Gemini 2.0 Flash: $0.075 / 1M tokens input
- ~$0.02 por requisição média
- **Sem limites de taxa**

### Ativar Billing

1. Ir para: https://console.cloud.google.com/billing
2. Adicionar cartão de crédito
3. Habilitar API em: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

---

## 🚀 Como Escolher?

| Situação                | Solução Recomendada                 |
| ----------------------- | ----------------------------------- |
| Desenvolvimento/Testes  | ⭐ **Ollama** (gratuito, ilimitado) |
| Produção (baixo volume) | **Nova conta Google**               |
| Produção (alto volume)  | **Tier pago** ($)                   |

---

## ⚡ Iniciar Sistema Agora

Com Redis já configurado:

```bash
cd /home/ignical/Documentos/3_Trabalho/JCPE/agents

# Se usar Ollama (após instalar):
# 1. Editar app/crew.py (mudar modelo)
# 2. Iniciar:
./start.sh

# Se usar nova API key:
# 1. Editar .env (nova GEMINI_API_KEY)
# 2. Iniciar:
./start.sh
```

---

## ✅ Redis - Status

```bash
● redis-server.service - Advanced key-value store
     Active: active (running)
     Port: 6379
```

✅ **PRONTO PARA USO!**

Cache habilitado automaticamente quando o servidor iniciar.
