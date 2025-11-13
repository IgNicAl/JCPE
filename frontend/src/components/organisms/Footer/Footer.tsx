import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSection from '@/components/molecules/NewsletterSection';
import CommentsSection from '@/components/molecules/CommentsSection';
import InstagramGrid from '@/components/molecules/InstagramGrid';
import { NEWS_CATEGORIES } from '@/utils/constants';
import logoImg from '@/assets/logo.svg';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>

        {/* Container 1: Com 2 colunas internas */}
        <div className={styles.leftFooter}>
          {/* Coluna 1.1: Logo, Descrição e Newsletter */}
          <div className={styles.footerLeftColumn}>
            <div className={styles.logoContainer}>
              <img src={logoImg} alt="JCPE Logo" className={styles.logo} />
            </div>
            <p className={styles.footerDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin
            </p>
            <div className={styles.section}>
              <div className={styles.titleSection}>
                <div className={styles.titleIndicator} />
                <h4 className={styles.sectionTitle}>Newsletters</h4>
              </div>
              <NewsletterSection />
            </div>
          </div>

          {/* Coluna 1.2: Categories e Social Network */}
          <div className={styles.categoriesAndSocial}>
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
        </div>

        {/* Container 2: Comments Section */}
        <div className={styles.newComments}>
          <CommentsSection />
        </div>

        {/* Container 3: Instagram Grid */}
        <div className={styles.instagramSection}>
          <InstagramGrid />
        </div>

      </div>

      {/* Copyright */}
      <div className={styles.footerBottom}>
        <p>
          <Link to="/sobre" style={{ color: 'inherit', marginRight: '15px' }}>Sobre</Link>
          <Link to="/contato" style={{ color: 'inherit', marginRight: '15px' }}>Contato</Link>
          Privacy Policy | Terms & Conditions
        </p>
        <p>All Copyright (C) 2022 Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;

