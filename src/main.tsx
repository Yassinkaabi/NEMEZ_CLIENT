import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { ConfigProvider, Spin } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { HelmetProvider } from 'react-helmet-async';
import { persistor, store } from './store';
import App from './App';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ConfigProvider
            locale={frFR}
            theme={{
              token: {
                colorPrimary: '#E53935',
                colorLink: '#E53935',
                borderRadius: 8,
                fontFamily: 'Poppins, Inter, sans-serif'
              }
            }}
          >
            <PersistGate loading={<Spin size="large" style={{ display: 'block', margin: '100px auto' }} />} persistor={persistor}>
              <App />
            </PersistGate>
          </ConfigProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </HelmetProvider>
);