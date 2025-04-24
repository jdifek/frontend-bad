import { useEffect } from 'react'
import { RoutesConfig } from './routes'
import { Navigation } from './components/Navigation'
import { ToastContainer } from 'react-toastify'
import { useAuth } from './helpers/context/AuthContext'

export const App = () => {
	const { login, isLoading } = useAuth()

	useEffect(() => {
    const tg = window.Telegram?.WebApp;
  
    if (tg) {
      console.log('Telegram.WebApp найден, версия:', tg.version);
      tg.ready();
      if (tg.isVersionAtLeast('8.0')) {
        tg.requestFullscreen();
        tg.setHeaderColor('#000000');
      } else {
        tg.expand();
        console.log(
          'Bot API ниже 8.0, используется expand(). Текущая версия Telegram:',
          tg.version
        );
      }
  
      const initData = tg.initDataUnsafe;
      if (initData?.user) {
        console.log('Данные пользователя:', initData.user);
        login({
          telegramId: initData.user.id.toString(),
          name: initData.user.first_name || initData.user.username || 'User',
          photoUrl: initData.user.photo_url || undefined,
        });
      } else {
        console.log('User data not available in initData');
      }
    } else {
      console.log('Telegram.WebApp не доступен. Окружение:', {
        windowLocation: window.location.href,
        userAgent: navigator.userAgent,
      });
      // Для локальной разработки можно использовать тестовые данные
      login({
        telegramId: '6464907797',
        name: 'Test User',
        photoUrl: undefined,
      });
    }
  }, [login]);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-blue-50 flex items-center justify-center'>
				Загрузка...
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-blue-50'>
			<Navigation />
			<div className='max-w-5xl mx-auto p-4'>
				<RoutesConfig />
			</div>
			<ToastContainer />
		</div>
	)
}

export default App
