import { useEffect } from 'react';
import { RoutesConfig } from './routes';
import { Navigation } from './components/Navigation';
import { ToastContainer } from 'react-toastify';

export const App = () => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg) {
      tg.ready();
      // Проверяем поддержку Bot API 8.0+
      if (tg.isVersionAtLeast('8.0')) {
        // Запрашиваем полноэкранный режим
        tg.requestFullscreen();
        // Устанавливаем цвет заголовка (рекомендуется в полноэкранном режиме)
        tg.setHeaderColor('#000000'); // Установите подходящий цвет, например, чёрный
        // Проверяем, активирован ли полноэкранный режим
        console.log('Полноэкранный режим активен:', tg.isFullscreen);
      } else {
        // Для старых версий используем expand()
        tg.expand();
      }
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