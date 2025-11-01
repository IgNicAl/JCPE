import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/lib/api';
import './Points.css';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function Points() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ totalSeconds: 0, points: 0 });
  const [error, setError] = useState('');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function load() {
      if (!isAuthenticated() || !user) return;
      try {
        setLoading(true);
        const resp = await userService.getMyPoints();
        setData(resp.data || { totalSeconds: 0, points: 0 });
      } catch (e) {
        setError('Não foi possível carregar seus pontos');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // live session timer: increments while page visible AND user is authenticated
  useEffect(()=>{
    if (!isAuthenticated() || !user || user.userType !== 'USER') {
      // ensure no interval running when not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    // if a global screen-timer manager exists (created by AuthContext), read from it
    const mgr = window.__jcpm_screen_timer__;
    if (mgr) {
      function syncFromGlobal(){
        try{
          const accumulated = Number(mgr.accumulated || 0);
          const lastTick = Number(mgr.lastTick || 0);
          let extra = accumulated;
          if (document.visibilityState === 'visible' && lastTick > 0) {
            extra += Math.floor((Date.now() - lastTick) / 1000);
          }
          setSessionSeconds(extra);
        }catch(e){
          // ignore
        }
      }
      syncFromGlobal();
      intervalRef.current = setInterval(syncFromGlobal, 1000);
      return ()=>{
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      }
    }

    // fallback: local incremental timer while visible
    function tick(){ if(document.visibilityState === 'visible'){ setSessionSeconds(s => s + 1); } }
    intervalRef.current = setInterval(tick, 1000);
    const handleVisibility = ()=>{};
    document.addEventListener('visibilitychange', handleVisibility);
    return ()=>{
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  },[isAuthenticated, user]);

  if (!isAuthenticated() || !user) {
    return (
      <div className="points-page">
        <p>Faça login para ver sua página de pontos.</p>
      </div>
    );
  }

  if (user.userType !== 'USER') {
    return (
      <div className="points-page">
        <p>Esta página é destinada a usuários comuns.</p>
      </div>
    );
  }

  return (
    <div className="points-page">
      <h2 className="points-title">Painel de Pontos</h2>
      {loading ? <p>Carregando...</p> : error ? <p className="error">{error}</p> : (
        <div className="points-grid">
          <div className="card card-timer">
            <div className="card-header">Cronômetro</div>
            <div className="card-body">
              <div className="timer-display">{formatTime(sessionSeconds)}</div>
              <div className="card-note">Sessão em andamento — tempo contado enquanto a aba estiver visível.</div>
            </div>
          </div>

          <div className="card card-points">
            <div className="card-header">Moedas / Pontos</div>
            <div className="card-body points-center">
              <div className="points-value">{data.points}</div>
              <div className="points-sub">Pontos acumulados</div>
              {(() => {
                const totalLive = (data.totalSeconds || 0) + (sessionSeconds || 0);
                const rem = (60 - (totalLive % 60)) % 60;
                const cls = rem === 0 ? 'next-point-badge pulse' : 'next-point-badge';
                return (
                  <div className={cls}>Faltam <span className="next-seconds">{rem}</span>s para o próximo ponto</div>
                );
              })()}
            </div>
            <div className="card-footer">1 ponto = 60s</div>
          </div>

          <div className="card card-total">
            <div className="card-header">Tempo Total</div>
            <div className="card-body">
              <div className="total-display">{formatTime(data.totalSeconds + sessionSeconds)}</div>
              <div className="total-sub">Tempo total registrado (persistido + sessão)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
