#!/bin/bash
# =============================================================================
# SCRIPT DE ATUALIZAÇÃO E INICIALIZAÇÃO - JCPE
# =============================================================================
# Automatiza o processo completo de atualização segura da aplicação Docker
# Baseado no Guia Completo de Atualização Segura
# =============================================================================

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # Sem cor

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Função para imprimir cabeçalhos
print_header() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Função para imprimir passos
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Função para imprimir sucesso
print_success() {
    echo -e "${GREEN}✔ $1${NC}"
}

# Função para imprimir aviso
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Função para imprimir erro
print_error() {
    echo -e "${RED}✖ $1${NC}"
}

# Função para executar comandos com feedback
execute_cmd() {
    local cmd=$1
    local description=$2

    print_step "$description"
    if eval "$cmd"; then
        print_success "Concluído"
        return 0
    else
        print_error "Falhou: $description"
        return 1
    fi
}

# =============================================================================
# INÍCIO DO SCRIPT
# =============================================================================

print_header "🚀 ATUALIZAÇÃO E INICIALIZAÇÃO - JCPE"

echo -e "${CYAN}Diretório do projeto:${NC} $PROJECT_DIR"
echo -e "${CYAN}Data/Hora:${NC} $(date '+%Y-%m-%d %H:%M:%S')\n"

# =============================================================================
# PASSO 1: BACKUP DO ARQUIVO .ENV
# =============================================================================
print_header "📦 PASSO 1/5: Backup do arquivo .env"

if [ -f ".env" ]; then
    BACKUP_NAME=".env.backup_$(date +%Y%m%d_%H%M%S)"
    execute_cmd "cp .env $BACKUP_NAME" "Criando backup do .env"
    print_success "Backup salvo como: $BACKUP_NAME"
else
    print_warning "Arquivo .env não encontrado. Pulando backup."
fi

# =============================================================================
# PASSO 2: PARAR OS CONTAINERS DOCKER
# =============================================================================
print_header "🛑 PASSO 2/5: Parar containers Docker"

if command -v docker &> /dev/null && docker compose ps &> /dev/null; then
    execute_cmd "sudo docker compose down" "Parando containers"
    print_success "Containers parados com sucesso"
else
    print_warning "Nenhum container em execução. Pulando."
fi

# =============================================================================
# PASSO 3: ATUALIZAR O CÓDIGO COM GIT PULL
# =============================================================================
print_header "📥 PASSO 3/5: Atualizar código com Git"

# Verifica se é um repositório Git
if [ -d ".git" ]; then
    # Verifica se há mudanças não commitadas
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        print_warning "Há mudanças locais não commitadas!"
        echo -e "\nOpções:"
        echo "  1) Fazer stash (guardar mudanças temporariamente)"
        echo "  2) Descartar mudanças (CUIDADO: irreversível)"
        echo "  3) Cancelar atualização"
        read -p "Escolha uma opção [1/2/3]: " git_option

        case $git_option in
            1)
                execute_cmd "git stash save 'Auto-stash antes do pull $(date +%Y%m%d_%H%M%S)'" "Guardando mudanças"
                ;;
            2)
                read -p "Tem certeza que deseja DESCARTAR todas as mudanças? [s/N]: " confirm
                if [[ $confirm =~ ^[Ss]$ ]]; then
                    execute_cmd "git reset --hard HEAD" "Descartando mudanças"
                else
                    print_error "Operação cancelada pelo usuário"
                    exit 1
                fi
                ;;
            3)
                print_error "Atualização cancelada pelo usuário"
                exit 1
                ;;
            *)
                print_error "Opção inválida. Cancelando."
                exit 1
                ;;
        esac
    fi

    # Atualiza o código
    print_step "Baixando atualizações do repositório"
    if git pull origin main; then
        print_success "Código atualizado com sucesso"
    else
        print_error "Erro ao atualizar código"
        print_warning "Tentando resolver conflitos automaticamente..."
        git pull --rebase origin main || {
            print_error "Não foi possível atualizar automaticamente"
            echo -e "\nPor favor, resolva os conflitos manualmente e execute o script novamente."
            exit 1
        }
    fi
else
    print_warning "Não é um repositório Git. Pulando atualização."
fi

# =============================================================================
# PASSO 4: RECONSTRUIR E INICIAR OS CONTAINERS
# =============================================================================
print_header "🔨 PASSO 4/5: Reconstruir e iniciar containers"

# Pergunta sobre rebuild completo
echo -e "${YELLOW}Deseja fazer rebuild completo (sem cache)?${NC}"
echo "  - Sim: Mais lento, mas garante build limpo"
echo "  - Não: Mais rápido, usa cache quando possível"
read -p "Rebuild sem cache? [s/N]: " rebuild_option

if [[ $rebuild_option =~ ^[Ss]$ ]]; then
    print_step "Reconstruindo imagens sem cache (pode demorar alguns minutos)..."
    execute_cmd "sudo docker compose build --no-cache" "Build sem cache"
    execute_cmd "sudo docker compose up -d" "Iniciando containers"
else
    print_step "Reconstruindo imagens com cache..."
    execute_cmd "sudo docker compose up -d --build" "Build e inicialização"
fi

# Aguarda um pouco para os containers iniciarem
print_step "Aguardando inicialização dos containers..."
sleep 5

# =============================================================================
# PASSO 5: VERIFICAR STATUS DOS CONTAINERS
# =============================================================================
print_header "✅ PASSO 5/5: Verificar status dos containers"

execute_cmd "sudo docker compose ps" "Listando containers"

# Verifica se todos os containers essenciais estão rodando
echo -e "\n${CYAN}Verificando serviços críticos...${NC}\n"

check_service() {
    local service=$1
    local status=$(sudo docker compose ps | grep "$service" | grep -c "Up" || true)

    if [ "$status" -gt 0 ]; then
        print_success "$service está rodando"
        return 0
    else
        print_error "$service NÃO está rodando"
        return 1
    fi
}

# Verifica serviços principais
FAILED_SERVICES=0
check_service "database" || ((FAILED_SERVICES++))
check_service "redis" || ((FAILED_SERVICES++))
check_service "backend" || ((FAILED_SERVICES++))
check_service "agents" || ((FAILED_SERVICES++))
check_service "frontend" || ((FAILED_SERVICES++))

# =============================================================================
# RESUMO FINAL
# =============================================================================
print_header "📊 RESUMO DA ATUALIZAÇÃO"

if [ $FAILED_SERVICES -eq 0 ]; then
    print_success "Todos os serviços foram iniciados com sucesso! 🎉"
    echo -e "\n${GREEN}┌────────────────────────────────────────────────┐${NC}"
    echo -e "${GREEN}│  ✓ Aplicação atualizada e pronta para uso     │${NC}"
    echo -e "${GREEN}└────────────────────────────────────────────────┘${NC}"
else
    print_warning "$FAILED_SERVICES serviço(s) com problema(s)"
    echo -e "\n${YELLOW}┌────────────────────────────────────────────────┐${NC}"
    echo -e "${YELLOW}│  ⚠ Verifique os logs dos serviços com erro    │${NC}"
    echo -e "${YELLOW}└────────────────────────────────────────────────┘${NC}"
fi

# =============================================================================
# COMANDOS ÚTEIS
# =============================================================================
echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📚 COMANDOS ÚTEIS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Ver logs em tempo real:${NC}"
echo -e "  sudo docker compose logs -f\n"

echo -e "${BLUE}Ver logs de um serviço específico:${NC}"
echo -e "  sudo docker compose logs -f backend\n"

echo -e "${BLUE}Reiniciar um serviço:${NC}"
echo -e "  sudo docker compose restart backend\n"

echo -e "${BLUE}Parar todos os containers:${NC}"
echo -e "  sudo docker compose down\n"

echo -e "${BLUE}Verificar status:${NC}"
echo -e "  sudo docker compose ps\n"

# Opção de ver logs
echo -e "\n${YELLOW}Deseja ver os logs agora? [s/N]:${NC} "
read -p "" view_logs

if [[ $view_logs =~ ^[Ss]$ ]]; then
    echo -e "\n${CYAN}Mostrando logs (Ctrl+C para sair)...${NC}\n"
    sleep 2
    sudo docker compose logs -f
fi

echo -e "\n${GREEN}Script finalizado!${NC}\n"
