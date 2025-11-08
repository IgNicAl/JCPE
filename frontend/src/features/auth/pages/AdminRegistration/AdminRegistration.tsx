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

/**
 * @description Página de cadastro de usuário, originalmente usada para admins mas
 * agora serve como um cadastro genérico.
 */
const AdminRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <h1>
            <i className="fas fa-user-plus" /> Crie sua Conta
          </h1>
          <p>Preencha os dados abaixo para se cadastrar</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-registration-form">
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-user" /> Nome Completo *
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Digite seu nome completo" />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope" /> E-mail *
            </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Digite seu e-mail" />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              <i className="fas fa-lock" /> Senha *
            </label>
            <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required placeholder="Mínimo de 6 caracteres" />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">
              <i className="fas fa-lock" /> Confirmar Senha *
            </label>
            <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required placeholder="Repita sua senha" />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">
              <i className="fas fa-calendar-alt" /> Data de Nascimento
            </label>
            <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              <i className="fas fa-venus-mars" /> Gênero
            </label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Cadastrando...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus" /> Criar Conta
              </>
            )}
          </button>
        </form>

        <div className="admin-registration-footer">
          <p>
            Já tem uma conta? <a href="/login"><i className="fas fa-sign-in-alt" /> Faça Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;

