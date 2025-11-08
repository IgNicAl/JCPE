import React from 'react';
import logo from '@/assets/logo.svg';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo Section */}
        <div className={styles.footerLogoSection}>
          <img src={logo} alt="jcpe Logo" className={styles.footerLogoImg} />
          <div className={styles.footerSocial}>
            <a href="#" className={styles.socialIcon}><i className="fab fa-facebook" /></a>
            <a href="#" className={styles.socialIcon}><i className="fab fa-instagram" /></a>
            <a href="#" className={styles.socialIcon}><i className="fab fa-x-twitter" /></a>
            <a href="#" className={styles.socialIcon}><i className="fab fa-linkedin" /></a>
            <a href="#" className={styles.socialIcon}><i className="fab fa-youtube" /></a>
            <a href="#" className={styles.socialIcon}><i className="fab fa-tiktok" /></a>
            <a href="#" className={styles.socialIcon}><i className="fab fa-whatsapp" /></a>
          </div>
        </div>

        {/* Columns */}
        <div className={styles.footerColumns}>
          {/* Produtos */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>PRODUTOS</h4>
            <ul>
              <li><a href="#">NE 10 interior</a></li>
              <li><a href="#">Rádio Jornal</a></li>
              <li><a href="#">TV Jornal</a></li>
              <li><a href="#">Jornal do Comercio</a></li>
              <li><a href="#">Blog do Torcedor</a></li>
              <li><a href="#">Social1</a></li>
              <li><a href="#">Receita da Boa</a></li>
            </ul>
          </div>

          {/* Escute Agora */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>ESCUTE AGORA</h4>
            <ul>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> Rádio Jornal</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> Caruaru</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> Garanhuns</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> Petrolina</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> TV Jornal</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> Recife</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle" /> Interior</a>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>INSTITUCIONAL</h4>
            <ul>
              <li><a href="#">Quem somos</a></li>
              <li><a href="#">Práticas ASG jcpe</a></li>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">LGPD</a></li>
              <li><a href="#">Fale conosco</a></li>
              <li><a href="#">Trabalhe conosco</a></li>
            </ul>
          </div>

          {/* Serviços */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>SERVIÇOS</h4>
            <ul>
              <li><a href="#">Notícias Whatsapp</a></li>
              <li><a href="#">Newsletter JC</a></li>
              <li><a href="#">Publicidade Legal</a></li>
              <li><a href="#">Anuncie conosco</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <p>Jornal @ 2025 - Uma empresa do grupo jcpe</p>
        <p>
          PARA SOLICITAÇÃO DE LICENCIAMENTO, CONTACTAR{' '}
          <a href="mailto:EDITORES@NE10.COM.BR">EDITORES@NE10.COM.BR</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

