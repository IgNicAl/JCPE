import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/api';
import './CadastroInterno.css';

const INITIAL_FORM = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nome: '',
  tipoUsuario: 'ADMIN',
  biografia: '',
  urlImagemPerfil: ''
};

function CadastroInterno() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'As senhas não coincidem.';
    }
    if (formData.password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      setLoading(false);
      return;
    }
    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nome: formData.nome,
        biografia: formData.biografia,
        urlImagemPerfil: formData.urlImagemPerfil,
        tipoUsuario: formData.tipoUsuario
      });
      setMessage({
        type: 'success',
        text: `Usuário ${formData.tipoUsuario.toLowerCase()} cadastrado com sucesso! Redirecionando para login...`
      });
      setFormData(INITIAL_FORM);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      if (error.response?.data?.error) {
        if (error.response.data.error === 'USERNAME_EXISTS') {
          errorMessage = 'Username já está em uso!';
        } else if (error.response.data.error === 'EMAIL_EXISTS') {
          errorMessage = 'Email já está em uso!';
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-interno-container">
      <div className="cadastro-interno-card">
        <div className="cadastro-interno-header">
          <h1><i className="fas fa-cog"></i>Cadastro Interno</h1>
          <p>Use esta página para criar o primeiro Administrador ou novos Jornalistas.</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-interno-form">
          {/* ...existing code... */}
        </form>

        <div className="cadastro-interno-footer">
          <p>
            <i className="fas fa-info-circle"></i>
            Esta página é destinada ao cadastro inicial de usuários com permissões no sistema.
          </p>
          <div className="login-link">
            <a href="/login">
              <i className="fas fa-sign-in-alt"></i>
              Já tem uma conta? Faça login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroInterno;
