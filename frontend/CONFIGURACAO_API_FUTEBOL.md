# ⚽ Configuração da API de Futebol

## 📋 Passo a Passo

### 1️⃣ Configurar a Chave da API

1. Abra o arquivo `frontend/.env`
2. Cole sua chave da API-Football:

```env
VITE_FOOTBALL_API_KEY=SUA_CHAVE_AQUI
```

### 2️⃣ Substituir o arquivo Jogos.tsx

Para ativar a nova versão com dados reais da API:

1. **Backup do arquivo antigo** (opcional):
   ```bash
   cd frontend/src/pages/Jogos
   mv Jogos.tsx Jogos.old.tsx
   ```

2. **Renomear o novo arquivo**:
   ```bash
   mv JogosNew.tsx Jogos.tsx
   mv JogosNew.css Jogos.css
   ```

   Ou no Windows (PowerShell):
   ```powershell
   cd frontend\src\pages\Jogos
   Rename-Item Jogos.tsx Jogos.old.tsx
   Rename-Item JogosNew.tsx Jogos.tsx
   Rename-Item JogosNew.css Jogos.css
   ```

### 3️⃣ Instalar dependência (se necessário)

Se o axios não estiver instalado:

```bash
cd frontend
npm install axios
```

### 4️⃣ Reiniciar o servidor de desenvolvimento

```bash
npm run dev
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Dados Reais da API-Football

- **Placares ao vivo** e jogos recentes
- **Tabela de classificação** do Brasileirão Série A
- **Times de Pernambuco**: Sport, Náutico, Santa Cruz
- **Cache de 24 horas** para economizar requisições

### 📊 Abas de Navegação

1. **Times de Pernambuco**: Últimos jogos dos times locais
2. **Brasileirão Série A**: Jogos e classificação nacional

### 🏆 Tabela de Classificação

- Top 10 times
- Pontos, vitórias, empates, derrotas
- Saldo de gols
- Indicação de zonas:
  - 🔵 Libertadores (1º ao 6º)
  - 🟡 Sul-Americana (7º ao 12º)
  - 🔴 Rebaixamento (17º ao 20º)

### 💾 Sistema de Cache

- Cache local de **24 horas**
- Economiza requisições da API
- Fallback para dados mock se API falhar

---

## 🔑 Obter Chave da API-Football

1. Acesse: https://www.api-football.com/
2. Clique em **"Get Started"**
3. Crie uma conta gratuita
4. No dashboard, copie sua **API Key**
5. Cole no arquivo `.env` conforme passo 1

### 📊 Limites do Plano Gratuito

- ✅ **100 requisições por dia**
- ✅ Dados ao vivo
- ✅ Classificações
- ✅ Estatísticas básicas
- ✅ Múltiplas ligas

Com cache de 24h, você usará apenas **3-5 requisições por dia** para:
- Jogos de Pernambuco
- Jogos do Brasileirão
- Classificação

---

## 🐛 Solução de Problemas

### API não retorna dados?

1. Verifique se a chave está correta no `.env`
2. Confirme que o servidor foi reiniciado após adicionar a chave
3. Verifique o console do navegador para erros
4. A API tem um fallback para dados mock em caso de erro

### Erros de compilação?

```bash
cd frontend
npm install
npm run dev
```

### Cache não está funcionando?

O cache é armazenado em memória. Ao recarregar a página, novos dados serão buscados.

---

## 📝 Notas Importantes

- **Requisições limitadas**: 100/dia no plano gratuito
- **Cache recomendado**: Mantido em 24h
- **Fallback automático**: Usa dados mock se API falhar
- **Times de PE**: Sport (ID: 124), Náutico (ID: 138), Santa Cruz (ID: 7938)

---

## 🎨 Customização

Para alterar as ligas exibidas, edite em `footballApi.ts`:

```typescript
const LEAGUES = {
  BRASILEIRAO_A: 71,
  BRASILEIRAO_B: 72,
  COPA_DO_BRASIL: 73,
  COPA_DO_NORDESTE: 141,
};
```

---

## ✨ Pronto!

Após seguir estes passos, a página de Jogos exibirá:
- ⚽ Placares reais em tempo real
- 📊 Tabela de classificação atualizada
- 🏟️ Jogos dos times de Pernambuco

Aproveite! 🎉
