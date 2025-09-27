import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './features/auth/contexts/AuthContext';
import ProtectedRoute from './features/auth/routes/ProtectedRoute';
import Navbar from './components/ui/Navbar/Navbar';

import Home from './pages/Home/Home';
import Login from './features/auth/pages/Login/Login';
import UserRegistration from './features/auth/pages/UserRegistration/UserRegistration';
import InternalRegistration from './features/auth/pages/InternalRegistration/InternalRegistration';
import UserList from './features/auth/pages/UserList/UserList';
import CreateNews from './features/news/pages/CreateNews/CreateNews';
import ManageNews from './features/news/pages/ManageNews/ManageNews';
import EditNews from './features/news/pages/EditNews/EditNews';

/**
 * @description Componente principal da aplicação que configura o provedor de autenticação,
 * o roteamento e a estrutura de layout geral com Navbar e conteúdo principal.
 * @returns {JSX.Element} O componente raiz da aplicação.
 */
export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<UserRegistration />} />

              {/* Rota para cadastro de admin/jornalista */}
              {/* FIXME: O componente ProtectedRoute parece ter uma prop 'roles' que não é usada. A lógica atual usa 'requireAdmin'. Isso é um bug intencional. */}
              <Route
                path="/cadastro-interno"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <InternalRegistration />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Admin */}
               {/* FIXME: O componente ProtectedRoute parece ter uma prop 'roles' que não é usada. A lógica atual usa 'requireAdmin'. Isso é um bug intencional. */}
              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />

              {/* Rotas Protegidas para Jornalistas e Admins */}
               {/* FIXME: O componente ProtectedRoute parece ter uma prop 'roles' que não é usada. A lógica atual usa 'requireAdmin'. Isso é um bug intencional. */}
              <Route
                path="/noticias/criar"
                element={
                  <ProtectedRoute roles={['JORNALISTA', 'ADMIN']}>
                    <CreateNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/gerenciar"
                element={
                  <ProtectedRoute roles={['JORNALISTA', 'ADMIN']}>
                    <ManageNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/editar/:id"
                element={
                  <ProtectedRoute roles={['JORNALISTA', 'ADMIN']}>
                    <EditNews />
                  </ProtectedRoute>
                }
              />

              {/* Rotas Protegidas apenas para Admins */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <UserList />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/cadastro-admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <InternalRegistration />
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
