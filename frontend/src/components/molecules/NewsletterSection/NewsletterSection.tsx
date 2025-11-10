import React, { useState } from 'react';
import styles from './NewsletterSection.module.css';
import logoImg from '@/assets/logo.svg';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor, insira um email válido');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    // Simulação de envio (substituir por chamada real à API)
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('Inscrição realizada com sucesso!');
      setEmail('');
    }, 1000);
  };

  return (
    <div className={styles.newsletterSection}>
      <div className={styles.logoContainer}>
        <img src={logoImg} alt="JCPE Logo" className={styles.logo} />
      </div>

      <div className={styles.newsletterContent}>
        <p className={styles.description}>
          Inscreva-se para receber as últimas notícias e atualizações diretamente no seu e-mail.
        </p>

        <form onSubmit={handleSubmit} className={styles.newsletterForm}>
          <div className={styles.inputContainer}>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Seu e-mail"
              className={styles.emailInput}
              aria-label="Email para newsletter"
              required
            />
            <button
              type="submit"
              className={styles.subscribeButton}
              disabled={isSubmitting}
              aria-label="Inscrever-se na newsletter"
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>
          {message && (
            <p className={`${styles.message} ${message.includes('sucesso') ? styles.success : styles.error}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewsletterSection;

