import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/services/api';
import { pad } from '@/utils/helpers';
import styles from './NextPoint.module.css';

export default function NextPoint(){
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [remaining, setRemaining] = useState(null);
  const [show, setShow] = useState(false);
  const intervalRef = useRef(null);
  const backendTotalRef = useRef(0);

  useEffect(()=>{
    if(!isAuthenticated() || !user || user.userType !== 'USER'){
      setShow(false);
      if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current=null; }
      return;
    }
    setShow(true);

    let mounted = true;
    async function load(){
      try{
        const resp = await userService.getMyPoints();
        if(!mounted) return;
        backendTotalRef.current = resp.data?.totalSeconds || 0;
      }catch(e){
        // ignore
      }
    }
    load();

    function tick(){
      // compute live total = backendTotal + global accumulated + elapsed
      const mgr = window.__jcpe_screen_timer__;
      let live = backendTotalRef.current || 0;
      if(mgr){
        const acc = Number(mgr.accumulated || 0);
        const last = Number(mgr.lastTick || 0);
        let extra = acc;
        if(document.visibilityState === 'visible' && last > 0){ extra += Math.floor((Date.now() - last)/1000); }
        live += extra;
      }
      const rem = (60 - (live % 60)) % 60;
      setRemaining(rem);
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return ()=>{ mounted=false; if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current=null; } };
  },[user]);

  if(!show) return null;

  // format mm:ss or Xs
  const mins = Math.floor(remaining/60);
  const secs = remaining % 60;

  return (
    <div
      className={`${styles.nextPointWidget} ${remaining === 0 ? styles.pulse : ''}`}
      title="Tempo até o próximo ponto"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/pontos')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate('/pontos');
      }}
    >
      <svg
        className={styles.clockIcon}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6" opacity="0.9" />
        <path
          d="M12 7v6l4 2"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className={styles.nextText}>
        {mins > 0 ? `${mins}:${pad(secs)}` : `${secs}s`}
      </div>
    </div>
  );
}
