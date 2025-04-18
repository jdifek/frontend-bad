import { useEffect } from 'react';
import { RoutesConfig } from './routes';
import { Navigation } from './components/Navigation';
import { ToastContainer } from 'react-toastify';

export const App = () => {

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();

      // Проверяем поддержку Bot API 8.0+
      if (tg.isVersionAtLeast('8.0')) {
        // Пробуем активировать полноэкранный режим
        tg.requestFullscreen();
        tg.setHeaderColor('#000000'); // Устанавливаем цвет заголовка (рекомендуется в полноэкранном режиме)
      } else {
        // Для старых версий используем expand()
        tg.expand();
        console.log('Bot API ниже 8.0, используется expand(). Текущая версия Telegram:', tg.version);
      }
    } else {
      console.log('Telegram.WebApp не доступен');
    }
  }, []);

  return (
    <div className='min-h-screen bg-neutral-beige'>
      <Navigation />
      <div className='max-w-5xl mx-auto p-4'>
        <RoutesConfig />
        
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;