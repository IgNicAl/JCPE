import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import './AdminRegistration.css';

interface FormState {
  name: string;
  gender: string;
  dataNascimento: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  gender: '',
  dataNascimento: '',
  email: '',
  senha: '',
  confirmarSenha: '',
};

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

interface ValidationState {
  passwordMatch: boolean | null;
  passwordLength: boolean | null;
  emailValid: boolean | null;
}

/**
 * @description Página de cadastro de usuário, originalmente usada para admins mas
 * agora serve como um cadastro genérico.
 */
const AdminRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const [validation, setValidation] = useState<ValidationState>({
    passwordMatch: null,
    passwordLength: null,
    emailValid: null,
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validação em tempo real
    if (name === 'senha') {
      setValidation((prev) => ({
        ...prev,
        passwordLength: value.length >= 6,
        passwordMatch: formData.confirmarSenha ? value === formData.confirmarSenha : null,
      }));
    }

    if (name === 'confirmarSenha') {
      setValidation((prev) => ({
        ...prev,
        passwordMatch: value === formData.senha,
      }));
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidation((prev) => ({
        ...prev,
        emailValid: emailRegex.test(value),
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação client-side para senha.
    if (formData.senha !== formData.confirmarSenha) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (formData.senha.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const userData = {
        username: formData.name,
        name: formData.name,
        email: formData.email,
        password: formData.senha,
      };

      await authService.register(userData);

      setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso! Redirecionando para o login...' });
      setFormData(INITIAL_FORM_STATE);
      setValidation({
        passwordMatch: null,
        passwordLength: null,
        emailValid: null,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-registration-container">
      <div className="admin-registration-card">
        <div className="admin-registration-header">
          <div className="header-icon">
            <i className="fas fa-user-plus" />
          </div>
          <h1>Crie sua Conta</h1>
          <p>Preencha os dados abaixo para começar sua jornada</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-registration-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user" />
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Digite seu nome completo"
                className={formData.name ? 'filled' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope" />
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu.email@exemplo.com"
                className={
                  formData.email
                    ? validation.emailValid
                      ? 'filled valid'
                      : 'filled invalid'
                    : ''
                }
              />
              {validation.emailValid === false && formData.email && (
                <small className="error-hint">Por favor, insira um e-mail válido</small>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dataNascimento">
                <i className="fas fa-calendar-alt" />
                Data de Nascimento
              </label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className={formData.dataNascimento ? 'filled' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">
                <i className="fas fa-venus-mars" />
                Gênero
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={formData.gender ? 'filled' : ''}
              >
                <option value="">Selecione...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
          </div>

          <div className="password-section">
            <div className="section-header">
              <i className="fas fa-shield-alt" />
              <span>Segurança da Conta</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="senha">
                  <i className="fas fa-lock" />
                  Senha *
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="Mínimo de 6 caracteres"
                  className={
                    formData.senha
                      ? validation.passwordLength
                        ? 'filled valid'
                        : 'filled invalid'
                      : ''
                  }
                />
                {validation.passwordLength === false && formData.senha && (
                  <small className="error-hint">A senha deve ter no mínimo 6 caracteres</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">
                  <i className="fas fa-lock" />
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                  placeholder="Repita sua senha"
                  className={
                    formData.confirmarSenha
                      ? validation.passwordMatch
                        ? 'filled valid'
                        : 'filled invalid'
                      : ''
                  }
                />
                {validation.passwordMatch === false && formData.confirmarSenha && (
                  <small className="error-hint">As senhas não coincidem</small>
                )}
                {validation.passwordMatch === true && formData.confirmarSenha && (
                  <small className="success-hint">
                    <i className="fas fa-check-circle" /> As senhas coincidem
                  </small>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus" />
                Criar Conta
              </>
            )}
          </button>
        </form>

        <div className="admin-registration-footer">
          <p>
            Já tem uma conta?
            <a href="/login">
              <i className="fas fa-sign-in-alt" />
              Faça Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;

