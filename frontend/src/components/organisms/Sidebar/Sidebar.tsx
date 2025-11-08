import React from 'react';
import styles from './Sidebar.module.css';

const WeatherWidget: React.FC = () => (
  <div className={styles.widget}>
    <div className={styles.widgetHeader}>
      <i className="fas fa-cloud-sun"></i>
      <h3>Clima em Recife</h3>
    </div>
    <div className={styles.weatherWidgetContent}>
      <div className={styles.temperatureDisplay}>
        <span className={styles.temp}>29°C</span>
        <span className={styles.desc}>Ensolarado</span>
      </div>
      <div className={styles.weatherMeta}>
        <div className={styles.metaItem}>
          <i className="fas fa-wind"></i> 12 km/h
        </div>
        <div className={styles.metaItem}>
          <i className="fas fa-tint"></i> 75%
        </div>
      </div>
    </div>
  </div>
);

const GamesWidget: React.FC = () => (
  <div className={styles.widget}>
    <div className={styles.widgetHeader}>
      <i className="fas fa-futbol"></i>
      <h3>Jogos da Rodada</h3>
    </div>
    <div className={styles.gamesList}>
      <div className={styles.gameItem}>
        <div className={styles.teams}>
          <span className={styles.teamName}>Sport</span>
          <span className={styles.score}>2 - 1</span>
          <span className={styles.teamName}>Santa Cruz</span>
        </div>
        <div className={styles.gameStatus}>Encerrado</div>
      </div>
      <div className={styles.gameItem}>
        <div className={styles.teams}>
          <span className={styles.teamName}>Náutico</span>
          <span className={styles.score}>0 - 0</span>
          <span className={styles.teamName}>Salgueiro</span>
        </div>
        <div className={styles.gameStatus}>Ao Vivo</div>
      </div>
    </div>
  </div>
);

const StocksWidget: React.FC = () => (
  <div className={styles.widget}>
    <div className={styles.widgetHeader}>
      <i className="fas fa-chart-line"></i>
      <h3>Mercado de Ações</h3>
    </div>
    <div className={styles.stocksList}>
      <div className={styles.stockItem}>
        <span className={styles.stockName}>MGLU3</span>
        <span className={`${styles.stockChange} ${styles.green}`}>+2.5%</span>
      </div>
      <div className={styles.stockItem}>
        <span className={styles.stockName}>PETR4</span>
        <span className={`${styles.stockChange} ${styles.red}`}>-1.2%</span>
      </div>
      <div className={styles.stockItem}>
        <span className={styles.stockName}>VALE3</span>
        <span className={`${styles.stockChange} ${styles.green}`}>+0.8%</span>
      </div>
    </div>
  </div>
);

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <WeatherWidget />
      <GamesWidget />
      <StocksWidget />
    </aside>
  );
};

export default Sidebar;

