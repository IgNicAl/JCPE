import React, { useEffect, useState } from 'react';
import { Advertisement } from '@/types/advertisement';
import { advertisementService } from '@/services/advertisementService';
import './AdWidget.css';

interface AdWidgetProps {
  className?: string;
  location: 'id' | 'class';
}

const AdWidget: React.FC<AdWidgetProps> = ({ className = '', location }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    loadAds();
  }, [location]);

  const loadAds = async () => {
    try {
      const adsData = await advertisementService.getByLocation(location);
      setAds(adsData);
      
      // Track impressions
      adsData.forEach(ad => {
        if (ad.id) {
          advertisementService.trackImpression(ad.id);
        }
      });
    } catch (error) {
      console.error('Error loading advertisements:', error);
    }
  };

  const handleAdClick = (ad: Advertisement) => {
    if (ad.id) {
      advertisementService.trackClick(ad.id);
    }
    if (ad.linkUrl) {
      window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Rotate ads every 5 seconds if there are multiple
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) {
    return (
      <div className={`sidebar-widget ad-widget ${className}`}>
        <div className="ad-placeholder">
          <span>Publicidade</span>
          <small>350 px × 180 px</small>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className={`sidebar-widget ad-widget ${className}`}>
      <div 
        className="ad-content"
        onClick={() => handleAdClick(currentAd)}
        style={{ cursor: currentAd.linkUrl ? 'pointer' : 'default' }}
        role={currentAd.linkUrl ? 'link' : 'img'}
        tabIndex={currentAd.linkUrl ? 0 : -1}
        onKeyDown={(e) => {
          if (currentAd.linkUrl && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleAdClick(currentAd);
          }
        }}
      >
        <img 
          src={currentAd.imageUrl} 
          alt={currentAd.title}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
        {ads.length > 1 && (
          <div className="ad-indicator">
            {ads.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentAdIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="ad-title">{currentAd.title}</div>
    </div>
  );
};

export default AdWidget;
