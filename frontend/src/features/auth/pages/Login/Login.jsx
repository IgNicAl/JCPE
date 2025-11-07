import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import { authService } from '@/services/api';
import FormField from '@/components/molecules/FormField';
import FormMessage from '@/components/molecules/FormMessage';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import { ROUTES } from '@/utils/constants';
import styles from './Login.module.css';

const INITIAL_FORM_STATE = {
  username: '',
  password: '',
};

/**
 * @description Renderiza a página de login, permitindo que os usuários se autentiquem na aplicação.
 * @returns {JSX.Element} A página de login com formulário.
 */
function Login() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @description Valida o formulário de login.
   * @returns {string} Uma mensagem de erro se a validação falhar, ou uma string vazia se for bem-sucedida.
   */
  const validateForm = () => {
    if (!formData.username || !formData.password) {
      return 'Por favor, preencha todos os campos.';
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
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      // Mapeia a resposta da API para o formato esperado pelo contexto de autenticação.
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        name: response.data.name,
        userType: response.data.userType,
        token: response.data.token,
      };

      login(userData);
      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (error.response?.status === 401) {
        errorMessage = error.response.data?.message || 'Username ou senha incorretos.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>
            <Icon name="fa-sign-in-alt" /> Login
          </h1>
          <p>Entre com suas credenciais para acessar o sistema</p>
        </div>

        <FormMessage type={message.type} message={message.text} />

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <FormField
            id="username"
            label="Usuário"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <FormField
            id="password"
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <div className={styles.formActions}>
            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        <div className={styles.loginFooter}>
          <p>
            Não tem uma conta?
            <Link to={ROUTES.REGISTER}>
              <Icon name="fa-user-plus" /> Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
