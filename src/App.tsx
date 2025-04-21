import { useEffect } from 'react';
import { RoutesConfig } from './routes';
import { Navigation } from './components/Navigation';
import { ToastContainer } from 'react-toastify';

export const App = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      if (tg.isVersionAtLeast('8.0')) {
        tg.requestFullscreen();
        tg.setHeaderColor('#000000');
      } else {
        tg.expand();
        console.log('Bot API ниже 8.0, используется expand(). Текущая версия Telegram:', tg.version);
      }
    } else {
      console.log('Telegram.WebApp не доступен');
    }
  }, []);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navigation />
      <div className='max-w-5xl mx-auto p-4'>
        <RoutesConfig />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;