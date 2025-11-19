import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import ProtectedRoute from './features/auth/routes/ProtectedRoute';
import Navbar from './components/organisms/Navbar';
import Footer from './components/organisms/Footer';

import Home from './pages/Home/Home';
import Login from './features/auth/pages/Login/Login';
import UserRegistration from './features/auth/pages/UserRegistration/UserRegistration';
import InternalRegistration from './features/auth/pages/InternalRegistration/InternalRegistration';
import UserList from './features/auth/pages/UserList/UserList';
import EditUser from './features/auth/pages/EditUser/EditUser';
import CreateNews from './features/news/pages/CreateNews/CreateNews';
import ManageNews from './features/news/pages/ManageNews/ManageNews';
import EditNews from './features/news/pages/EditNews/EditNews';
import NewsPage from './features/news/pages/NewsPage/NewsPage';
import Jogos from './pages/Jogos/Jogos';
import Clima from './pages/Clima/Clima';
import Recife from './pages/Recife/Recife';
import Empreendedorismo from './pages/Empreendedorismo/Empreendedorismo';
import Points from './pages/Points/Points';
import AgentChat from './pages/AgentChat/AgentChat';

/**
 * Componente que ouve o evento global 'unauthorized' (disparado pela api.js)
 * e força o redirecionamento para a página de login.
 */
const RedirectController: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login');
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [navigate]);
  return null;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <RedirectController />
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<UserRegistration />} />
              <Route path="/noticia/:slug" element={<NewsPage />} />
              <Route path="/jogos" element={<Jogos />} />
              <Route path="/clima" element={<Clima />} />
              <Route path="/recife" element={<Recife />} />
              <Route path="/empreendedorismo" element={<Empreendedorismo />} />
              <Route path="/noticias" element={<Home />} />

              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <AgentChat />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cadastro-interno"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <InternalRegistration />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/usuarios/editar/:id"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <EditUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/noticias/criar"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <CreateNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/gerenciar"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <ManageNews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/noticias/editar/:id"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <EditNews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pontos"
                element={
                  <ProtectedRoute roles={['USER']}>
                    <Points />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/cadastro-admin"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <InternalRegistration />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

