import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import ProtectedRoute from './features/auth/routes/ProtectedRoute';
import Navbar from './components/organisms/Navbar';
import Footer from './components/organisms/Footer';
import ChatButton from './components/organisms/ChatButton';
import ChatPopup from './components/organisms/ChatPopup';

import Home from './pages/Home/Home';
import Login from './features/auth/pages/Login/Login';
import UserRegistration from './features/auth/pages/UserRegistration/UserRegistration';
import InternalRegistration from './features/auth/pages/InternalRegistration/InternalRegistration';
import UserList from './features/auth/pages/UserList/UserList';
import EditUser from './features/auth/pages/EditUser/EditUser';
import CreateNews from './features/news/pages/CreateNews/CreateNews';
import ManageNews from './features/news/pages/ManageNews/ManageNews';
import EditNews from './features/news/pages/EditNews/EditNews';
import ReviewDashboard from './features/news/pages/ReviewDashboard/ReviewDashboard';
import ManageCategories from './features/news/pages/ManageCategories/ManageCategories';
import NewsPage from './features/news/pages/NewsPage/NewsPage';
import MyJournalistDashboard from './features/news/pages/MyJournalistDashboard/MyJournalistDashboard';
import JournalistStatsOverview from './features/news/pages/JournalistStatsOverview/JournalistStatsOverview';
import Jogos from './pages/Jogos/Jogos';
import Clima from './pages/Clima/Clima';
import Recife from './pages/Recife/Recife';
import Empreendedorismo from './pages/Empreendedorismo/Empreendedorismo';
import Points from './pages/Points/Points';
import AgentChat from './pages/AgentChat/AgentChat';
import Sobre from './pages/Sobre/Sobre';
import Contato from './pages/Contato/Contato';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import AdminPanel from './pages/AdminPanel/AdminPanel';

// Category Pages
import Pernambuco from './pages/Pernambuco/Pernambuco';
import Politica from './pages/Politica/Politica';
import Economia from './pages/Economia/Economia';
import Esportes from './pages/Esportes/Esportes';
import Cultura from './pages/Cultura/Cultura';
import Mundo from './pages/Mundo/Mundo';
import Saude from './pages/Saude/Saude';
import Educacao from './pages/Educacao/Educacao';
import Tecnologia from './pages/Tecnologia/Tecnologia';
import CategoryPage from './pages/CategoryPage/CategoryPage';


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
        <ChatProvider>
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
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />

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
                path="/painel"
                element={
                  <ProtectedRoute roles={['ADMIN', 'JOURNALIST', 'REVIEWER']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/usuarios/editar/:id"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <EditUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/usuarios"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/revisao"
                element={
                  <ProtectedRoute roles={['ADMIN', 'REVIEWER']}>
                    <ReviewDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/revisao/:id"
                element={
                  <ProtectedRoute roles={['ADMIN', 'REVIEWER']}>
                    <EditNews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/categorias"
                element={
                  <ProtectedRoute roles={['ADMIN', 'REVIEWER']}>
                    <ManageCategories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/minhas-estatisticas"
                element={
                  <ProtectedRoute roles={['JOURNALIST', 'ADMIN']}>
                    <MyJournalistDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/painel/estatisticas/jornalistas"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <JournalistStatsOverview />
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
                  <ProtectedRoute roles={['ADMIN', 'JOURNALIST']}>
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
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/perfil/editar"
                element={
                  <ProtectedRoute>
                    <EditProfile />
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

              {/* Category Routes */}
              <Route path="/categoria/pernambuco" element={<Pernambuco />} />
              <Route path="/categoria/pernambuco/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/politica" element={<Politica />} />
              <Route path="/categoria/politica/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/economia" element={<Economia />} />
              <Route path="/categoria/economia/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/esportes" element={<Esportes />} />
              <Route path="/categoria/esportes/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/cultura" element={<Cultura />} />
              <Route path="/categoria/cultura/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/mundo" element={<Mundo />} />
              <Route path="/categoria/mundo/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/saude" element={<Saude />} />
              <Route path="/categoria/saude/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/educacao" element={<Educacao />} />
              <Route path="/categoria/educacao/:subcategorySlug" element={<CategoryPage />} />

              <Route path="/categoria/tecnologia" element={<Tecnologia />} />
              <Route path="/categoria/tecnologia/:subcategorySlug" element={<CategoryPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />

          {/* Chat Popup Global */}
          <ChatButton />
          <ChatPopup />
        </div>
      </Router>
        </ChatProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

