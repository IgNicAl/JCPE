import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/lib/api';
import Points from '../Points/Points';
import './UserArea.css';

export default function UserArea() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [localAvatar, setLocalAvatar] = useState(null);
  const [tab, setTab] = useState('dados'); // 'dados' | 'pontos' | 'sair'

  useEffect(() => {
    async function load() {
      try {
        const resp = await userService.getMyProfile();
        setProfile(resp.data);
      } catch (e) {
        console.error('Erro ao carregar perfil', e);
      }
    }
    load();
    // load locally stored avatar preview (if user uploaded in browser)
    const saved = localStorage.getItem('jcpm_avatar');
    if(saved){ setLocalAvatar(saved); }
  }, []);

  const handleFileChange = async (e) =>{
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = async (ev)=>{
      const dataUrl = ev.target.result;
      // show preview locally
      setLocalAvatar(dataUrl);
      localStorage.setItem('jcpm_avatar', dataUrl);
      // try to send to server (best-effort) if API supports update
      try{
        if(profile && profile.id){
          // attempt update; backend may ignore unknown field
          await userService.updateUser(profile.id, { photo: dataUrl });
        }
      }catch(err){
        // ignore server errors - we still keep local preview
        console.warn('Falha ao enviar avatar ao servidor (ignorado):', err);
      }
    };
    reader.readAsDataURL(f);
  }

  function handleLogout() {
    logout();
  }

  return (
    <div className="user-area-page">
      <div className="user-area-card">
        <div className="user-area-header">
          <h2>Área do Usuário</h2>
          <div className="tabs">
            <button className={tab === 'dados' ? 'active' : ''} onClick={() => setTab('dados')}>
              Dados
            </button>
            <button className={tab === 'pontos' ? 'active' : ''} onClick={() => setTab('pontos')}>
              Pontos
            </button>
            <button className={tab === 'sair' ? 'active logout' : 'logout'} onClick={() => setTab('sair')}>
              Sair
            </button>
          </div>
        </div>

        <div className="user-area-body">
          {tab === 'dados' && (
            <div className="profile-section">
              {profile ? (
                <>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                    <div style={{width:86,height:86,borderRadius:8,overflow:'hidden',background:'#f6f6f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {localAvatar ? (
                        <img src={localAvatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      ) : (
                        <div style={{fontWeight:800,color:'#777'}}>{(profile.name||profile.username||'U').slice(0,2).toUpperCase()}</div>
                      )}
                    </div>
                    <div>
                      <label style={{display:'inline-block',padding:'8px 12px',background:'#eee',borderRadius:6,cursor:'pointer'}}>
                        Alterar foto
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
                      </label>
                      <div style={{marginTop:8,fontSize:12,color:'#666'}}>A foto é salva localmente e enviada ao servidor quando possível.</div>
                    </div>
                  </div>
                  <div className="profile-row"><strong>Nome:</strong> {profile.name}</div>
                  <div className="profile-row"><strong>Username:</strong> {profile.username}</div>
                  <div className="profile-row"><strong>Email:</strong> {profile.email}</div>
                  <div className="profile-row"><strong>Registro:</strong> {new Date(profile.registrationDate).toLocaleDateString('pt-BR')}</div>
                </>
              ) : (
                <p>Carregando perfil...</p>
              )}
            </div>
          )}

          {tab === 'pontos' && (
            <div className="points-section">
              <Points />
            </div>
          )}

          {tab === 'sair' && (
            <div className="logout-section">
              <p>Tem certeza que deseja sair?</p>
              <div className="logout-actions">
                <button className="btn-cancel" onClick={() => setTab('dados')}>Voltar</button>
                <button className="btn-logout" onClick={handleLogout}>Sair</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
