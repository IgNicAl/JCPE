import React from 'react';
import './Sustentabilidade.css';

interface SustainabilityItem {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const SUSTAINABILITY_CONTENT: SustainabilityItem[] = [
  {
    title: 'Energia Renovável em Pernambuco',
    description: 'Conheça os projetos de energia solar e eólica desenvolvidos no estado',
    icon: 'fa-leaf',
    color: '#00aa44'
  },
  {
    title: 'Preservação das Águas',
    description: 'Iniciativas para proteção dos recursos hídricos locais',
    icon: 'fa-water',
    color: '#003d82'
  },
  {
    title: 'Reflorestamento',
    description: 'Programas de plantio e restauração de áreas verdes',
    icon: 'fa-tree',
    color: '#00aa44'
  },
  {
    title: 'Reciclagem e Resíduos',
    description: 'Projetos de gestão sustentável de resíduos sólidos',
    icon: 'fa-recycle',
    color: '#ffc107'
  },
  {
    title: 'Desenvolvimento Sustentável',
    description: 'Empresas e comunidades comprometidas com práticas sustentáveis',
    icon: 'fa-globe',
    color: '#00aa44'
  },
  {
    title: 'Mobilidade Urbana Verde',
    description: 'Soluções de transporte sustentável para as cidades',
    icon: 'fa-leaf',
    color: '#c41e3a'
  },
];

const Sustentabilidade: React.FC = () => {
  return (
    <div className="sustentabilidade-page">
      <div className="sustentabilidade-container">
        <div className="sustentabilidade-header">
          <i className="fas fa-leaf"></i>
          <h1>SUSTENTABILIDADE</h1>
          <p>Iniciativas e notícias sobre desenvolvimento sustentável</p>
        </div>

        <div className="content-grid">
          {SUSTAINABILITY_CONTENT.map((item, idx) => (
            <div key={idx} className="content-card" style={{ borderLeftColor: item.color }}>
              <div className="card-icon-wrapper" style={{ backgroundColor: item.color }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sustentabilidade;

