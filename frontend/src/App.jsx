import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Corrigido: Importações ajustadas para a estrutura de pastas correta
import { AuthProvider } from './features/auth/contexts/AuthContext';
import ProtectedRoute from './features/auth/routes/ProtectedRoute';
import Navbar from './components/ui/Navbar/Navbar';

// Importação das páginas
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './features/auth/pages/LoginPage/LoginPage';
import CadastroUsuarioPage from './features/auth/pages/CadastroUsuarioPage/CadastroUsuarioPage';
import CadastroInternoPage from './features/auth/pages/CadastroInternoPage/CadastroInternoPage';
import ListaUsuariosPage from './features/auth/pages/ListaUsuariosPage/ListaUsuariosPage';
import CriarNoticiaPage from './features/news/pages/CriarNoticiaPage/CriarNoticiaPage';
import GerenciarNoticiasPage from './features/news/pages/GerenciarNoticiasPage/GerenciarNoticiasPage';
import EditarNoticiaPage from './features/news/pages/EditarNoticiaPage/EditarNoticiaPage';

// Corrigido: Removida a exportação nomeada desnecessária
export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Corrigido: Rota de cadastro público apontando para o componente correto */}
              <Route path="/cadastro" element={<CadastroUsuarioPage />} />
              {/* Rota para cadastro de admin/jornalista, pode ser pública ou protegida */}
              <Route path="/cadastro-interno" element={<CadastroInternoPage />} />

              {/* Rotas Protegidas para Jornalistas e Admins */}
              <Route
                path="/noticias/criar"
                element={
                  <ProtectedRoute>
                    <CriarNoticiaPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/gerenciar"
                element={
                  <ProtectedRoute>
                    <GerenciarNoticiasPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/editar/:id"
                element={
                  <ProtectedRoute>
                    <EditarNoticiaPage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas Protegidas apenas para Admins */}
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ListaUsuariosPage />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/cadastro-admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <CadastroInternoPage />
                  </ProtectedRoute>
                }
              />

              {/* Rota de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
