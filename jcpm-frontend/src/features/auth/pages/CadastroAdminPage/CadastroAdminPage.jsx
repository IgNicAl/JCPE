import { useState } from 'react';
// Corrigido: Importando o serviço de autenticação correto
import { authService } from '../../../../lib/api';
import './CadastroUsuario.css';
import { useNavigate } from 'react-router-dom';

const INITIAL_FORM = {
  nome: '',
  sexo: '', // Campo mantido no form por requisito de não alterar o visual, mas não será enviado.
  dataNascimento: '', // Campo mantido no form, mas não será enviado.
  email: '',
  senha: '',
  confirmarSenha: '' // Corrigido: Adicionado campo para confirmação de senha
};

function CadastroUsuarioPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação client-side
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
      // Corrigido: Montando o payload correto para a API de registro.
      // O campo 'nome' do formulário é usado para 'username' e 'nome'.
      const usuarioData = {
        username: formData.nome, // A API espera um username, usamos o nome completo.
        nome: formData.nome,
        email: formData.email,
        password: formData.senha,
      };

      // Corrigido: Chamando o serviço de autenticação correto (authService.register)
      await authService.register(usuarioData);

      setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso! Redirecionando para o login...' });
      setFormData(INITIAL_FORM);

      // Redireciona para a página de login após um tempo
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      // Corrigido: Tratamento de erro mais específico com base na resposta da API.
      const errorMessage = error.response?.data?.message || 'Erro ao cadastrar usuário. Tente novamente.';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h1><i className="fas fa-user-plus"></i> Crie sua Conta</h1>
          <p>Preencha os dados abaixo para se cadastrar</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group">
            <label htmlFor="nome"><i className="fas fa-user"></i> Nome Completo *</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Digite seu nome completo" />
          </div>

          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope"></i> E-mail *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Digite seu e-mail" />
          </div>

          <div className="form-group">
            <label htmlFor="senha"><i className="fas fa-lock"></i> Senha *</label>
            <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required placeholder="Mínimo de 6 caracteres" />
          </div>

          {/* Corrigido: Campo de confirmação de senha adicionado */}
          <div className="form-group">
            <label htmlFor="confirmarSenha"><i className="fas fa-lock"></i> Confirmar Senha *</label>
            <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required placeholder="Repita sua senha" />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento"><i className="fas fa-calendar-alt"></i> Data de Nascimento</label>
            <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="sexo"><i className="fas fa-venus-mars"></i> Sexo</label>
            <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Cadastrando...</>
            ) : (
              <><i className="fas fa-user-plus"></i> Criar Conta</>
            )}
          </button>
        </form>

        <div className="cadastro-footer">
          <p>
            Já tem uma conta? <a href="/login"><i className="fas fa-sign-in-alt"></i> Faça Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuarioPage;
