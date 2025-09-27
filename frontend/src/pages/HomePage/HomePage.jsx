import React, { useState, useEffect, useMemo } from 'react';
import { noticiaService } from '@/lib/api';
import './Home.css';

const PLACAR_JOGOS = [
  { time1: 'Sport', placar1: 2, time2: 'Santa Cruz', placar2: 1, status: 'Final' },
  { time1: 'Náutico', placar1: 0, time2: 'América-PE', placar2: 0, status: '1º Tempo' },
  { time1: 'Flamengo', placar1: 3, time2: 'Palmeiras', placar2: 1, status: 'Final' }
];
const PREVISAO_TEMPO = {
  cidade: 'Recife',
  temperatura: 28,
  descricao: 'Parcialmente nublado',
  umidade: 75,
  vento: '15 km/h'
};
const BOLSA_VALORES = [
  { acao: 'PETR4', valor: 32.45, variacao: '+2.1%', cor: 'verde' },
  { acao: 'VALE3', valor: 58.90, variacao: '-1.3%', cor: 'vermelho' },
  { acao: 'ITUB4', valor: 28.75, variacao: '+0.8%', cor: 'verde' }
];

function Home() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarNoticias() {
      try {
        setLoading(true);
        setError('');
        const response = await noticiaService.getAllNoticias().catch(() => ({ data: [] }));
        const recebidas = Array.isArray(response?.data) ? response.data : [];
        recebidas.sort((a, b) => b.prioridade - a.prioridade || new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
        const mockNoticias = [
          {
            id: 'm1',
            titulo: 'Plano de mobilidade urbana traz mudanças nas principais vias',
            subtitulo: 'Trânsito deve fluir melhor com novas faixas exclusivas e ciclovias',
            resumo: 'Cidade anuncia pacote de melhorias para o tráfego e transporte público.',
            imagemUrl: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop',
            dataPublicacao: new Date().toISOString(),
          },
          {
            id: 'm2',
            titulo: 'Educação: escolas ampliam projetos de tempo integral',
            subtitulo: 'Alunos terão mais atividades no contraturno',
            resumo: 'Iniciativa visa melhorar desempenho e reduzir evasão escolar.',
            imagemUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1600&auto=format&fit=crop',
            dataPublicacao: new Date().toISOString(),
          },
          {
            id: 'm3',
            titulo: 'Economia criativa movimenta o centro histórico no fim de semana',
            subtitulo: 'Feiras e shows valorizam artistas locais',
            resumo: 'Programação especial inclui oficinas e apresentações gratuitas.',
            imagemUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
            dataPublicacao: new Date().toISOString(),
          },
          ...Array.from({ length: 9 }).map((_, i) => ({
            id: `s${i+1}`,
            titulo: `Notícia breve ${i+1}: título ilustrativo para card`,
            subtitulo: 'Resumo curto para demonstração da listagem de notícias.',
            resumo: 'Resumo curto para demonstração da listagem de notícias.',
            imagemUrl: `https://picsum.photos/seed/jcpm-${i+1}/600/400`,
            dataPublicacao: new Date(Date.now() - (i+1) * 86400000).toISOString(),
          })),
        ];
        setNoticias(recebidas.length > 0 ? recebidas : mockNoticias);
      } catch (err) {
        setError('Não foi possível carregar as notícias.');
      } finally {
        setLoading(false);
      }
    }
    carregarNoticias();
  }, []);

  const destaque = useMemo(() => (noticias.length > 0 ? noticias[0] : null), [noticias]);
  const demais = useMemo(() => (noticias.length > 1 ? noticias.slice(1) : []), [noticias]);
  const principais = useMemo(() => demais.slice(0, 2), [demais]);
  const pequenas = useMemo(() => demais.slice(2), [demais]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="home-message error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Sidebar com widgets */}
      <div className="home-sidebar">
        {/* Placar de Jogos */}
        <div className="widget placar-widget">
          <h3><i className="fas fa-futbol"></i> Placar dos Jogos</h3>
          <div className="jogos-list">
            {PLACAR_JOGOS.map((jogo, index) => (
              <div key={index} className="jogo-item">
                <div className="jogo-times">
                  <span className="time">{jogo.time1}</span>
                  <span className="placar">{jogo.placar1} x {jogo.placar2}</span>
                  <span className="time">{jogo.time2}</span>
                </div>
                <div className="jogo-status">{jogo.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Previsão do Tempo */}
        <div className="widget tempo-widget">
          <h3><i className="fas fa-cloud-sun"></i> Previsão do Tempo</h3>
          <div className="tempo-info">
            <div className="tempo-principal">
              <span className="cidade">{PREVISAO_TEMPO.cidade}</span>
              <span className="temperatura">{PREVISAO_TEMPO.temperatura}°C</span>
              <span className="descricao">{PREVISAO_TEMPO.descricao}</span>
            </div>
            <div className="tempo-detalhes">
              <div className="detalhe">
                <i className="fas fa-tint"></i>
                <span>Umidade: {PREVISAO_TEMPO.umidade}%</span>
              </div>
              <div className="detalhe">
                <i className="fas fa-wind"></i>
                <span>Vento: {PREVISAO_TEMPO.vento}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bolsa de Valores */}
        <div className="widget bolsa-widget">
          <h3><i className="fas fa-chart-line"></i> Bolsa de Valores</h3>
          <div className="acoes-list">
            {BOLSA_VALORES.map((acao, index) => (
              <div key={index} className="acao-item">
                <span className="acao-nome">{acao.acao}</span>
                <span className="acao-valor">R$ {acao.valor}</span>
                <span className={`acao-variacao ${acao.cor}`}>{acao.variacao}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="home-main">
        {/* Header com widgets para mobile */}
        <div className="home-header">
          <div className="widgets-row">
            {/* Placar de Jogos */}
            <div className="widget placar-widget">
              <h3><i className="fas fa-futbol"></i> Placar dos Jogos</h3>
              <div className="jogos-list">
                {PLACAR_JOGOS.map((jogo, index) => (
                  <div key={index} className="jogo-item">
                    <div className="jogo-times">
                      <span className="time">{jogo.time1}</span>
                      <span className="placar">{jogo.placar1} x {jogo.placar2}</span>
                      <span className="time">{jogo.time2}</span>
                    </div>
                    <div className="jogo-status">{jogo.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previsão do Tempo */}
            <div className="widget tempo-widget">
              <h3><i className="fas fa-cloud-sun"></i> Previsão do Tempo</h3>
              <div className="tempo-info">
                <div className="tempo-principal">
                  <span className="cidade">{PREVISAO_TEMPO.cidade}</span>
                  <span className="temperatura">{PREVISAO_TEMPO.temperatura}°C</span>
                  <span className="descricao">{PREVISAO_TEMPO.descricao}</span>
                </div>
                <div className="tempo-detalhes">
                  <div className="detalhe">
                    <i className="fas fa-tint"></i>
                    <span>Umidade: {PREVISAO_TEMPO.umidade}%</span>
                  </div>
                  <div className="detalhe">
                    <i className="fas fa-wind"></i>
                    <span>Vento: {PREVISAO_TEMPO.vento}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bolsa de Valores */}
            <div className="widget bolsa-widget">
              <h3><i className="fas fa-chart-line"></i> Bolsa de Valores</h3>
              <div className="acoes-list">
                {BOLSA_VALORES.map((acao, index) => (
                  <div key={index} className="acao-item">
                    <span className="acao-nome">{acao.acao}</span>
                    <span className="acao-valor">R$ {acao.valor}</span>
                    <span className={`acao-variacao ${acao.cor}`}>{acao.variacao}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Destaques (1 grande + 2 médios) */}
        <section className="hero-grid">
          {destaque && (
            <article className="hero-large">
              <div className="card-media" style={{ backgroundImage: `url(${destaque.imagemUrl || ''})` }} />
              <div className="card-overlay">
                <span className="card-tag">Destaque</span>
                <h1 className="card-title">{destaque.titulo}</h1>
                <p className="card-subtitle">{destaque.subtitulo || destaque.resumo}</p>
              </div>
            </article>
          )}
          {principais.map((n) => (
            <article key={n.id} className="hero-medium">
              <div className="card-media" style={{ backgroundImage: `url(${n.imagemUrl || ''})` }} />
              <div className="card-overlay">
                <h2 className="card-title">{n.titulo}</h2>
                <p className="card-subtitle">{n.subtitulo || n.resumo}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Demais notícias (cards menores) */}
        <h3 className="section-title">Últimas Notícias</h3>
        <section className="grid-noticias">
          {pequenas.map((n) => (
            <article key={n.id} className="card-noticia">
              <div className="card-media" style={{ backgroundImage: `url(${n.imagemUrl || ''})` }} />
              <div className="card-body">
                <h2 className="card-title">{n.titulo}</h2>
                <p className="card-subtitle">{n.subtitulo || n.resumo}</p>
                <div className="card-meta">
                  <span><i className="far fa-clock"></i> {new Date(n.dataPublicacao || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Home;
