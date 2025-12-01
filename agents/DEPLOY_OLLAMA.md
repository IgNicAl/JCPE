# 🚀 Guia de Deploy com Ollama

Para configurar este projeto em um novo servidor (ex: Produção/Staging), siga estes passos:

## 1. Pré-requisitos

- Servidor Linux (Ubuntu/Debian recomendados)
- Acesso root ou sudo
- Python 3.11+
- Git

## 2. Instalação Automática

O projeto inclui um script que faz tudo para você:

```bash
cd agents
chmod +x install_ollama.sh
./install_ollama.sh
```

Este script irá:

1. Instalar o Ollama
2. Baixar o modelo `gemma2:9b` (5.4GB)
3. Configurar o `app/crew.py` automaticamente

## 3. Iniciar o Sistema

```bash
./start.sh
```

O script de inicialização agora verifica automaticamente se o Ollama está rodando.

## 4. Solução de Problemas

Se o Ollama não iniciar:

```bash
sudo systemctl status ollama
sudo systemctl restart ollama
```
