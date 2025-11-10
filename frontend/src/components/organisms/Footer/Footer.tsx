import React from 'react';
import NewsletterSection from '@/components/molecules/NewsletterSection';
import CommentsSection from '@/components/molecules/CommentsSection';
import InstagramGrid from '@/components/molecules/InstagramGrid';
import { NEWS_CATEGORIES } from '@/utils/constants';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Coluna Esquerda: Mega News + Newsletter */}
        <div className={styles.footerLeftColumn}>
          <NewsletterSection />
        </div>

        {/* Coluna Meio: Categories + Social Network */}
        <div className={styles.footerMiddleColumn}>
          {/* Categories */}
          <div className={styles.section}>
            <div className={styles.titleSection}>
              <div className={styles.titleIndicator} />
              <h4 className={styles.sectionTitle}>Categories</h4>
            </div>
            <div className={styles.categoriesList}>
              {NEWS_CATEGORIES.map((cat) => (
                <a key={cat.id} href={`/categoria/${cat.id}`} className={styles.categoryItem}>
                  {cat.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Network */}
          <div className={styles.section}>
            <div className={styles.titleSection}>
              <div className={styles.titleIndicator} />
              <h4 className={styles.sectionTitle}>social network</h4>
            </div>
            <div className={styles.socialButtons}>
              <button className={styles.instagramButton}>
                <i className="fab fa-instagram" />
                <span>instagram</span>
              </button>
              <button className={styles.twitterButton}>
                <i className="fab fa-twitter" />
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita: New Comments e Follow On Instagram lado a lado */}
        <div className={styles.footerRightColumn}>
          <CommentsSection />
          <InstagramGrid />
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.footerBottom}>
        <p>Privacy Policy | Terms & Conditions</p>
        <p>All Copyright (C) 2022 Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;

