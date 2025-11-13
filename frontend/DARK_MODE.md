# Sistema de Dark Mode - JCPE

## 📋 Visão Geral

O sistema de dark mode foi implementado com suporte completo para alternância entre temas claro e escuro, com persistência no `localStorage` e detecção automática da preferência do sistema operacional.

## 🎨 Funcionalidades

- ✅ Alternância entre tema claro e escuro
- ✅ Persistência da preferência do usuário no localStorage
- ✅ Detecção automática da preferência do sistema operacional
- ✅ Transições suaves entre temas
- ✅ Ícones animados no botão de alternância
- ✅ Variáveis CSS responsivas para dark mode
- ✅ Componentes atualizados para suportar ambos os temas

## 🚀 Como Usar

### Para Usuários

1. Clique no botão de alternância de tema (ícone de sol/lua) no navbar
2. O tema será alternado automaticamente
3. Sua preferência será salva e mantida em futuras visitas

### Para Desenvolvedores

#### Usando o Hook de Tema

```typescript
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Tema atual: {theme}</p>
      <button onClick={toggleTheme}>Alternar Tema</button>
      <button onClick={() => setTheme('dark')}>Modo Escuro</button>
      <button onClick={() => setTheme('light')}>Modo Claro</button>
    </div>
  );
};
```

#### Criando Componentes com Suporte a Dark Mode

Use as variáveis CSS fornecidas para garantir compatibilidade:

```css
.myComponent {
  /* Backgrounds */
  background: var(--bg-primary);      /* Fundo principal */
  background: var(--bg-secondary);    /* Fundo secundário */
  background: var(--bg-tertiary);     /* Fundo terciário */
  background: var(--bg-card);         /* Fundo de cards */
  background: var(--bg-hover);        /* Fundo de hover */

  /* Textos */
  color: var(--text-primary);         /* Texto principal */
  color: var(--text-secondary);       /* Texto secundário */
  color: var(--text-tertiary);        /* Texto terciário */

  /* Bordas */
  border-color: var(--border-color);

  /* Inputs */
  background: var(--input-bg);
  border-color: var(--input-border);
  color: var(--input-text);
}

.myComponent::placeholder {
  color: var(--input-placeholder);
}

/* Adicione transições para suavizar mudanças de tema */
.myComponent {
  transition: background-color var(--transition-normal),
              color var(--transition-normal),
              border-color var(--transition-normal);
}
```

## 📦 Estrutura de Arquivos

```
src/
├── contexts/
│   └── ThemeContext.tsx          # Context do tema
├── components/
│   └── atoms/
│       └── ThemeToggle/
│           ├── ThemeToggle.tsx
│           ├── ThemeToggle.module.css
│           └── index.ts
└── styles/
    └── variables.css             # Variáveis CSS do tema
```

## 🎨 Variáveis CSS Disponíveis

### Tema Claro (Light)
```css
--bg-primary: #ffffff
--bg-secondary: #F5F5F5
--bg-tertiary: #e1e5e9
--text-primary: #3E3232
--text-secondary: rgba(62, 50, 50, 0.75)
--text-tertiary: rgba(62, 50, 50, 0.50)
```

### Tema Escuro (Dark)
```css
--bg-primary: #1a1a1a
--bg-secondary: #242424
--bg-tertiary: #2d2d2d
--text-primary: #e8e8e8
--text-secondary: rgba(232, 232, 232, 0.75)
--text-tertiary: rgba(232, 232, 232, 0.50)
```

## 🔧 Componentes Atualizados

Os seguintes componentes foram atualizados para suportar dark mode:

- ✅ `App.tsx` - Provider de tema adicionado
- ✅ `Navbar` - Botão de alternância integrado
- ✅ `Footer` - Cores adaptativas
- ✅ `NewsCard` - Backgrounds e textos
- ✅ `SectionHeader` - Títulos e botões
- ✅ `NewsletterSection` - Inputs e textos
- ✅ `Input` - Campos de formulário
- ✅ `ThemeToggle` - Componente novo

## 🎯 Melhores Práticas

1. **Sempre use variáveis CSS** ao invés de cores hardcoded
2. **Adicione transições** para mudanças suaves de tema
3. **Teste em ambos os temas** antes de fazer commit
4. **Mantenha contraste adequado** (WCAG 2.1 AA)
5. **Use as variáveis semânticas** (`--text-primary` ao invés de cores diretas)

## 🐛 Troubleshooting

### O tema não está sendo aplicado

1. Verifique se o `ThemeProvider` está envolvendo toda a aplicação
2. Confirme que está usando as variáveis CSS corretas
3. Limpe o localStorage e teste novamente: `localStorage.clear()`

### Cores não estão mudando

1. Verifique se você está usando variáveis CSS ao invés de cores fixas
2. Adicione transições CSS para visualizar as mudanças
3. Inspecione o `data-theme` no elemento `<html>`

### Transições muito lentas/rápidas

Ajuste as variáveis de transição em `variables.css`:
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.4s ease;
```

## 📱 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Roadmap Futuro

- [ ] Modo automático (sincroniza com horário do dia)
- [ ] Mais opções de temas (ex: tema de alto contraste)
- [ ] Customização de cores pelo usuário
- [ ] Tema por seção/página

## 📝 Licença

Este sistema de tema faz parte do projeto JCPE.

---

**Desenvolvido com ❤️ para melhorar a experiência do usuário**


