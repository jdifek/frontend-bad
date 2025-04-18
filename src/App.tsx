import { useEffect } from 'react'
import { RoutesConfig } from './routes'
import { Navigation } from './components/Navigation'
import { ToastContainer } from 'react-toastify'

export const App = () => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Можно оставить для совместимости со старыми версиями
      tg.requestFullscreen(); // Запрашиваем полноэкранный режим
      // Рекомендуется установить цвет заголовка
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
}

export default App;