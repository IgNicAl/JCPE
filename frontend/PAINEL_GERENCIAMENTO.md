# Painel de Gerenciamento - Documentação

## Visão Geral

O sistema agora possui um painel centralizado (`/painel`) que se adapta dinamicamente ao tipo de usuário logado, exibindo apenas as funcionalidades relevantes para cada perfil.

## Tipos de Usuário e Funcionalidades

### 1. **Administrador (ADMIN)**

**Título do Painel:** "Painel Administrativo"
**Subtítulo:** "Gerencie todas as funcionalidades do portal JCPE"
**Ícone:** 🎛️ (fa-tachometer-alt)

**Funcionalidades Disponíveis:**

- ✅ Gerenciar Notícias
- ✅ Painel de Revisão
- ✅ Gerenciar Usuários
- ✅ Gerenciar Categorias
- ✅ Cadastrar Usuário

**Link no Menu:** "Painel Administrativo"

---

### 2. **Jornalista (JOURNALIST)**

**Título do Painel:** "Painel do Jornalista"
**Subtítulo:** "Crie e gerencie suas notícias"
**Ícone:** 📰 (fa-newspaper)

**Funcionalidades Disponíveis:**

- ✅ Gerenciar Notícias

**Link no Menu:** "Meu Painel"

---

### 3. **Revisor (REVIEWER)**

**Título do Painel:** "Painel do Revisor"
**Subtítulo:** "Revise e aprove notícias pendentes"
**Ícone:** 📋 (fa-clipboard-check)

**Funcionalidades Disponíveis:**

- ✅ Painel de Revisão
- ✅ Gerenciar Categorias

**Link no Menu:** "Meu Painel"

---

### 4. **Usuário Comum (USER)**

**Comportamento:** Não possui acesso ao painel de gerenciamento

**Menu do Usuário:**

- ✅ Perfil
- ✅ Meus Benefícios (Pontos)
- ✅ Configurações
- ❌ **NÃO exibe** "Área do Usuário" ou "Meu Painel"

---

## Estrutura de Rotas

Todas as rotas administrativas foram migradas de `/admin` para `/painel`:

```
/painel                     → Painel principal (dinâmico por tipo de usuário)
/painel/usuarios            → Gerenciar Usuários (ADMIN)
/painel/usuarios/editar/:id → Editar Usuário (ADMIN)
/painel/revisao             → Painel de Revisão (ADMIN, REVIEWER)
/painel/revisao/:id         → Revisar Notícia Específica (ADMIN, REVIEWER)
/painel/categorias          → Gerenciar Categorias (ADMIN, REVIEWER)
/noticias/gerenciar         → Gerenciar Notícias (ADMIN, JOURNALIST)
/cadastro-interno           → Cadastrar Usuário (ADMIN)
```

---

## Controle de Permissões

O sistema usa verificação de permissões em dois níveis:

### 1. **Nível de Rota (App.tsx)**

Cada rota protegida especifica quais tipos de usuário podem acessá-la:

```tsx
<ProtectedRoute roles={["ADMIN", "REVIEWER"]}>
  <ReviewDashboard />
</ProtectedRoute>
```

### 2. **Nível de UI (AdminPanel.tsx)**

Os cards do painel são filtrados dinamicamente:

```tsx
const canManageNews = isAdmin() || isJournalist();
const canReview = isAdmin() || isReviewer();
const canManageUsers = isAdmin();
const canManageCategories = isAdmin() || isReviewer();
```

---

## Design e Estilo

### Características Visuais

- **Gradient de Fundo:** Azul/cinza moderno
- **Cards Interativos:** Efeito hover com elevação e sombras
- **Animações:** Entrada escalonada dos cards
- **Cores dos Cards:**
  - 🔴 Gerenciar Notícias: Vermelho (#c41e3a)
  - 🟢 Painel de Revisão: Verde (#00aa44)
  - 🔵 Gerenciar Usuários: Azul (#003d82)
  - 🟡 Gerenciar Categorias: Amarelo (#ffc107)
  - 🟣 Cadastrar Usuário: Roxo (#9c27b0)

### Responsividade

- **Desktop:** Grid de cards com mínimo 320px
- **Mobile:** Cards em coluna única
- **Tablet:** Adaptação automática do grid

### Dark Mode

Suporte completo para tema escuro via media query `prefers-color-scheme: dark`

---

## Arquivos Modificados

### Componentes Criados

- `/pages/AdminPanel/AdminPanel.tsx` - Componente principal
- `/pages/AdminPanel/AdminPanel.css` - Estilos do painel

### Componentes Atualizados

- `/components/organisms/UserMenu/UserMenu.tsx` - Menu do usuário
- `/App.tsx` - Rotas da aplicação
- `/utils/constants.ts` - Constantes de rotas

### Páginas Atualizadas

- `/features/auth/pages/InternalRegistration/InternalRegistration.tsx`
- `/features/auth/pages/EditUser/EditUser.tsx`
- `/features/auth/pages/UserList/UserList.tsx`
- `/features/news/pages/ReviewDashboard/ReviewDashboard.tsx`

---

## Exemplo de Uso

### Para Administrador

1. Login como ADMIN
2. Clicar no menu do usuário (canto superior direito)
3. Selecionar "Painel Administrativo"
4. Ver todos os 5 cards de gerenciamento
5. Clicar em qualquer card para navegar à funcionalidade

### Para Jornalista

1. Login como JOURNALIST
2. Clicar no menu do usuário
3. Selecionar "Meu Painel"
4. Ver apenas o card "Gerenciar Notícias"
5. Clicar para acessar suas notícias

### Para Revisor

1. Login como REVIEWER
2. Clicar no menu do usuário
3. Selecionar "Meu Painel"
4. Ver cards "Painel de Revisão" e "Gerenciar Categorias"
5. Clicar para revisar notícias ou gerenciar categorias

### Para Usuário Comum

1. Login como USER
2. Clicar no menu do usuário
3. Ver apenas: Perfil, Meus Benefícios, Configurações
4. **Não há** link para painel de gerenciamento

---

## Segurança

- ✅ Rotas protegidas via `ProtectedRoute`
- ✅ Verificação de permissões no backend
- ✅ UI adaptativa (oculta opções não permitidas)
- ✅ Redirecionamento automático em caso de acesso não autorizado
