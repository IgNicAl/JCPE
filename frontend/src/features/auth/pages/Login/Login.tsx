import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import { authService } from '@/services/api';
import FormField from '@/components/molecules/FormField';
import FormMessage from '@/components/molecules/FormMessage';
import Button from '@/components/atoms/Button';
import { ROUTES } from '@/utils/constants';
import { User } from '@/types';
import styles from './Login.module.css';

interface FormState {
  username: string;
  password: string;
}

const INITIAL_FORM_STATE: FormState = {
  username: '',
  password: '',
};

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

/**
 * @description Renderiza a página de login, permitindo que os usuários se autentiquem na aplicação.
 */
const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext not available');
  const { login } = authContext;
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @description Valida o formulário de login.
   * @returns {string} Uma mensagem de erro se a validação falhar, ou uma string vazia se for bem-sucedida.
   */
  const validateForm = (): string => {
    if (!formData.username || !formData.password) {
      return 'Por favor, preencha todos os campos.';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      const userData: User = {
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
    } catch (error: unknown) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { status?: number; data?: { message?: string } } };
        if (err.response?.status === 401) {
          errorMessage = err.response.data?.message || 'Username ou senha incorretos.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Usuário não encontrado.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
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
            <i className="fas fa-sign-in-alt" /> Login
          </h1>
          <p>Entre com suas credenciais para acessar o sistema</p>
        </div>

        <FormMessage type={message.type || undefined} message={message.text} />

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
              <i className="fas fa-user-plus" /> Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

