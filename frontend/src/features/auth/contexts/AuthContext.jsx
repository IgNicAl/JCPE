import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { userService } from '@/services/api';

export const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenTimerRef = useRef({ running: false, accumulated: 0, lastTick: null, intervalId: null });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed && parsed.userType === 'USER') {
        startScreenTimer();
      }
    }
    setLoading(false);

    // Adiciona um listener para o evento de 'unauthorized' disparado pela API.
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
      // ensure timer stopped on unmount
      stopScreenTimer(true);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // iniciar contador de tempo de tela apenas para usuários comuns
    if (userData && userData.userType === 'USER') {
      startScreenTimer();
    }
  };

  const logout = () => {
    // enviar o restante e parar timer
    stopScreenTimer(true);
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => user !== null;
  const isAdmin = () => user && user.userType === 'ADMIN';
  const isJournalist = () => user && user.userType === 'JOURNALIST';

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isJournalist,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

// ----- Screen time manager (module-level helpers) -----
const SCREEN_SEND_INTERVAL = 30; // segundos

function startScreenTimer() {
  // singleton manager stored on window to survive hot reloads
  const mgr = window.__jcpe_screen_timer__ || {
    running: false,
    accumulated: 0,
    lastTick: Date.now(),
    intervalId: null,
  };

  if (mgr.running) return;
  mgr.running = true;
  mgr.lastTick = Date.now();

  // tick every second to track visibility accurately
  mgr.intervalId = setInterval(async () => {
    const now = Date.now();
    const deltaMs = now - mgr.lastTick;
    mgr.lastTick = now;

    // only count when page is visible
    if (document.visibilityState === 'visible') {
      mgr.accumulated += Math.floor(deltaMs / 1000);
    }

    // when accumulated reaches the send interval, send to backend
    if (mgr.accumulated >= SCREEN_SEND_INTERVAL) {
      const toSend = mgr.accumulated - (mgr.accumulated % SCREEN_SEND_INTERVAL);
      mgr.accumulated = mgr.accumulated % SCREEN_SEND_INTERVAL;
      try {
        await userService.sendScreenTime(toSend);
      } catch (e) {
        // ignore network errors; will retry on next interval
        console.error('Erro ao enviar screen time:', e);
      }
    }
  }, 1000);

  window.__jcpe_screen_timer__ = mgr;
}

function stopScreenTimer(sendRemaining = false) {
  const mgr = window.__jcpe_screen_timer__;
  if (!mgr) return;
  mgr.running = false;
  if (mgr.intervalId) {
    clearInterval(mgr.intervalId);
    mgr.intervalId = null;
  }
  if (sendRemaining && mgr.accumulated > 0) {
    // try to send remaining seconds synchronously using navigator.sendBeacon if available
    const payload = JSON.stringify({ seconds: mgr.accumulated });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/users/me/screentime', blob);
      } else {
        // fallback to fetch (best-effort)
        fetch('/api/users/me/screentime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      console.error('Erro ao enviar remaining screen time:', e);
    }
    mgr.accumulated = 0;
  }
}
