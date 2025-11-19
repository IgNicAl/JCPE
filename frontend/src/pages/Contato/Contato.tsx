import React, { useState } from 'react';
import './Contato.css';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

const Contato: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.email || !formData.mensagem) {
      setStatus({
        type: 'error',
        message: 'Por favor, preencha todos os campos obrigatórios.'
      });
      return;
    }

    try {
      // Aqui você implementaria a chamada à API
      // Por enquanto, apenas simulamos o envio
      console.log('Dados do formulário:', formData);
      
      setStatus({
        type: 'success',
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      });
      
      // Limpa o formulário
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erro ao enviar mensagem. Tente novamente mais tarde.'
      });
    }
  };

  return (
    <div className="contato-page">
      <div className="contato-container">
        <div className="contato-header">
          <i className="fas fa-envelope"></i>
          <h1>Entre em Contato</h1>
          <p>Estamos aqui para ouvir você. Envie sua mensagem, dúvida ou sugestão!</p>
        </div>

        <div className="contato-content">
          {/* Informações de Contato */}
          <div className="contato-info">
            <h2>Informações de Contato</h2>
            
            <div className="info-cards">
              <div className="info-card">
                <i className="fas fa-phone"></i>
                <h3>Telefone</h3>
                <p>(81) 3456-7890</p>
                <p>(81) 98765-4321</p>
              </div>

              <div className="info-card">
                <i className="fas fa-envelope"></i>
                <h3>E-mail</h3>
                <p>contato@jcpe.com.br</p>
                <p>redacao@jcpe.com.br</p>
              </div>

              <div className="info-card">
                <i className="fas fa-map-marker-alt"></i>
                <h3>Endereço</h3>
                <p>Recife - PE</p>
                <p>Brasil</p>
              </div>

              <div className="info-card">
                <i className="fas fa-clock"></i>
                <h3>Horário de Atendimento</h3>
                <p>Segunda a Sexta</p>
                <p>08:00 - 18:00</p>
              </div>
            </div>

            <div className="social-links">
              <h3>Redes Sociais</h3>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-icon" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="contato-form-wrapper">
            <h2>Envie sua Mensagem</h2>
            
            {status.message && (
              <div className={`form-status ${status.type}`}>
                <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                <span>{status.message}</span>
              </div>
            )}

            <form className="contato-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assunto">Assunto *</label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="elogio">Elogio</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="parceria">Parceria</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">Mensagem *</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Escreva sua mensagem aqui..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <i className="fas fa-paper-plane"></i>
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
