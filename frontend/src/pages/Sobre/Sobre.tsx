import React from 'react';
import './Sobre.css';

const Sobre: React.FC = () => {
  return (
    <div className="sobre-page">
      <div className="sobre-container">
        <div className="sobre-header">
          <i className="fas fa-info-circle"></i>
          <h1>Sobre o Projeto</h1>
        </div>

        <div className="sobre-content">
          <section className="sobre-section">
            <h2>Quem Somos</h2>
            <p>
              O JCPE (Jornal Cidadão de Pernambuco) é uma plataforma de notícias dedicada a levar 
              informação de qualidade para os cidadãos pernambucanos. Nossa missão é promover o 
              jornalismo cidadão, democrático e acessível a todos.
            </p>
          </section>

          <section className="sobre-section">
            <h2>Nossa Missão</h2>
            <p>
              Oferecer conteúdo jornalístico de qualidade, focado nas notícias de Pernambuco, 
              incluindo política, economia, cultura, esportes, clima e sustentabilidade. 
              Acreditamos no poder da informação para transformar a sociedade.
            </p>
          </section>

          <section className="sobre-section">
            <h2>Nossos Valores</h2>
            <div className="valores-grid">
              <div className="valor-card">
                <i className="fas fa-check-circle"></i>
                <h3>Transparência</h3>
                <p>Compromisso com a verdade e informações verificadas</p>
              </div>
              <div className="valor-card">
                <i className="fas fa-users"></i>
                <h3>Cidadania</h3>
                <p>Foco no interesse público e bem-estar social</p>
              </div>
              <div className="valor-card">
                <i className="fas fa-handshake"></i>
                <h3>Ética</h3>
                <p>Jornalismo responsável e imparcial</p>
              </div>
              <div className="valor-card">
                <i className="fas fa-leaf"></i>
                <h3>Sustentabilidade</h3>
                <p>Compromisso com o meio ambiente e futuro</p>
              </div>
            </div>
          </section>

          <section className="sobre-section">
            <h2>Nossa História</h2>
            <p>
              Fundado em 2024, o JCPE nasceu da necessidade de criar um canal de comunicação 
              direto com os cidadãos pernambucanos. Com uma equipe dedicada de jornalistas e 
              colaboradores, trabalhamos diariamente para trazer as notícias mais relevantes 
              do estado.
            </p>
            <p>
              Nossa plataforma oferece funcionalidades inovadoras como sistema de pontos para 
              leitores engajados, integração com redes sociais, e conteúdo multimídia de qualidade.
            </p>
          </section>

          <section className="sobre-section">
            <h2>O Que Oferecemos</h2>
            <div className="oferecemos-list">
              <div className="oferecemos-item">
                <i className="fas fa-newspaper"></i>
                <div>
                  <h3>Notícias em Tempo Real</h3>
                  <p>Cobertura atualizada dos principais acontecimentos de Pernambuco</p>
                </div>
              </div>
              <div className="oferecemos-item">
                <i className="fas fa-trophy"></i>
                <div>
                  <h3>Sistema de Pontos</h3>
                  <p>Recompense seu engajamento com nosso programa de pontos</p>
                </div>
              </div>
              <div className="oferecemos-item">
                <i className="fas fa-cloud-sun"></i>
                <div>
                  <h3>Previsão do Tempo</h3>
                  <p>Informações meteorológicas das principais cidades do estado</p>
                </div>
              </div>
              <div className="oferecemos-item">
                <i className="fas fa-futbol"></i>
                <div>
                  <h3>Esportes</h3>
                  <p>Acompanhe placares e classificações dos times pernambucanos</p>
                </div>
              </div>
            </div>
          </section>

          <section className="sobre-section cta-section">
            <h2>Faça Parte da Nossa História</h2>
            <p>
              Cadastre-se em nossa plataforma, acumule pontos lendo notícias e participe 
              da construção de um jornalismo cada vez mais cidadão!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
