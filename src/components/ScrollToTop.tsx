import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin } from 'antd';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(92, 91, 91, 0.541)',
      zIndex: 9999,
      backdropFilter: 'blur(10px)'
    }}>
      <Spin size="large" />
    </div>
  );
}