# jcpe Frontend

Frontend React para o sistema jcpe com página de cadastro de usuários.

## 🚀 Funcionalidades

- ✅ Página de cadastro de usuários com formulário completo
- ✅ Lista de usuários cadastrados
- ✅ Navegação entre páginas
- ✅ Design responsivo e moderno
- ✅ Integração com API Java (backend)
- ✅ Validação de formulários
- ✅ Feedback visual para ações do usuário

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend Java rodando na porta 8080

## 🛠️ Instalação

1. Navegue até o diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

## 🚀 Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm start
```

2. Acesse no navegador:
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
frontend
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── CadastroUser.js
│   │   ├── CadastroUser.css
│   │   ├── ListaUsers.js
│   │   └── ListaUsers.css
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   └── index.js
├── package.json
├── webpack.config.js
└── README.md
```

## 🔗 Integração com Backend

O frontend está configurado para se comunicar com o backend Java através da API REST:

- **URL Base**: `http://localhost:8080/api`
- **Endpoints**:
  - `GET /users` - Lista todos os usuários
  - `POST /users` - Cria novo usuário
  - `GET /users/{id}` - Busca usuário por ID
  - `PUT /users/{id}` - Atualiza usuário
  - `DELETE /users/{id}` - Remove usuário

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca para interface de usuário
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP para API
- **Webpack** - Bundler
- **Babel** - Transpilador JavaScript
- **CSS3** - Estilização com gradientes e animações
- **Font Awesome** - Ícones

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🚀 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run dev` - Inicia servidor de desenvolvimento e abre no navegador

## 🔧 Configuração

Para alterar a URL da API, edite o arquivo `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📝 Notas

- Certifique-se de que o backend Java está rodando antes de iniciar o frontend
- O CORS está configurado no backend para aceitar requisições do frontend
- Os dados são persistidos no banco MySQL configurado no backend




