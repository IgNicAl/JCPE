import React from 'react';
import logo from '../../../assets/logo.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <img src={logo} alt="jcpe Logo" className="footer-logo-img" />
          <div className="footer-social">
            <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-x-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-tiktok"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>

        {/* Columns */}
        <div className="footer-columns">
          {/* Produtos */}
          <div className="footer-column">
            <h4 className="column-title">PRODUTOS</h4>
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
          <div className="footer-column">
            <h4 className="column-title">ESCUTE AGORA</h4>
            <ul>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> Rádio Jornal</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> Caruaru</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> Garanhuns</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> Petrolina</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> TV Jornal</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> Recife</a>
              </li>
              <li>
                <a href="#"><i className="fas fa-play-circle"></i> Interior</a>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="footer-column">
            <h4 className="column-title">INSTITUCIONAL</h4>
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
          <div className="footer-column">
            <h4 className="column-title">SERVIÇOS</h4>
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
      <div className="footer-bottom">
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
