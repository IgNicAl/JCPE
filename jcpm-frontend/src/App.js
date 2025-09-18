import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CadastroUsuario from './pages/CadastroUsuario';
import ListaUsuarios from './pages/ListaUsuarios';
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
              <Route path="/" element={<Home />} />
              <Route 
                path="/usuarios" 
                element={
                  <ProtectedRoute>
                    <ListaUsuarios />
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
