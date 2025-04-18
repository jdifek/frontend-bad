import { useEffect, useState } from 'react';
import { RoutesConfig } from './routes';
import { Navigation } from './components/Navigation';
import { ToastContainer } from 'react-toastify';

export const App = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      // Попробуем без вызова ready()
      tg.ready();

      // Проверяем поддержку Bot API 8.0+
      if (tg.isVersionAtLeast('8.0')) {
        // Пробуем активировать полноэкранный режим
        tg.requestFullscreen();
        tg.setHeaderColor('#000000'); // Устанавливаем цвет заголовка (рекомендуется в полноэкранном режиме)

        // Проверяем, сработал ли полноэкранный режим
        setTimeout(() => {
          setIsFullscreen(tg.isFullscreen);
          if (!tg.isFullscreen) {
            console.log('Полноэкранный режим не активирован. Текущая версия Telegram:', tg.version);
          } else {
            console.log('Полноэкранный режим успешно активирован');
          }
        }, 500);
      } else {
        // Для старых версий используем expand()
        tg.expand();
        console.log('Bot API ниже 8.0, используется expand(). Текущая версия Telegram:', tg.version);
      }
    } else {
      console.log('Telegram.WebApp не доступен');
    }
  }, []);

  // Добавляем возможность вызова requestFullscreen() при взаимодействии пользователя
  const handleStart = () => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.isVersionAtLeast('8.0') && !tg.isFullscreen) {
      tg.requestFullscreen();
      tg.setHeaderColor('#000000');
      setTimeout(() => {
        setIsFullscreen(tg.isFullscreen);
        if (!tg.isFullscreen) {
          console.log('Полноэкранный режим не активирован даже после клика');
        }
      }, 500);
    }
  };

  return (
    <div className='min-h-screen bg-neutral-beige'>
      <Navigation />
      <div className='max-w-5xl mx-auto p-4'>
        <RoutesConfig />
        {/* Добавляем кнопку для пользовательского взаимодействия */}
        {!isFullscreen && (
          <button onClick={handleStart} className="mt-4 p-2 bg-green-500 text-white rounded">
            Открыть на весь экран
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;