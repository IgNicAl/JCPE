import React from 'react';
import styles from './CommentsSection.module.css';

interface Comment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

const CommentsSection: React.FC = () => {
  // Dados de exemplo - substituir por dados reais da API
  const comments: Comment[] = [
    {
      id: '1',
      author: 'João Silva',
      text: 'Excelente artigo sobre tecnologia! Muito informativo.',
      timeAgo: '2 horas atrás',
    },
    {
      id: '2',
      author: 'Maria Santos',
      text: 'Adorei a análise sobre economia. Parabéns pela qualidade!',
      timeAgo: '5 horas atrás',
    },
    {
      id: '3',
      author: 'Pedro Costa',
      text: 'Muito interessante essa perspectiva sobre política.',
      timeAgo: '1 dia atrás',
    },
    {
      id: '4',
      author: 'Ana Oliveira',
      text: 'Ótima cobertura do evento esportivo. Continuem assim!',
      timeAgo: '2 dias atrás',
    },
  ];

  return (
    <div className={styles.commentsSection}>
      <div className={styles.titleSection}>
        <div className={styles.titleIndicator} />
        <h4 className={styles.sectionTitle}>New Comments</h4>
      </div>

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>{comment.author}</span>
              <span className={styles.commentTime}>{comment.timeAgo}</span>
            </div>
            <p className={styles.commentText}>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;

