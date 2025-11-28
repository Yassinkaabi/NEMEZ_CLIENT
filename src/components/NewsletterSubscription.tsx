import React, { useState } from 'react';
import axios from 'axios';
import './NewsletterSubscription.css';

const NewsletterSubscription: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setMessage('Veuillez entrer votre email');
            setIsSuccess(false);
            return;
        }

        // Validation email simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Veuillez entrer un email valide');
            setIsSuccess(false);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, {
                email,
                preferences: {
                    newArrivals: true,
                    promotions: true,
                    weeklyDigest: false
                }
            });

            setMessage(response.data.message);
            setIsSuccess(true);
            setEmail('');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Une erreur est survenue');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="newsletter-subscription">
            <div className="newsletter-content">
                <div className="newsletter-icon">📧</div>
                <h3 className="newsletter-title">Restez informé des nouveautés !</h3>
                <p className="newsletter-description">
                    Inscrivez-vous à notre newsletter et recevez en avant-première nos nouvelles collections et offres exclusives.
                </p>

                <form onSubmit={handleSubmit} className="newsletter-form">
                    <div className="newsletter-input-group">
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="newsletter-input"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="newsletter-button"
                            disabled={loading}
                        >
                            {loading ? 'Inscription...' : 'S\'abonner'}
                        </button>
                    </div>

                    {message && (
                        <div className={`newsletter-message ${isSuccess ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                </form>

                <p className="newsletter-privacy">
                    En vous inscrivant, vous acceptez de recevoir nos emails. Vous pouvez vous désabonner à tout moment.
                </p>
            </div>
        </div>
    );
};

export default NewsletterSubscription;
