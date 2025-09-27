import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/api';
import './InternalRegistration.css';

const INITIAL_FORM_STATE = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  tipoUser: 'ADMIN',
  biografia: '',
  urlImagemPerfil: '',
};

/**
 * @description Renderiza a página de cadastro interno, usada por administradores para
 * criar novas contas de Administrador ou Jornalista.
 * @returns {JSX.Element} A página de cadastro interno.
 */
function InternalRegistration() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @description Valida o formulário de cadastro interno.
   * @returns {string} Uma mensagem de erro se a validação falhar, ou uma string vazia.
   */
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
        name: formData.name,
        biografia: formData.biografia,
        urlImagemPerfil: formData.urlImagemPerfil,
        tipoUser: formData.tipoUser,
      });
      setMessage({
        type: 'success',
        text: `Usuário ${formData.tipoUser.toLowerCase()} cadastrado com sucesso! Redirecionando para login...`,
      });
      setFormData(INITIAL_FORM_STATE);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      // NOTE: Tratamento de erro específico para mensagens de username/email duplicado da API.
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
    <div className="internal-registration-container">
      <div className="internal-registration-card">
        <div className="internal-registration-header">
          <h1><i className="fas fa-cog" />Cadastro Interno</h1>
          <p>Use esta página para criar o primeiro Administrador ou novos Jornalistas.</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="internal-registration-form">
          {/* O código do formulário JSX foi omitido por ser repetitivo, mas estaria aqui */}
        </form>

        <div className="internal-registration-footer">
          <p>
            <i className="fas fa-info-circle" />
            Esta página é destinada ao cadastro inicial de usuários com permissões no sistema.
          </p>
          <div className="login-link">
            <a href="/login">
              <i className="fas fa-sign-in-alt" />
              Já tem uma conta? Faça login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternalRegistration;
