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
import ReviewDashboard from './features/news/pages/ReviewDashboard/ReviewDashboard';
import ManageCategories from './features/news/pages/ManageCategories/ManageCategories';
import NewsPage from './features/news/pages/NewsPage/NewsPage';
import ManageAds from './pages/AdminPanel/ManageAds/ManageAds';
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
import Busca from './pages/Busca/Busca';

// Importar subcategorias de Pernambuco
import Metropolitana from './pages/Pernambuco/Metropolitana/Metropolitana';
import Seguranca from './pages/Pernambuco/Seguranca/Seguranca';
import Mobilidade from './pages/Pernambuco/Mobilidade/Mobilidade';
import Interior from './pages/Pernambuco/Interior/Interior';
import EducacaoEstadual from './pages/Pernambuco/EducacaoEstadual/EducacaoEstadual';
import SaudePublica from './pages/Pernambuco/SaudePublica/SaudePublica';
import TurismoLocal from './pages/Pernambuco/TurismoLocal/TurismoLocal';

// Importar subcategorias de Esportes
import FutebolPE from './pages/Esportes/FutebolPE/FutebolPE';
import FutebolBR from './pages/Esportes/FutebolBR/FutebolBR';
import FutebolInt from './pages/Esportes/FutebolInt/FutebolInt';
import OutrosEsportes from './pages/Esportes/OutrosEsportes/OutrosEsportes';
import TabelaBrasileirao from './pages/Esportes/TabelaBrasileirao/TabelaBrasileirao';

// Importar subcategorias de Cultura
import Musica from './pages/Cultura/Musica/Musica';
import Cinema from './pages/Cultura/Cinema/Cinema';
import Teatro from './pages/Cultura/Teatro/Teatro';
import Literatura from './pages/Cultura/Literatura/Literatura';
import ArtesPlasticas from './pages/Cultura/ArtesPlasticas/ArtesPlasticas';
import AgendaCultural from './pages/Cultura/AgendaCultural/AgendaCultural';

// Importar subcategorias de Economia
import Negocios from './pages/Economia/Negocios/Negocios';
import Financas from './pages/Economia/Financas/Financas';
import Emprego from './pages/Economia/Emprego/Emprego';
import Agro from './pages/Economia/Agro/Agro';
import Imoveis from './pages/Economia/Imoveis/Imoveis';
import Cripto from './pages/Economia/Cripto/Cripto';

// Importar subcategorias de Política
import Federal from './pages/Politica/Federal/Federal';
import CongressoSTF from './pages/Politica/CongressoSTF/CongressoSTF';
import Eleicoes from './pages/Politica/Eleicoes/Eleicoes';
import Bastidores from './pages/Politica/Bastidores/Bastidores';
import Partidos from './pages/Politica/Partidos/Partidos';
import Reforma from './pages/Politica/Reforma/Reforma';

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
              <Route path="/busca" element={<Busca />} />

              {/* Subcategorias de Pernambuco */}
              <Route path="/pernambuco/metropolitana" element={<Metropolitana />} />
              <Route path="/pernambuco/seguranca" element={<Seguranca />} />
              <Route path="/pernambuco/mobilidade" element={<Mobilidade />} />
              <Route path="/pernambuco/interior" element={<Interior />} />
              <Route path="/pernambuco/educacao-estadual" element={<EducacaoEstadual />} />
              <Route path="/pernambuco/saude-publica" element={<SaudePublica />} />
              <Route path="/pernambuco/turismo-local" element={<TurismoLocal />} />

              {/* Subcategorias de Esportes */}
              <Route path="/esportes/futebol-pe" element={<FutebolPE />} />
              <Route path="/esportes/futebol-br" element={<FutebolBR />} />
              <Route path="/esportes/futebol-int" element={<FutebolInt />} />
              <Route path="/esportes/outros-esportes" element={<OutrosEsportes />} />
              <Route path="/esportes/tabela-brasileirao" element={<TabelaBrasileirao />} />

              {/* Subcategorias de Cultura */}
              <Route path="/cultura/musica" element={<Musica />} />
              <Route path="/cultura/cinema" element={<Cinema />} />
              <Route path="/cultura/teatro" element={<Teatro />} />
              <Route path="/cultura/literatura" element={<Literatura />} />
              <Route path="/cultura/artes-plasticas" element={<ArtesPlasticas />} />
              <Route path="/cultura/agenda-cultural" element={<AgendaCultural />} />

              {/* Subcategorias de Economia */}
              <Route path="/economia/negocios" element={<Negocios />} />
              <Route path="/economia/financas" element={<Financas />} />
              <Route path="/economia/emprego" element={<Emprego />} />
              <Route path="/economia/agro" element={<Agro />} />
              <Route path="/economia/imoveis" element={<Imoveis />} />
              <Route path="/economia/cripto" element={<Cripto />} />

              {/* Subcategorias de Política */}
              <Route path="/politica/federal" element={<Federal />} />
              <Route path="/politica/congresso-stf" element={<CongressoSTF />} />
              <Route path="/politica/eleicoes" element={<Eleicoes />} />
              <Route path="/politica/bastidores" element={<Bastidores />} />
              <Route path="/politica/partidos" element={<Partidos />} />
              <Route path="/politica/reforma" element={<Reforma />} />

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
                path="/painel/anuncios"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ManageAds />
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
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

