import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroAdmin from './pages/CadastroAdmin';
import CadastroInterno from './pages/CadastroInterno';
import ListaUsuarios from './pages/ListaUsuarios';
import CriarNoticia from './pages/CriarNoticia';
import EditarNoticia from './pages/EditarNoticia';
import GerenciarNoticias from './pages/GerenciarNoticias';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<CadastroUsuario />} />
              <Route path="/interno" element={<CadastroInterno />} />
              <Route path="/" element={<Home />} />
              <Route 
                path="/noticias/criar" 
                element={
                  <ProtectedRoute requireJournalistOrAdmin={true}>
                    <CriarNoticia />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/noticias/gerenciar" 
                element={
                  <ProtectedRoute requireJournalistOrAdmin={true}>
                    <GerenciarNoticias />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/noticias/editar/:id" 
                element={
                  <ProtectedRoute requireJournalistOrAdmin={true}><EditarNoticia /></ProtectedRoute>
                } />
              <Route 
                path="/usuarios" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ListaUsuarios />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cadastro-admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <CadastroAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
