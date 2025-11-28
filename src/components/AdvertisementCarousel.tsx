import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdvertisementCarousel.css';

interface Advertisement {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl?: string;
    productId?: {
        _id: string;
        name: string;
        price: number;
    };
}

const AdvertisementCarousel: React.FC = () => {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/advertisements/active?limit=5`);
            setAds(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement publicités:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ads.length === 0) return;

        // Auto-rotation toutes les 5 secondes
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [ads.length]);

    useEffect(() => {
        // Tracker l'impression
        if (ads[currentIndex]) {
            trackImpression(ads[currentIndex]._id);
        }
    }, [currentIndex, ads]);

    const trackImpression = async (adId: string) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/advertisements/${adId}/impression`);
        } catch (error) {
            console.error('Erreur tracking impression:', error);
        }
    };

    const handleClick = async (ad: Advertisement) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/advertisements/${ad._id}/click`);

            if (ad.linkUrl) {
                window.location.href = ad.linkUrl;
            } else if (ad.productId) {
                window.location.href = `/product/${ad.productId._id}`;
            }
        } catch (error) {
            console.error('Erreur tracking clic:', error);
        }
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
    };

    if (loading) {
        return (
            <div className="ad-carousel-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (ads.length === 0) {
        return null;
    }

    const currentAd = ads[currentIndex];

    return (
        <div className="advertisement-carousel">
            <div className="ad-container" onClick={() => handleClick(currentAd)}>
                <img
                    src={currentAd.imageUrl}
                    alt={currentAd.title}
                    className="ad-image"
                />
                <div className="ad-overlay">
                    <div className="ad-content">
                        <h3 className="ad-title">{currentAd.title}</h3>
                        <p className="ad-description">{currentAd.description}</p>
                        {currentAd.productId && (
                            <div className="ad-product-info">
                                <span className="ad-product-name">{currentAd.productId.name}</span>
                                <span className="ad-product-price">{currentAd.productId.price} DT</span>
                            </div>
                        )}
                        <button className="ad-cta">Découvrir</button>
                    </div>
                </div>
            </div>

            {/* Navigation buttons */}
            {ads.length > 1 && (
                <>
                    <button className="ad-nav-button ad-nav-prev" onClick={(e) => { e.stopPropagation(); goToPrevious(); }}>
                        ‹
                    </button>
                    <button className="ad-nav-button ad-nav-next" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
                        ›
                    </button>
                </>
            )}

            {/* Indicateurs */}
            {ads.length > 1 && (
                <div className="ad-indicators">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                            aria-label={`Publicité ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdvertisementCarousel;
