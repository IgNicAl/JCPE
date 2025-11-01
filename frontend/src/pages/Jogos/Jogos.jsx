import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Jogos.css';

const GAME_SCORES = [
  { team1: 'Sport', score1: 2, team2: 'Santa Cruz', score2: 1, status: 'Final' },
  { team1: 'Náutico', score1: 0, team2: 'América-PE', score2: 0, status: '1º Tempo' },
  { team1: 'Flamengo', score1: 3, team2: 'Palmeiras', score2: 1, status: 'Final' },
  { team1: 'Botafogo', score1: 1, team2: 'Corinthians', score2: 1, status: '2º Tempo' },
  { team1: 'Vasco', score1: 2, team2: 'Fluminense', score2: 0, status: 'Final' },
  { team1: 'São Paulo', score1: 3, team2: 'Santos', score2: 2, status: 'Final' },
];

function Jogos() {
  const [games, setGames] = useState(GAME_SCORES);

  return (
    <div className="jogos-page">
      <div className="jogos-container">
        <div className="jogos-header">
          <i className="fas fa-futbol"></i>
          <h1>JOGOS</h1>
          <p>Acompanhe os resultados e próximas partidas</p>
        </div>

        <div className="games-grid">
          {games.map((game, idx) => (
            <div key={idx} className="game-card">
              <div className="game-status">{game.status}</div>
              <div className="game-content">
                <div className="team team-1">
                  <span className="team-name">{game.team1}</span>
                </div>
                <div className="game-score">
                  <span className="score">{game.score1}</span>
                  <span className="separator">x</span>
                  <span className="score">{game.score2}</span>
                </div>
                <div className="team team-2">
                  <span className="team-name">{game.team2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jogos;
